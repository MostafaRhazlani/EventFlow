'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import { getEvent, getCurrentUser, updateBookingStatus } from '@/lib/services';
import { Event, BookingStatus } from '@/types/event';

export default function EventParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [user, eventData] = await Promise.all([
          getCurrentUser(),
          getEvent(resolvedParams.id)
        ]);
        
        if (!user || user.role !== 'ORGANIZER' || eventData.organizer._id !== user._id) {
            if (user.role !== 'ORGANIZER') {
                 // router.push('/login'); 
                 // Allow admin/others? No, strict.
            }
        }
        setEvent(eventData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [resolvedParams.id]);

  const handleStatusChange = async (userId: string, newStatus: BookingStatus) => {
      if (!event) return;
      setUpdatingId(userId);
      try {
        await updateBookingStatus(event._id, userId, newStatus);
        // Optimistic update or refetch
        setEvent(prev => {
            if (!prev) return null;
            return {
                ...prev,
                participants: prev.participants.map(p => {
                    if (p.user._id === userId) {
                        return { ...p, status: newStatus };
                    }
                    return p;
                })
            };
        });
      } catch (err) {
          alert('Failed to update status');
      } finally {
          setUpdatingId(null);
      }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!event) return <div className="p-8 text-center text-red-600">Event not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <Link href="/dashboard/organizer/events" className="text-gray-500 hover:text-gray-900 flex items-center mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
                Manage Participants
            </h1>
            <p className="text-gray-600">
                {event.title} • {event.participants.length} / {event.maxParticipants} Joined
            </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {event.participants.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No participants yet.
                        </td>
                    </tr>
                ) : (
                    event.participants.map((participant) => (
                        <tr key={participant.user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">
                                        {participant.user.first_name[0]}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {participant.user.first_name} {participant.user.last_name}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {participant.user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(participant.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${participant.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                                      participant.status === 'REFUSED' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {participant.status.toLowerCase()}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    {participant.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(participant.user._id, 'CONFIRMED' as BookingStatus)}
                                                disabled={updatingId === participant.user._id}
                                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded disabled:opacity-50"
                                                title="Confirm"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(participant.user._id, 'REFUSED' as BookingStatus)}
                                                disabled={updatingId === participant.user._id}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded disabled:opacity-50"
                                                title="Refuse"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {participant.status !== 'PENDING' && (
                                         <span className="text-xs text-gray-400">Changed</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
