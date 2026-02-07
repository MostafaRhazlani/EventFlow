export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REFUSED';

export interface Participant {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  status: BookingStatus;
  joinedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  status: EventStatus;
  maxParticipants: number;
  participants: Participant[];
  organizer: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
