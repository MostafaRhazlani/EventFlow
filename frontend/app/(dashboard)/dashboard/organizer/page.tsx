'use client';

import { useEffect, useState } from 'react';
import { getMyEvents } from '@/lib/services';
import { Event } from '@/types/event';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { RecentDrafts } from '@/components/dashboard/RecentDrafts';
import { TopEvents } from '@/components/dashboard/TopEvents';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
    </div>;
  }

  // Calculate stats
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'PUBLISHED').length;
  const draftEvents = events.filter(e => e.status === 'DRAFT').length;
  const canceledEvents = events.filter(e => e.status === 'CANCELED').length;
  
  const statusData = [
    { name: 'Draft', value: draftEvents, color: '#9ca3af' },
    { name: 'Published', value: publishedEvents, color: '#10b981' },
    { name: 'Canceled', value: canceledEvents, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const draftEventsList = events
    .filter(e => e.status === 'DRAFT')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <DashboardStats 
        totalEvents={totalEvents}
        publishedEvents={publishedEvents}
        draftEvents={draftEvents}
        canceledEvents={canceledEvents}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts statusData={statusData} />
        
        <div className="space-y-6">
          <RecentDrafts events={draftEventsList} />
          <TopEvents events={events} />
        </div>
      </div>
    </div>
  );
}
