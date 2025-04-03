import { create } from 'zustand';
import * as storage from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  isSignedIn: false,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  role: '',
  
  setUser: (userData) => set({
    isSignedIn: true,
    username: userData.username || '',
    email: userData.email || '',
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    role: userData.role || 'student', // Default to student if not specified
  }),
  
  clearUser: async () => {
    await storage.deleteItemAsync('access_token');
    await storage.deleteItemAsync('refresh_token');
    set({
      isSignedIn: false,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: '',
    });
  },
}));

export const useLoadingStore = create((set) => ({
  isLoaded: false,
  setLoading: (state) => set({ isLoaded: state }),
}));
