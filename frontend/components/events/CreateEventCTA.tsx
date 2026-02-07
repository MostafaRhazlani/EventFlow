'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BadgePlus } from 'lucide-react';
import { getCurrentUser } from '@/lib/services';

interface CreateEventCTAProps {
  className?: string;
  variant?: 'hero' | 'default';
}

export default function CreateEventCTA({ className = '', variant = 'default' }: CreateEventCTAProps) {
  const [targetHref, setTargetHref] = useState('/become-organizer');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.role === 'ORGANIZER' && user.isApproved) {
          setTargetHref('/dashboard/organizer/events/create');
        }
      } catch {
        // Keep default href
      }
    };
    checkAuth();
  }, []);

  if (variant === 'hero') {
    return (
      <Link
        href={targetHref}
        className={`w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      >
        <BadgePlus className="w-5 h-5" />
        Create Event
      </Link>
    );
  }

  return (
    <Link
      href={targetHref}
      className={`inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${className}`}
    >
      Create Event
    </Link>
  );
}
