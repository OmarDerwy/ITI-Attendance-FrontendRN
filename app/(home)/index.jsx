import { Text, View, Image, Dimensions, StyleSheet } from 'react-native'
// import { SignOutButton } from '@/app/components/SignOutButton'
import Sandbox from '@/app/components/Sandbox'
import { useAuthStore } from '@/store/index'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'

const { width } = Dimensions.get('window')

export default function Page() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const user = useAuthStore((state) => state.user)
   // DONE implement signedIn here
  console.log(isSignedIn)
  return (
    <View style={styles.page}>
      {isSignedIn ? (
        <View>
          <Text style={styles.welcomeText}>Welcome, {user}!</Text>
          <Sandbox />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/ColoredLogobanner1to1.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <CustomButton text="Sign In" color={COLORS.red} fontSize={FONT_SIZES.large} path={'/(auth)/sign-in'} />
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
    fontSize: 20,
    marginBottom: 20,
  },
})