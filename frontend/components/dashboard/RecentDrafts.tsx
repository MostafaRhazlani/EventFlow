'use client';

import { Event } from '@/types/event';
import { updateEventStatus } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

interface RecentDraftsProps {
  events: Event[];
}

export function RecentDrafts({ events }: RecentDraftsProps) {
  const router = useRouter();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      if (confirm(`Are you sure you want to ${status.toLowerCase()} this event?`)) {
        await updateEventStatus(id, status);
        router.refresh();
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drafts</h3>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No draft events found.</p>
        ) : (
          events.slice(0, 5).map((event) => (
            <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(event._id, 'PUBLISHED')}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Publish"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleStatusChange(event._id, 'CANCELED')}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
