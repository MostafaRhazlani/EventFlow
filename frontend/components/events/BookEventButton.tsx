'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { bookEvent, getCurrentUser, downloadTicketPdf } from '@/lib/services';
import { Event } from '@/types/event';
import { User } from '@/types/user';

interface BookEventButtonProps {
  event: Event;
}

export function BookEventButton({ event }: BookEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  const myBooking = user ? event.participants?.find((p) => p.user?._id === user._id) : null;
  const isBooked = !!myBooking;

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

  const handleDownloadTicket = async () => {
    setDownloading(true);
    try {
      await downloadTicketPdf(event._id);
    } catch (err) {
      console.error('Failed to download ticket:', err);
      alert('Failed to download ticket. Please try again.');
    } finally {
      setDownloading(false);
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
    let statusColor = 'text-green-700 bg-green-50 border-green-200';
    let label = "You're Going!";
    
    if (myBooking?.status === 'PENDING') {
        statusColor = 'text-yellow-700 bg-yellow-50 border-yellow-200';
        label = 'Pending Approval';
    } else if (myBooking?.status === 'REFUSED') {
        statusColor = 'text-red-700 bg-red-50 border-red-200';
        label = 'Booking Refused';
    }

    return (
      <div className="space-y-3">
        <Button disabled variant="outline" className={`w-full ${statusColor}`}>
            {label}
        </Button>
        {myBooking?.status === 'CONFIRMED' && (
          <Button
            onClick={handleDownloadTicket}
            disabled={downloading}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Ticket
              </>
            )}
          </Button>
        )}
      </div>
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
