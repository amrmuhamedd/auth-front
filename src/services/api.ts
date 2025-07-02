import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = import.meta.env.VITE_ENV_API_BASE_URL;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh and retries
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(error);
    }

  
    if (!error.response) {
      console.error('Network error or CORS issue:', error.message);
      return Promise.reject(error);
    }

    // Handle 401 errors with token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await tokenService.refreshTokens();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError);
        if (refreshError.response?.status === 401) {
          tokenService.clearTokens();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Retry mechanism has been disabled
    // Simply log the error for network or server errors
    if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
      console.error('Server error or network issue:', error.message);
    }

    return Promise.reject(error);
  }
);

export const isOnline = (): boolean => navigator.onLine;

export default api;
