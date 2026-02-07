'use client';

import { Event } from '@/types/event';
import { Users } from 'lucide-react';

interface TopEventsProps {
  events: Event[];
}

export function TopEvents({ events }: TopEventsProps) {
  const sortedEvents = [...events]
    .sort((a, b) => b.maxParticipants - a.maxParticipants)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Largest Events (Capacity)</h3>
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No events found.</p>
        ) : (
          sortedEvents.map((event, index) => (
            <div key={event._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-600">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {event.title}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{event.maxParticipants}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
