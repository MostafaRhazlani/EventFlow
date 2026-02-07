'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, becomeOrganizer } from '@/lib/services';
import { User } from '@/types/user';

export default function BecomeOrganizerPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // If already an organizer, redirect
        if (userData?.role === 'ORGANIZER') {
          if (userData.isApproved) {
            router.push('/');
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await becomeOrganizer();
      setSuccess(true);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || 'Failed to submit request';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </main>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Become an Organizer</h1>
          <p className="text-gray-600 mb-6">
            Create and manage your own events on EventFlow. Sign up or login to get started.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 border border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Already an organizer waiting approval
  if (user.role === 'ORGANIZER' && !user.isApproved) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your organizer request is being reviewed by our team. We&apos;ll notify you once it&apos;s approved.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 text-purple-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your organizer request has been submitted. An admin will review and approve it soon.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Form to become organizer
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become an Organizer</h1>
          <p className="text-gray-600 mb-8">
            Start creating and managing your own events on EventFlow.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-purple-900 mb-3">As an Organizer you can:</h2>
            <ul className="space-y-2 text-purple-800">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create and publish events
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Manage event participants
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Track bookings and revenue
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6">
              By clicking below, you agree to our organizer terms and conditions.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Submitting...' : 'Request Organizer Access'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
