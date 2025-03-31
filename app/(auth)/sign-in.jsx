import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet, Dimensions, Modal } from 'react-native'
import React from 'react'
import { useLoadingStore, useAuthStore } from '../../store'
import axiosBackendInstance from '../../api/axios'
import * as storage from 'expo-secure-store'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'

const { width } = Dimensions.get('window')

export default function Page() {  

  const { isLoaded, setLoading } = useLoadingStore((state) => state)
  const setUser = useAuthStore((state => state.setUser))
  const user = useAuthStore((state => state.user))
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  //DONE Handle the submission of the sign-in form
  const onSignInPress = async () => {

    setLoading(true)
    // TODO put a nice loading screen when fetching the jwt
    axiosBackendInstance.post('api/v1/accounts/auth/jwt/create/', {
      email: emailAddress,
      password,
    })
      .then((response) => {
        console.log(response.data)
        // DONE set token in storage
        storage.setItem('token', response.data.access)
        return axiosBackendInstance.get('api/v1/accounts/auth/users/me/')

      }).then((response)=>{
        console.log(response.data)
        setUser(response.data.first_name)
      })
      .catch((error) => {
        console.error(error)
      }).finally(() => {
        console.log(user)
        setLoading(false)
        router.replace('/')

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
          <Text style={styles.title}>Sign in</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <View style={styles.button}>
            <CustomButton text="Continue" color={COLORS.red} fontSize={FONT_SIZES.medium} buttonHandler={onSignInPress} />
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
    height: '40%',
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  link: {
    color: '#0000ff',
    textDecorationLine: 'underline',
  },
})