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
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-3 ring-1 ring-slate-700 backdrop-blur-md">
      <button
        onClick={onResetView}
        title="Reset view to home"
        className="p-3 hover:bg-purple-500 hover:bg-opacity-30 rounded-lg transition-all duration-200 hover:scale-110 text-slate-300 hover:text-purple-300"
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

      <div className="border-t border-slate-700" />

      <button
        onClick={on3DToggle}
        title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
        className={`p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
          is3D 
            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/50' 
            : 'text-slate-300 hover:bg-slate-700'
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

      <div className="border-t border-slate-700" />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300 px-1 uppercase tracking-wide">🗺️ Map</label>
        <select
          value={basemap}
          onChange={(e) =>
            onBasemapChange(e.target.value as 'satellite' | 'street' | 'topographic')
          }
          className="px-3 py-2 text-xs font-medium border border-slate-600 rounded-lg bg-slate-700 text-slate-100 hover:border-purple-500 hover:bg-slate-600 transition-all duration-200"
        >
          <option value="satellite">🛰️ Satellite</option>
          <option value="street">🏙️ Street</option>
          <option value="topographic">⛰️ Topographic</option>
        </select>
      </div>
    </div>
  );
};

export default MapControls;
