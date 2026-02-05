'use server'

import api from '../axios';
import axios from 'axios';
import { RegisterFormData } from '@/types/register';

export async function registerAction(data: RegisterFormData) {
  const { firstName, lastName, email, password } = data;

  try {
    const response = await api.post('/auth/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;

      throw new Error(
        Array.isArray(serverMessage) 
          ? serverMessage[0] 
          : serverMessage || error.message
      );
    }
    
    if ((error instanceof Error)) {
      throw new Error(error.message)
    }

    throw new Error('Something went wrong during registration');
  }
}
