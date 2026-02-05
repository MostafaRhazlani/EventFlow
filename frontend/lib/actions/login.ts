'use server'

import { cookies } from 'next/headers';
import api from '../axios';
import { AxiosError } from 'axios';
import { LoginFormData } from '@/types/login';

export async function loginAction(data: LoginFormData) {
  const { email, password } = data;

  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Handle Set-Cookie header from backend response
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      
      setCookieHeader.forEach((cookie) => {
        const [cookieNameValue] = cookie.split(';');
        const [name, value] = cookieNameValue.split('=');
        
        cookieStore.set({
          name,
          value,
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });
      });
    }

    return response.data;

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
       if (error.response?.data?.message) {
         throw new Error(Array.isArray(error.response.data.message) 
            ? error.response.data.message[0] 
            : error.response.data.message);
       }
       throw new Error(error.message);
    }
    throw new Error('Something went wrong during login');
  }
}
