import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./context/NotificationsContext";
import * as Notifications from "expo-notifications";
// DONE implement some form of caching and state management
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"/>
        </Stack>
      </QueryClientProvider>
    </NotificationProvider>
  );
}
