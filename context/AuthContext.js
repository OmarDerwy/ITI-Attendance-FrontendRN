import { createContext, useContext } from 'react';

// Create contexts
export const AuthContext = createContext(null);
export const LoadingContext = createContext(null);

// Custom hooks to use the contexts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within an AuthProvider');
  }
  return context;
};
