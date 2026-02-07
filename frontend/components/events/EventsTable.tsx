import { Event, EventStatus } from '@/types/event';
import Image from 'next/image';

interface EventsTableProps {
  events: Event[];
}

const statusColors: Record<EventStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

export function EventsTable({ events }: EventsTableProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participants
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No events found.
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {event.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${event.image.replace(/\\/g, '/')}`}
                        alt={event.title}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(event.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[event.status]}`}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
