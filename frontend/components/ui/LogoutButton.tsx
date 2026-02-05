'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/lib/actions/logout';
import { Button } from './Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}
