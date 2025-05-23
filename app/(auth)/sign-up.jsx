import { Text, TextInput, View, Image, StyleSheet, Dimensions, Modal, Alert } from 'react-native'
import React from 'react'
import { useLoadingStore } from '../../store'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function SignUpScreen() {
  const { isLoaded, setLoading } = useLoadingStore((state) => state)
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')

  const onSignUpPress = () => {
    if (!emailAddress || !firstName || !lastName || !phoneNumber) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }
    // Pass collected data to sign-up-details screen
    router.replace({
      pathname: '/sign-up-details',
      params: {
        email: emailAddress,
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
      },
    })
  }

  return (
    <View style={styles.page}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/ColoredLogobanner1to1.png')}
          style={styles.image}
        />
      </View>
      <Modal visible={true} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.title}>Register as Guest</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={setEmailAddress}
          />
          <TextInput
            style={styles.input}
            value={firstName}
            placeholder="First name"
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            value={lastName}
            placeholder="Last name"
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            value={phoneNumber}
            placeholder="Phone number"
            onChangeText={setPhoneNumber}
          />
          <View style={styles.button}>
            <CustomButton text="Continue" color={COLORS.red} fontSize={FONT_SIZES.medium} buttonHandler={onSignUpPress} />
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1.5,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: 400,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    height: '60%',
    width: width,
    backgroundColor: '#dddddd',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '80%',
  },
})