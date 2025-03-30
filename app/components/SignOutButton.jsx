import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  
  const handleSignOut = async () => {
    // Call the signOut function to sign the user out
    // await signOut()

    // Redirect the user to the sign-in page
    // Linking.openURL('/(auth)/sign-in')
  }

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  )
}