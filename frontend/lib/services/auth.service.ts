import api from './api';

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function register(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function becomeOrganizer() {
  const res = await api.post('/auth/become-organizer');
  return res.data;
}
