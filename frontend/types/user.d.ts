export type UserRole = 'ADMIN' | 'ORGANIZER' | 'PARTICIPANT';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
