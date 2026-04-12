import React, { useState, useEffect } from 'react';
import type { Photo } from '../types';

interface PhotoGalleryProps {
  photos: Photo[];
  selectedPhoto?: Photo;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * Photo Gallery Component
 * Modal carousel for viewing photos with navigation
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  selectedPhoto,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedPhoto) {
      const index = photos.findIndex((p) => p.id === selectedPhoto.id);
      setCurrentIndex(Math.max(0, index));
    }
  }, [selectedPhoto, photos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrevious, onClose]);

  if (!isOpen || photos.length === 0 || !photos[currentIndex]) {
    return null;
  }

  const photo = photos[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center w-full h-full">
        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <img
            src={photo.url}
            alt={photo.filename}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Metadata */}
        <div className="w-full bg-black bg-opacity-80 text-white p-4">
          <h3 className="text-lg font-semibold mb-2">{photo.filename}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <div>Date: {new Date(photo.date_taken).toLocaleDateString()}</div>
            <div>
              Coords: {photo.latitude.toFixed(4)}°, {photo.longitude.toFixed(4)}°
            </div>
            {photo.camera_info && <div>Camera: {photo.camera_info}</div>}
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full bg-black bg-opacity-80 text-white px-4 py-4 flex items-center justify-between">
          <button
            onClick={onPrevious}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center space-x-2">
            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto max-w-md">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 transition ${
                    idx === currentIndex
                      ? 'border-blue-500'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={p.thumbnail_url || p.url}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

            <span className="text-sm text-gray-400 flex-shrink-0">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <button
            onClick={onNext}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition disabled:opacity-50"
            disabled={currentIndex === photos.length - 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-sm text-gray-400">
        Use arrow keys to navigate • ESC to close
      </div>
    </div>
  );
};

export default PhotoGallery;
