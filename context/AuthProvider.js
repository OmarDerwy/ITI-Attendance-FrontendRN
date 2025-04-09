import React, { useState, useCallback } from 'react';
import * as storage from 'expo-secure-store';
import { AuthContext, LoadingContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Auth state
  const [authState, setAuthState] = useState({
    id: null,
    isSignedIn: false,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
  });

  // Loading state
  const [isLoaded, setIsLoaded] = useState(false);

  // Set user data
  const setUser = useCallback((userData) => {
    const data = userData || {};
    
    setAuthState({
      id: data.id || null,
      isSignedIn: true,
      username: data.username || '',
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'student',
    });
  }, []);

  // Debug method
  const debugState = useCallback(() => {
    console.log('Current auth state:', authState);
    return authState;
  }, [authState]);

  // Clear user data
  const clearUser = useCallback(async () => {
    try {
      await storage.deleteItemAsync('access_token');
      await storage.deleteItemAsync('refresh_token');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
    
    setAuthState({
      id: null,
      isSignedIn: false,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: '',
    });
  }, []);

  // Auth context value
  const authContextValue = {
    ...authState,
    setUser,
    debugState,
    clearUser,
  };

  // Loading context value
  const loadingContextValue = {
    isLoaded,
    setLoading: setIsLoaded,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <LoadingContext.Provider value={loadingContextValue}>
        {children}
      </LoadingContext.Provider>
    </AuthContext.Provider>
  );
};
