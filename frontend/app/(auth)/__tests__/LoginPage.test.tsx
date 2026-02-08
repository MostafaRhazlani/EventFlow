/**
 * @jest-environment jsdom
 */
import React from 'react';

jest.mock('@/lib/services', () => ({
  login: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ fill, priority, ...props }: any) { return React.createElement('img', props); },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';
import { login } from '@/lib/services';
import { useRouter } from 'next/navigation';

const mockLogin = login as jest.MockedFunction<typeof login>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LoginPage', () => {
  const mockRouter = { push: jest.fn(), back: jest.fn(), refresh: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  it('participant can login', async () => {
    mockLogin.mockResolvedValue({
      _id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'participant@example.com',
      role: 'PARTICIPANT',
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'participant@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('participant@example.com', 'password123');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('organizer can login', async () => {
    mockLogin.mockResolvedValue({
      _id: 'org-123',
      first_name: 'Jane',
      last_name: 'Organizer',
      email: 'organizer@example.com',
      role: 'ORGANIZER',
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'organizer@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('organizer@example.com', 'password123');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('shows error on invalid credentials', async () => {
    mockLogin.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'wrong@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass');

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
