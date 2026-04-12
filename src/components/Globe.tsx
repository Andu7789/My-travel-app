import React from 'react';
import type { PhotoPin } from '../types';

interface GlobeProps {
  photos: PhotoPin[];
  selectedPin?: PhotoPin;
  onPinClick?: (pin: PhotoPin) => void;
  onLocationClick?: (lat: number, lng: number) => void;
}

/**
 * Cesium.js 3D Globe Component
 * Displays interactive 3D Earth with photo pins
 */
export const Globe: React.FC<GlobeProps> = ({
  photos,
  selectedPin,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Cesium initialization will happen here in Phase 2
    console.log('Globe component mounted', {
      photos,
      selectedPin,
    });
  }, [photos, selectedPin]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600"
    >
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">3D Globe Loading...</h2>
          <p className="text-xl">Cesium.js will render here in Phase 2</p>
          <div className="mt-8 text-sm opacity-75">
            <p>Photos to display: {photos.length}</p>
            {selectedPin && <p>Selected pin: {selectedPin.photos.length} photos</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe;
