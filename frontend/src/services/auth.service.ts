import { api, shouldMock, delay } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    if (shouldMock()) {
      await delay(1000);
      if (data.email === 'user1@gmail.com' && data.password === 'Rachana#Tunga@2026!') {
        // Correct user credentials for mock testing
      }
      // Create user session in mock mode
      const response: AuthResponse = {
        user: {
          id: 'user_1',
          name: data.email === 'user1@gmail.com' ? 'Rachana R Tunga' : data.email.split('@')[0].toUpperCase(),
          email: data.email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          role: 'user',
        },
        token: 'mock-jwt-token-xyz-123',
      };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    }

    const res = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    if (shouldMock()) {
      await delay(1200);
      const response: AuthResponse = {
        user: {
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          name: data.name,
          email: data.email,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          role: 'user',
        },
        token: 'mock-jwt-token-new-user',
      };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    }

    const res = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    if (shouldMock()) {
      await delay(800);
      return { message: `Password reset link sent to ${email}` };
    }
    const res = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: any): Promise<{ message: string }> => {
    if (shouldMock()) {
      await delay(1000);
      return { message: 'Password has been reset successfully' };
    }
    const res = await api.post<{ message: string }>('/auth/reset-password', data);
    return res.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    if (shouldMock()) {
      await delay(800);
      return { message: 'Email verified successfully!' };
    }
    const res = await api.post<{ message: string }>('/auth/verify-email', { token });
    return res.data;
  },

  logout: async (): Promise<void> => {
    if (shouldMock()) {
      await delay(300);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};
