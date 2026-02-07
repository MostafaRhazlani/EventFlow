import Link from 'next/link';
import Image from 'next/image';
import { Drama, Calendar, MapPin, Users } from 'lucide-react';
import { getEventsServer } from '@/lib/services/event.server';
import CreateEventCTA from '@/components/events/CreateEventCTA';
import { Event } from '@/types/event';


export default async function HomePage() {
  let events: Event[] = [];
  
  try {
    const allEvents = await getEventsServer();
    events = allEvents.filter(e => e.status === 'PUBLISHED').slice(0, 6);
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <main>
      {/* Hero Section */}
        <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/event-image.jpg"
              alt="Event Crowd"
              fill
              className="object-cover transform scale-105"
              priority
            />
            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/80 to-purple-900/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
                  Unforgettable Moments
                </span>
                Await You
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover the best concerts, festivals, and workshops near you. 
                Join a community of thousands of event enthusiasts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/events"
                  className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <Drama className="w-5 h-5" />
                  Explore Events
                </Link>
                <CreateEventCTA variant="hero" />
              </div>

              {/* Stats - Optional Enhancement */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-purple-200">Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10k+</div>
                  <div className="text-sm text-purple-200">Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-purple-200">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24" />
        </section>


      {/* Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the best events happening near you
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="relative h-48">
                    {event.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${event.image.replace(/\\/g, '/')}`}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.maxParticipants}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/events"
                className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/eventflow.png"
                alt="EventFlow"
                width={120}
                height={30}
                className="mb-4 brightness-200"
              />
              <p className="text-sm">
                Discover and create amazing events with EventFlow.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/events" className="hover:text-white">Browse Events</Link></li>
                <li><Link href="/become-organizer" className="hover:text-white">Create Event</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>contact@eventflow.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} EventFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
