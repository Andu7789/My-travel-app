import React, { useCallback } from 'react';
import type { UploadProgress } from '../types';

interface PhotoUploadProps {
  selectedTripId?: string;
  onUpload: (files: File[], tripId: string) => void;
  uploadProgress: UploadProgress[];
  isUploading: boolean;
}

/**
 * Photo Upload Component
 * Handles drag-drop and file selection for photo uploads
 */
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  selectedTripId,
  onUpload,
  uploadProgress,
  isUploading,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0 && selectedTripId) {
        onUpload(files as File[], selectedTripId);
      }
    },
    [selectedTripId, onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.currentTarget.files || []);
      if (files.length > 0 && selectedTripId) {
        onUpload(files, selectedTripId);
      }
    },
    [selectedTripId, onUpload]
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${!selectedTripId && 'opacity-50 cursor-not-allowed'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={!selectedTripId || isUploading}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!selectedTripId || isUploading}
          className="w-full"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="20" r="4" stroke="currentColor" strokeWidth={2} />
          </svg>

          <p className="text-sm font-medium text-gray-700">
            {selectedTripId ? 'Drag photos here or click to select' : 'Select a trip first'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF, HEIC up to 50MB each
          </p>
        </button>
      </div>

      {uploadProgress.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadProgress.map((progress) => (
            <div key={progress.filename} className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {progress.filename}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    progress.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.error && (
                <p className="text-xs text-red-500">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
