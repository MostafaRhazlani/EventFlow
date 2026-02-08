/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/(auth)/register/page';
import { register } from '@/lib/services';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/services', () => ({
  register: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt || 'test-img'} {...props} />;
  },
}));

const mockRegister = register as jest.MockedFunction<typeof register>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RegisterPage', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as unknown as ReturnType<typeof useRouter>);
  });

  it('user can create account', async () => {
    mockRegister.mockResolvedValue(Object.assign({ user: { _id: 'user-123' } }));

    render(<RegisterPage />);

    await userEvent.type(screen.getByPlaceholderText('First Name'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error message on registration failure', async () => {
    mockRegister.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Email already exists' } },
    });

    render(<RegisterPage />);

    await userEvent.type(screen.getByPlaceholderText('First Name'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
