'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { getMyBookings, getCurrentUser } from '@/lib/services';
import { Event, BookingStatus } from '@/types/event';
import { User } from '@/types/user';

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  REFUSED: 'bg-red-100 text-red-800',
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [userData, eventsData] = await Promise.all([
          getCurrentUser(),
          getMyBookings()
        ]);
        
        if (!userData || userData.role !== 'PARTICIPANT') {
          router.push('/login');
          return;
        }
        
        setUser(userData);
        setBookings(eventsData);
      } catch (err) {
        console.error(err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const getMyBookingStatus = (event: Event): BookingStatus | null => {
    if (!user) return null;
    const myParticipation = event.participants?.find(
      (p) => p.user?._id === user._id
    );
    return myParticipation?.status || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Track your event reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">Start exploring events and book your first one!</p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((event) => {
              const status = getMyBookingStatus(event);
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full h-40">
                    {event.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${event.image.replace(/\\/g, '/')}`}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500" />
                    )}
                    {/* Status Badge */}
                    {status && (
                      <span
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[status]}`}
                      >
                        {status.toLowerCase()}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/events/${event._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 line-clamp-1">
                        {event.title}
                      </h3>
                    </Link>
                    <div className="mt-2 space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-4 text-center py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium text-sm transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
