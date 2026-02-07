export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELED';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  status: EventStatus;
  maxParticipants: number;
  participants: string[];
  organizer: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
