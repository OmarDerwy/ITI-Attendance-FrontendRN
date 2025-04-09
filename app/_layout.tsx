import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './../context/AuthProvider';

// DONE implement some form of caching and state management
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"/>
          </Stack>
        </QueryClientProvider>
      </AuthProvider>
  );
}
