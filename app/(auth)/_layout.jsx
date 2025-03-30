import { Redirect, Stack } from 'expo-router'
// TODO use isSignedIn here
export default function AuthRoutesLayout() {
  const isSignedIn = false 
  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}