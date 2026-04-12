import React, { useState, useEffect } from 'react';
import { Globe } from './components/Globe';
import { Sidebar } from './components/Sidebar';
import { PhotoUpload } from './components/PhotoUpload';
import { PhotoGallery } from './components/PhotoGallery';
import { MapControls } from './components/MapControls';
import {
  fetchAllPhotos,
  fetchAllTrips,
  uploadPhotoToStorage,
  insertPhotoMetadata,
  createTrip,
} from './lib/supabaseClient';
import { extractExifData, formatExifDate } from './lib/exifExtractor';
import { compressImage, createThumbnail } from './lib/imageCompression';
import type { Photo, PhotoPin, UploadProgress, AppState } from './types';
import './App.css';

/**
 * Main App Component
 * Coordinates all sub-components and manages global state
 */
function App() {
  const [state, setState] = useState<AppState>({
    photos: [],
    trips: [],
    uploadProgress: [],
    isLoading: true,
  });

  const [is3D, setIs3D] = useState(true);
  const [basemap, setBasemap] = useState<'satellite' | 'street' | 'topographic'>(
    'satellite'
  );
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [newTripData, setNewTripData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  // Load photos and trips on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const [photos, trips] = await Promise.all([
          fetchAllPhotos(),
          fetchAllTrips(),
        ]);

        setState((prev) => ({
          ...prev,
          photos: photos || [],
          trips: trips || [],
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error loading data:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to load photos and trips',
          isLoading: false,
        }));
      }
    };

    loadData();
  }, []);

  // Convert flat photos array to pins grouped by location
  const photoPins: PhotoPin[] = React.useMemo(() => {
    const grouped = new Map<string, Photo[]>();

    state.photos.forEach((photo) => {
      const key = `${photo.latitude.toFixed(2)},${photo.longitude.toFixed(2)}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(photo);
    });

    return Array.from(grouped.entries()).map(([key, photos]) => {
      const [lat, lng] = key.split(',').map(Number);
      return {
        id: key,
        position: { lat, lng },
        photos,
        clusterCount: photos.length,
      };
    });
  }, [state.photos]);

  // Filter photos by selected trip
  const filteredPhotos = React.useMemo(() => {
    if (!state.selectedTrip) {
      return state.photos;
    }
    return state.photos.filter((p) => p.trip_id === state.selectedTrip!.id);
  }, [state.photos, state.selectedTrip]);

  // Handle photo upload
  const handlePhotoUpload = async (files: File[], tripId: string) => {
    const progress: UploadProgress[] = files.map((f) => ({
      filename: f.name,
      progress: 0,
      status: 'pending',
    }));

    setState((prev) => ({
      ...prev,
      uploadProgress: progress,
    }));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressIndex = i;

      try {
        // Update progress
        setState((prev) => ({
          ...prev,
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex ? { ...p, status: 'processing', progress: 10 } : p
          ),
        }));

        // Extract EXIF data
        const exifData = await extractExifData(file);

        if (!exifData?.latitude || !exifData?.longitude) {
          // TODO: Implement manual location selection modal
          console.warn(
            'No GPS data found in EXIF. Manual location selection needed.'
          );
          setState((prev) => ({
            ...prev,
            uploadProgress: prev.uploadProgress.map((p, idx) =>
              idx === progressIndex
                ? {
                    ...p,
                    status: 'error',
                    error: 'No GPS data. Manual tagging needed.',
                  }
                : p
            ),
          }));
          continue;
        }

        // Compress image
        setState((prev) => ({
          ...prev,
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex ? { ...p, progress: 20 } : p
          ),
        }));

        const compressedBlob = await compressImage(file);
        const compressedFile = new File(
          [compressedBlob],
          file.name,
          { type: file.type }
        );

        // Create thumbnail
        const thumbnail = await createThumbnail(file);

        // Upload to Supabase Storage
        setState((prev) => ({
          ...prev,
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex ? { ...p, progress: 50 } : p
          ),
        }));

        const { publicUrl } = await uploadPhotoToStorage(
          compressedFile,
          tripId,
          (progress) => {
            setState((prev) => ({
              ...prev,
              uploadProgress: prev.uploadProgress.map((p, idx) =>
                idx === progressIndex
                  ? { ...p, progress: 50 + progress * 0.3 }
                  : p
              ),
            }));
          }
        );

        // Insert metadata to database
        setState((prev) => ({
          ...prev,
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex ? { ...p, progress: 85 } : p
          ),
        }));

        const photoData = {
          trip_id: tripId,
          url: publicUrl,
          latitude: exifData.latitude,
          longitude: exifData.longitude,
          date_taken: formatExifDate(exifData.dateTime) || new Date().toISOString(),
          camera_info: exifData.camera,
          filename: file.name,
          thumbnail_url: thumbnail,
          exif_data: exifData as Record<string, unknown>,
        };

        const newPhoto = await insertPhotoMetadata(photoData);

        // Update local state
        setState((prev) => ({
          ...prev,
          photos: [newPhoto, ...prev.photos],
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex ? { ...p, progress: 100, status: 'complete' } : p
          ),
        }));
      } catch (error) {
        console.error('Upload error:', error);
        setState((prev) => ({
          ...prev,
          uploadProgress: prev.uploadProgress.map((p, idx) =>
            idx === progressIndex
              ? {
                  ...p,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : p
          ),
        }));
      }
    }

    // Clear progress after 3 seconds
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        uploadProgress: [],
      }));
    }, 3000);
  };

  // Handle trip creation
  const handleAddTrip = async () => {
    if (
      !newTripData.name ||
      !newTripData.start_date ||
      !newTripData.end_date
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const newTrip = await createTrip(newTripData);
      setState((prev) => ({
        ...prev,
        trips: [newTrip, ...prev.trips],
        selectedTrip: newTrip,
      }));
      setShowTripModal(false);
      setNewTripData({ name: '', start_date: '', end_date: '', description: '' });
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip');
    }
  };

  // Get current gallery photos (filtered by trip if selected)
  const galleryPhotos =
    state.selectedPin?.photos.filter(
      (p) => !state.selectedTrip || p.trip_id === state.selectedTrip.id
    ) || [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar
        trips={state.trips}
        selectedTrip={state.selectedTrip}
        onSelectTrip={(trip) =>
          setState((prev) => ({ ...prev, selectedTrip: trip }))
        }
        onAddTrip={() => setShowTripModal(true)}
        photoCount={filteredPhotos.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-800 border-b border-slate-700 p-6 flex justify-between items-center backdrop-blur-md">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {state.selectedTrip
              ? `🌍 ${state.selectedTrip.name} · ${filteredPhotos.length} photos`
              : `📸 All Photos · ${filteredPhotos.length} total`}
          </h2>
          {state.isLoading && <span className="text-sm text-purple-400 font-semibold animate-pulse">Loading...</span>}
        </div>

        {/* Globe and Upload Container */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Globe */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-700">
            <div className="relative w-full h-full">
              <Globe
                photos={photoPins}
                selectedPin={state.selectedPin}
                onPinClick={(pin) => {
                  setState((prev) => ({ ...prev, selectedPin: pin }));
                  setGalleryOpen(true);
                }}
                onLocationClick={(lat, lng) => {
                  console.log('Clicked location:', lat, lng);
                  // TODO: Manual location tagging modal
                }}
              />
              <MapControls
                onResetView={() => console.log('Reset view')}
                on3DToggle={() => setIs3D(!is3D)}
                is3D={is3D}
                basemap={basemap}
                onBasemapChange={setBasemap}
              />
            </div>
          </div>

          {/* Sidebar Panel - Upload & Info */}
          <div className="w-96 flex flex-col gap-4 overflow-y-auto">
            {state.selectedTrip && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-5 ring-1 ring-slate-600">
                <h3 className="font-bold text-lg bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-3">
                  🏖️ {state.selectedTrip.name}
                </h3>
                <p className="text-sm text-slate-300">
                  📅 {new Date(state.selectedTrip.start_date).toLocaleDateString()} → {new Date(state.selectedTrip.end_date).toLocaleDateString()}
                </p>
                {state.selectedTrip.description && (
                  <p className="text-sm text-slate-400 mt-3 italic">
                    {state.selectedTrip.description}
                  </p>
                )}
              </div>
            )}

            <PhotoUpload
              selectedTripId={state.selectedTrip?.id}
              onUpload={handlePhotoUpload}
              uploadProgress={state.uploadProgress}
              isUploading={state.uploadProgress.some((p) => p.status === 'uploading')}
            />

            {state.selectedPin && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-5 ring-1 ring-slate-600">
                <h3 className="font-bold text-lg text-cyan-300 mb-3">
                  📍 Location Preview
                </h3>
                <p className="text-sm text-slate-300">
                  {state.selectedPin.photos.length} photo{state.selectedPin.photos.length !== 1 ? 's' : ''} at this location
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {state.selectedPin.photos.slice(0, 6).map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.thumbnail_url || photo.url}
                      alt="thumbnail"
                      className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity ring-1 ring-slate-600"
                      onClick={() => {
                        setState((prev) => ({ ...prev, selectedPhoto: photo }));
                        setGalleryOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={galleryPhotos}
        selectedPhoto={state.selectedPhoto}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onNext={() => {
          const currentIdx = galleryPhotos.findIndex(
            (p) => p.id === state.selectedPhoto?.id
          );
          if (currentIdx < galleryPhotos.length - 1) {
            setState((prev) => ({
              ...prev,
              selectedPhoto: galleryPhotos[currentIdx + 1],
            }));
          }
        }}
        onPrevious={() => {
          const currentIdx = galleryPhotos.findIndex(
            (p) => p.id === state.selectedPhoto?.id
          );
          if (currentIdx > 0) {
            setState((prev) => ({
              ...prev,
              selectedPhoto: galleryPhotos[currentIdx - 1],
            }));
          }
        }}
      />

      {/* Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Trip</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Name *
                </label>
                <input
                  type="text"
                  value={newTripData.name}
                  onChange={(e) =>
                    setNewTripData({ ...newTripData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Europe 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newTripData.start_date}
                  onChange={(e) =>
                    setNewTripData({ ...newTripData, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newTripData.end_date}
                  onChange={(e) =>
                    setNewTripData({ ...newTripData, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTripData.description}
                  onChange={(e) =>
                    setNewTripData({ ...newTripData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add trip notes..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowTripModal(false);
                  setNewTripData({ name: '', start_date: '', end_date: '', description: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrip}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
