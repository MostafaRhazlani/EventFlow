import { Event } from '@/types/event';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Cookie: `access_token=${token}` } : {};
}

export async function getEventsServer(): Promise<Event[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/events`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function getEventServer(id: string): Promise<Event> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/events/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  return response.json();
}
