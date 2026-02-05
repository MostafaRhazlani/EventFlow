'use server'

import { cookies } from 'next/headers';
import api from '../axios';

export async function logoutAction() {
  try {
    await api.post('/auth/logout');
    
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('role');

    return { success: true };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('role');
    
    return { success: true };
  }
}
