'use client';

import { Drama, TrendingUp, Loader, XCircle } from 'lucide-react';

interface DashboardStatsProps {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  canceledEvents: number;
}

export function DashboardStats({ 
  totalEvents, 
  publishedEvents, 
  draftEvents,
  canceledEvents,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Events',
      value: totalEvents,
      icon: Drama,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Published Events',
      value: publishedEvents,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Draft Events',
      value: draftEvents,
      icon: Loader,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Canceled Events',
      value: canceledEvents,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
