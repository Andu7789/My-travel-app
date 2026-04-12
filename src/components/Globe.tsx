import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PhotoPin } from '../types';

interface GlobeProps {
  photos: PhotoPin[];
  selectedPin?: PhotoPin;
  onPinClick?: (pin: PhotoPin) => void;
  onLocationClick?: (lat: number, lng: number) => void;
}

/**
 * Interactive Map Component
 * Displays world map with photo pins using Leaflet
 */
export const Globe: React.FC<GlobeProps> = ({
  photos,
  selectedPin,
  onPinClick,
  onLocationClick,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<Map<string, L.Marker>>(new Map());

  React.useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      // Initialize map
      const map = L.map(containerRef.current).setView([20, 0], 3);

      // Add OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add photo pins
      if (photos && photos.length > 0) {
        photos.forEach((pin) => {
          const marker = L.circleMarker(
            [pin.latitude, pin.longitude],
            {
              radius: 8,
              fillColor: '#a855f7',
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }
          ).addTo(map);

          marker.on('click', () => {
            if (onPinClick) {
              onPinClick(pin);
            }
            map.setView([pin.latitude, pin.longitude], 8);
          });

          marker.bindPopup(
            `<div class="text-sm"><strong>📍 ${pin.photos.length} photo${pin.photos.length !== 1 ? 's' : ''}</strong></div>`,
            { className: 'leaflet-popup-dark' }
          );

          markersRef.current.set(pin.latitude + ',' + pin.longitude, marker);
        });
      }

      mapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
    };
  }, [photos, onPinClick]);

  // Handle selected pin
  React.useEffect(() => {
    if (selectedPin && mapRef.current) {
      mapRef.current.setView([selectedPin.latitude, selectedPin.longitude], 10);
    }
  }, [selectedPin]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900"
    >
      <style>{`
        .leaflet-popup-dark .leaflet-popup-content-wrapper {
          background-color: #1e293b;
          color: #e2e8f0;
          border-radius: 8px;
        }
        .leaflet-popup-dark .leaflet-popup-tip {
          background-color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default Globe;
