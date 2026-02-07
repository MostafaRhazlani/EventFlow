'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { bookEvent, getCurrentUser } from '@/lib/services';
import { Event } from '@/types/event';
import { User } from '@/types/user';

interface BookEventButtonProps {
  event: Event;
}

export function BookEventButton({ event }: BookEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Derive state from event props
  const participantsCount = event.participants?.length || 0;
  const isFull = participantsCount >= event.maxParticipants;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const isBooked = user && event.participants?.some((id: string) => id === user._id);

  const handleBook = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
        await bookEvent(event._id);
        router.refresh(); 
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to book event';
        alert(message);
    } finally {
        setLoading(false);
    }
  };

  if (checkingAuth) {
      return <Button disabled variant="outline" className="w-full">Loading...</Button>;
  }

  // Only participants can book
  if (user && user.role !== 'PARTICIPANT') {
    return (
        <Button disabled variant="outline" className="w-full bg-gray-50 text-gray-500 border-gray-200">
            For Participants Only
        </Button>
    );
  }

  if (user && isBooked) {
    return (
        <Button disabled variant="outline" className="w-full bg-green-50 text-green-700 border-green-200">
            You&apos;re Going!
        </Button>
    );
  }

  if (isFull) {
    return (
        <Button disabled variant="outline" className="w-full">
            Sold Out
        </Button>
    );
  }

  return (
    <Button 
        onClick={handleBook} 
        disabled={loading} 
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
    >
        {loading ? 'Booking...' : (user ? 'Book Ticket' : 'Login to Book')}
    </Button>
  );
}
