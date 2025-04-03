import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet, Dimensions, Modal, Alert } from 'react-native'
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
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
    setLoading(true)
    
    try {
      // Get auth tokens
      const authResponse = await axiosBackendInstance.post('api/v1/accounts/auth/jwt/create/', {
        email: emailAddress,
        password,
      });
      
      // Store tokens securely
      await storage.setItem('access_token', authResponse.data.access);
      await storage.setItem('refresh_token', authResponse.data.refresh);
      
      // Get user data
      const userResponse = await axiosBackendInstance.get('api/v1/accounts/auth/users/me/');
      
      // Update user state with all returned data
      setUser(userResponse.data);
      
      // Navigate to home
      router.replace('/(home)/');
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Sign in failed',
        'Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
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