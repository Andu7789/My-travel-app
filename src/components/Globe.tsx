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
        
        if (containerRef.current && !viewerRef.current) {
          try {
            const viewer = new Cesium.Viewer(containerRef.current, {
              baseLayerPicker: false,
              homeButton: true,
              geocoder: false,
              timeline: false,
              animation: false,
              infoBox: false,
              selectionIndicator: false,
              shadows: false,
              sceneModePicker: false,
              navigationHelpButton: false,
              fullscreenButton: false,
            });

            // Use simple OSM imagery
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(
              new Cesium.UrlImageryProvider({
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                credit: new Cesium.Credit('OpenStreetMap contributors'),
              })
            );

            viewer.scene.globe.enableLighting = false;
            
            // Fly to default location (world view)
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
                    pin.latitude,
                    100000
                  ),
                  point: {
                    pixelSize: 12,
                    color: Cesium.Color.fromCssColorString('#a855f7'),
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

            // Add click handler for pins
            const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((click) => {
              const pickedObject = viewer.scene.pick(click.position);
              if (Cesium.defined(pickedObject) && pickedObject.id && onPinClick) {
                onPinClick(pickedObject.id);
              }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            viewerRef.current = viewer;
          } catch (viewerError) {
            console.error('Cesium viewer error:', viewerError);
            throw viewerError;
          }
        }
      } catch (error) {
        console.error('Failed to initialize Cesium:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-b from-slate-700 to-slate-900">
              <div class="text-center text-white p-6">
                <p class="text-lg font-bold mb-3">🌍 3D Globe Loading...</p>
                <p class="text-sm text-slate-300">Using OpenStreetMap (free layer, no token needed)</p>
                <p class="text-xs text-slate-400 mt-4">Please wait...</p>
              </div>
            </div>
          `;
        }
      }
    };

    initializeCesium();

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying viewer:', e);
        }
        viewerRef.current = null;
      }
    };
  }, [photos, onPinClick]);

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
