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
    <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-black z-50 flex items-center justify-center backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 hover:scale-110"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center w-full h-full">
        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative">
            <img
              src={photo.url}
              alt={photo.filename}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 pointer-events-none"></div>
          </div>
        </div>

        {/* Metadata */}
        <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md text-white p-6 border-y border-slate-700">
          <h3 className="text-lg font-bold mb-3 text-cyan-300">{photo.filename}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-slate-300">📅 <span className="text-slate-100">{new Date(photo.date_taken).toLocaleDateString()}</span></div>
            <div className="text-slate-300">📍 <span className="text-slate-100">{photo.latitude.toFixed(4)}°, {photo.longitude.toFixed(4)}°</span></div>
            {photo.camera_info && <div className="col-span-2 text-slate-300">📷 <span className="text-slate-100">{photo.camera_info}</span></div>}
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-t border-slate-700">
          <button
            onClick={onPrevious}
            className="p-3 hover:bg-purple-500 hover:bg-opacity-40 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-30"
            disabled={currentIndex === 0}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center space-x-3">
            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto max-w-md">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    idx === currentIndex
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={p.thumbnail_url || p.url}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>

            <span className="text-sm text-cyan-300 font-semibold flex-shrink-0 bg-slate-700 px-3 py-1 rounded-full">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <button
            onClick={onNext}
            className="p-3 hover:bg-purple-500 hover:bg-opacity-40 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-30"
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
