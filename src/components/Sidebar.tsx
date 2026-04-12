import React from 'react';
import type { Trip } from '../types';

interface SidebarProps {
  trips: Trip[];
  selectedTrip?: Trip;
  onSelectTrip: (trip: Trip) => void;
  onAddTrip: () => void;
  photoCount: number;
}

/**
 * Sidebar Component
 * Displays trip list and filters
 */
export const Sidebar: React.FC<SidebarProps> = ({
  trips,
  selectedTrip,
  onSelectTrip,
  onAddTrip,
  photoCount,
}) => {
  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-padding">
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent">Travel Photos</h1>
        <p className="text-sm text-purple-300 mt-2 font-semibold">{photoCount} photos collected</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <button
          onClick={onAddTrip}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          ✨ Add Trip
        </button>

        <div className="space-y-2">
          {trips.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12 font-semibold">
              No trips yet. Create one to start! 🌍
            </p>
          ) : (
            trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 group ${
                  selectedTrip?.id === trip.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg scale-105'
                    : 'bg-slate-700 hover:bg-slate-600 hover:shadow-md'
                }`}
              >
                <p className={`font-bold text-lg ${
                  selectedTrip?.id === trip.id
                    ? 'text-white'
                    : 'text-slate-100 group-hover:text-white'
                }`}>{trip.name}</p>
                <p className={`text-xs mt-2 ${
                  selectedTrip?.id === trip.id
                    ? 'text-purple-100'
                    : 'text-slate-400'
                }`}>
                  📅 {new Date(trip.start_date).toLocaleDateString()} → {new Date(trip.end_date).toLocaleDateString()}
                </p>
                {trip.photo_count && (
                  <p className={`text-xs font-semibold mt-2 ${
                    selectedTrip?.id === trip.id
                      ? 'text-purple-100'
                      : 'text-cyan-400'
                  }`}>
                    📸 {trip.photo_count} photos
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
