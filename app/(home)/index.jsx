import { Link } from 'expo-router'
import { Text, View } from 'react-native'
// import { SignOutButton } from '@/app/components/SignOutButton'
import Sandbox from '@/app/components/Sandbox'
import { useAuthStore } from '@/store/index'
import axiosBackendInstance from '../../api/axios'

export default function Page() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const user = useAuthStore((state) => state.user)
   // TODO implement signedIn here
  console.log(isSignedIn)
  return (
    <View>
      {isSignedIn ? <View>
        <Text style={{ fontSize: 20 }}>Welcome, {user}!</Text> 

        <Sandbox />

      </View>:
      <View>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
      </View>}
    </View>
  )
}