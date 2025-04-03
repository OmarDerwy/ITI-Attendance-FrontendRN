import { create } from 'zustand';
import * as storage from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  isSignedIn: false,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  role: 'student',
  
  setUser: (userData) => {
    // Ensure userData is an object, even if it's null/undefined
    const data = userData || {};
    
    set({
      isSignedIn: true,
      username: data.username || '',
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'student',
    });
  },
  
  clearUser: async () => {
    try {
      await storage.deleteItemAsync('access_token');
      await storage.deleteItemAsync('refresh_token');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
    
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
