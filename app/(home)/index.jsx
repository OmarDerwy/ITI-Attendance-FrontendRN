import { Link } from 'expo-router'
import { Text, View } from 'react-native'
// import { SignOutButton } from '@/app/components/SignOutButton'
import Sandbox from '@/app/components/Sandbox'


export default function Page() {
  signedIn = false // TODO implement signedIn here

  return (
    <View>
      {signedIn ? <View>
        {/* <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton /> */}

        <Sandbox />


      </View>:
      <View>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>}
    </View>
  )
}