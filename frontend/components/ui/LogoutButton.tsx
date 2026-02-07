'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/services';
import { Button } from './Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}
