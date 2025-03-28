import { ClerkProvider } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
