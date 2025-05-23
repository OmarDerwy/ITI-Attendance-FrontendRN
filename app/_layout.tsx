import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './../context/AuthProvider';
import Toast from 'react-native-toast-message';
import { NotificationsProvider } from '../hooks/useWebSocketNotifications';

// DONE implement some form of caching and state management
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index"/>
            </Stack>
            <Toast />
          </NotificationsProvider>
        </QueryClientProvider>
      </AuthProvider>
  );
}
