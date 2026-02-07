import api from './api';
import { Event } from '@/types/event';

export async function getEvents(): Promise<Event[]> {
  const res = await api.get('/events');
  return res.data;
}

export async function getEvent(id: string): Promise<Event> {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export async function createEvent(data: FormData): Promise<Event> {
  const res = await api.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateEvent(id: string, data: FormData): Promise<Event> {
  const res = await api.patch(`/events/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateEventStatus(id: string, status: string): Promise<Event> {
  const res = await api.patch(`/events/${id}/status`, { status });
  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}

export async function getMyEvents(): Promise<Event[]> {
  const res = await api.get('/events/my-events');
  return res.data;
}
