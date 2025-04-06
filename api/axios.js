import axios from 'axios';
import * as storage from 'expo-secure-store';
import { useAuthStore } from '../store';

const axiosBackendInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
});

// Request interceptor to add the auth token
axiosBackendInstance.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to refresh token on 401 Unauthorized
axiosBackendInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error and error response exist before accessing status
    if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await storage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, logout the user
          useAuthStore.getState().clearUser();
          return Promise.reject(error);
        }
        
        // Attempt to refresh token
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/accounts/auth/jwt/refresh/`,
          { refresh: refreshToken }
        );
        
        if (response && response.status === 200) {
          // Store the new tokens
          await storage.setItem('access_token', response.data.access);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosBackendInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout the user
        useAuthStore.getState().clearUser();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosBackendInstance;