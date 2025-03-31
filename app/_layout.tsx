import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// DONE implement some form of caching and state management
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
  );
}
