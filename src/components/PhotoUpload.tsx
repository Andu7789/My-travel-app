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
    <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl ring-1 ring-slate-600">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-purple-500 bg-purple-500/20'
            : 'border-slate-600 hover:border-purple-500 hover:bg-slate-700'
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
            className="mx-auto h-12 w-12 text-purple-400 mb-3"
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

          <p className="text-sm font-semibold text-slate-100">
            {selectedTripId ? '📸 Drag photos or click to upload' : '👆 Select a trip first'}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            PNG, JPG, GIF, HEIC up to 50MB each • EXIF location detected
          </p>
        </button>
      </div>

      {uploadProgress.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadProgress.map((progress) => (
            <div key={progress.filename} className="space-y-2">
              <p className="text-sm font-medium text-slate-200 truncate">
                {progress.filename}
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.error && (
                <p className="text-xs text-red-400 font-semibold">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
