import { Stack } from 'expo-router/stack'

export default function Layout() {
  return( 
  <Stack screenOptions={{animation: 'slide_from_right', headerShown: false}}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>
  )
}