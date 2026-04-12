import React from 'react';

interface MapControlsProps {
  onResetView: () => void;
  on3DToggle: () => void;
  is3D: boolean;
  basemap: 'satellite' | 'street' | 'topographic';
  onBasemapChange: (basemap: 'satellite' | 'street' | 'topographic') => void;
}

/**
 * Map Controls Component
 * Controls for the globe/map (reset view, 3D/2D toggle, basemap selection)
 */
export const MapControls: React.FC<MapControlsProps> = ({
  onResetView,
  on3DToggle,
  is3D,
  basemap,
  onBasemapChange,
}) => {
  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={onResetView}
        title="Reset view to home"
        className="p-2 hover:bg-gray-100 rounded transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12a9 9 0 0112-8.94m0 0A9.004 9.004 0 0115 3m0 0a8.968 8.968 0 0112 8.94M15 3a8.968 8.968 0 0112 8.94m0 0A9.004 9.004 0 0115 21m0 0a8.968 8.968 0 01-12-8.94"
          />
        </svg>
      </button>

      <div className="border-t border-gray-200" />

      <button
        onClick={on3DToggle}
        title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
        className={`p-2 rounded transition ${
          is3D ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div className="border-t border-gray-200" />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600 px-2">Basemap</label>
        <select
          value={basemap}
          onChange={(e) =>
            onBasemapChange(e.target.value as 'satellite' | 'street' | 'topographic')
          }
          className="px-2 py-1 text-xs border border-gray-300 rounded hover:border-gray-400"
        >
          <option value="satellite">Satellite</option>
          <option value="street">Street</option>
          <option value="topographic">Topographic</option>
        </select>
      </div>
    </div>
  );
};

export default MapControls;
