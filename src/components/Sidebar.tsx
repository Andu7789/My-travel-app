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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Travel Photos</h1>
        <p className="text-sm text-gray-500 mt-2">{photoCount} photos</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <button
          onClick={onAddTrip}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Trip
        </button>

        <div className="space-y-2">
          {trips.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No trips created yet
            </p>
          ) : (
            trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedTrip?.id === trip.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-800">{trip.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(trip.start_date).toLocaleDateString()} -{' '}
                  {new Date(trip.end_date).toLocaleDateString()}
                </p>
                {trip.photo_count && (
                  <p className="text-xs text-blue-600 mt-1">
                    {trip.photo_count} photos
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
