import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowLeft, DollarSign } from 'lucide-react';
import { getEventServer } from '@/lib/services/event.server';
import { notFound } from 'next/navigation';


interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  
  let event;
  try {
    event = await getEventServer(id);
  } catch {
    notFound();
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-96">
            {event.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${event.image.replace(/\\/g, '/')}`}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            )}
          </div>

          {/* Event Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {event.title}
                </h1>

                <div className="prose max-w-none text-gray-600">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p className="text-sm text-gray-500">
                           {event.maxParticipants} max capacity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
