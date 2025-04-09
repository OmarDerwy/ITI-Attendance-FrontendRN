// This file now re-exports the context hooks for backwards compatibility
import { useAuth, useLoading } from '../context/AuthContext';

// Export the hooks with the same names as before
export const useAuthStore = useAuth;
export const useLoadingStore = useLoading;
