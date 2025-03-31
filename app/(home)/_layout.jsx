import { Stack } from 'expo-router/stack'

// TODO checkout name of (home) to home

export default function Layout() {
  return( 
  <Stack screenOptions={{animation: 'slide_from_right'}}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>
  )
}