import { Text, View, Image, Dimensions, StyleSheet } from 'react-native'
import Sandbox from '@/app/components/Sandbox'
import { useAuthStore } from '@/store/index'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme'
import { Redirect, useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function Page() {
  const { isSignedIn, first_name, last_name, email } = useAuthStore((state) => state)
  const router = useRouter()
  console.log(`Welcome ${first_name} ${last_name}`)
  console.log(`Email: ${email}`)
  console.log(`isSignedIn: ${isSignedIn}`)
  const handleNavigateToSignIn = () => {
    router.push('/sign-in')
  }
  
  // More robust name display logic
  let displayName = 'User';
  if (first_name || last_name) {
    displayName = `${first_name || ''} ${last_name || ''}`.trim();
  } else if (email) {
    // Fall back to email if no name available
    displayName = email.split('@')[0];
  }
  
  return (
    <View style={styles.page}>
      {isSignedIn ? (
        <Redirect href={"/(home)/home"} />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/ColoredLogobanner1to1.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.text}>Welcome the ITI official app! Please note that you need to be a current student in order to proceed ✌️</Text>
            <View style={styles.buttonWrapper}>
              <CustomButton text="Sign In" color={COLORS.red} fontSize={FONT_SIZES.large} buttonHandler={handleNavigateToSignIn} />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 1.5,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: 400,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#dddddd',
    width: width,
  },
  buttonWrapper: {
    width: '80%',
  },
  welcomeText: {
    fontSize: 20,
  },
  text: {
    fontSize: FONT_SIZES.large,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium,
  },
})