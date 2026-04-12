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
  onPinClick,
  onLocationClick,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const initializeCesium = async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import('cesium');
        
        // Set Cesium Ion token (use default or user provided)
        const cesiumToken = import.meta.env.VITE_CESIUM_ION_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTMzNDMyNS1iOWY3LTQyOGItOTg0OS02YzZhODZkODY2ZjYiLCJpZCI6MjE2NDU5LCJpYXQiOjE3Njk4MDMyNzksImV4cCI6MTgwMjM0MzI3OX0.8dHxXG8CNYE-B3S8iL2qWW_Z_vGSJQK93kYSJJFYmM4';
        Cesium.Ion.defaultAccessToken = cesiumToken;

        if (containerRef.current && !viewerRef.current) {
          const viewer = new Cesium.Viewer(containerRef.current, {
            terrain: Cesium.Terrain.fromWorldTerrain(),
            timeline: false,
            animation: false,
            homeButton: true,
            baseLayerPicker: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false,
          });

          viewer.scene.globe.enableLighting = true;
          
          // Fly to default location
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 15000000),
            duration: 2,
          });

          // Add photo pins
          if (photos && photos.length > 0) {
            photos.forEach((pin) => {
              const entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(
                  pin.longitude,
                  pin.latitude
                ),
                point: {
                  pixelSize: 10,
                  color: Cesium.Color.RED,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                },
                properties: {
                  photosCount: pin.photos.length,
                },
              });

              entity.id = pin;
            });
          }

          viewerRef.current = viewer;
        }
      } catch (error) {
        console.error('Failed to initialize Cesium:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-white bg-gradient-to-b from-slate-700 to-slate-900">
              <div class="text-center">
                <p class="text-xl font-bold mb-2">⚠️ Cesium Loading Error</p>
                <p class="text-sm text-slate-300">${error instanceof Error ? error.message : 'Failed to load 3D globe'}</p>
              </div>
            </div>
          `;
        }
      }
    };

    initializeCesium();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [photos]);

  // Handle pin selection
  React.useEffect(() => {
    if (viewerRef.current && selectedPin) {
      const entity = viewerRef.current.entities.values.find(
        (e: any) => e.id === selectedPin
      );
      if (entity) {
        viewerRef.current.camera.flyTo({
          destination: entity.position,
          duration: 1,
        });
      }
    }
  }, [selectedPin]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm pointer-events-none">
        <div className="text-center">
          <p className="animate-pulse">🌍 Initializing 3D Globe...</p>
        </div>
      </div>
    </div>
  );
};

export default Globe;
