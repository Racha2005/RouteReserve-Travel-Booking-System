import axios from 'axios';

// Get the base API URL from environment variables, fallback to a local address
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Attach JWT Token from localStorage if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized errors (logout or refresh token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionally redirect to login page in actual implementation
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to determine if we should fall back to mock data
 * Useful for development/demo when backend API is offline
 */
export const shouldMock = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Set to true by default for demo robustness
};

// Artificial delay helper for realistic loading states in Mock mode
export const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));
