import { Redirect, Stack } from 'expo-router'
import { useAuthStore } from '@/store/index';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuthStore((state) => state.isSignedIn)
  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return(
  <Stack screenOptions={{animation: 'slide_from_right'}}>
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
  </Stack>
  )
}