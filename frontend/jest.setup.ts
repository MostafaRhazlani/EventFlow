import { createElement } from 'react';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock Next.js Image component (filter out Next.js-specific props)
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }) => {
    return createElement('img', props);
  },
}));

// Setup global mocks
global.alert = jest.fn();
global.confirm = jest.fn();
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();
