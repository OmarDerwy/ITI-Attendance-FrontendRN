import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet, Dimensions, Modal, Alert } from 'react-native'
import React, { useContext } from 'react'
import { useLoadingStore, useAuthStore } from '../../store'
import axiosBackendInstance from '../../api/axios'
import * as storage from 'expo-secure-store'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'

const { width } = Dimensions.get('window')

export default function Page() {  

  const { isLoaded, setLoading } = useLoadingStore((state) => state)
  const router = useRouter()
  const userContext = useAuthStore((state) => state)

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
    setLoading(true)
    
    try {
      // Get auth tokens
      const authResponse = await axiosBackendInstance.post('accounts/auth/jwt/create/', {
        email: emailAddress,
        password,
      });
      
      // Store tokens securely
      await storage.setItem('access_token', authResponse.data.access);
      await storage.setItem('refresh_token', authResponse.data.refresh);
      
      try {
        // Get user data with better error handling
        const userResponse = await axiosBackendInstance.get('accounts/auth/users/me/');
        
        // Ensure we have valid user data before updating state
        if (userResponse && userResponse.data) {
          console.log('User data:', userResponse.data);
          // Map API response to expected user shape
          const userData = userResponse.data;
          userContext.setUser({
            id: userData.id,
            email: userData.email,
            username: userData.email, // fallback if username not present
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: Array.isArray(userData.groups) && userData.groups.length > 0 ? userData.groups[0] : 'student',
          });
          // Add debug logging to confirm data was set
          console.log('After setUser call, store state:');
        } else {
          // Handle missing user data
        }
        
        // Navigate to home
        router.replace('/(home)/');
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Even if user data fetch fails, we're still authenticated
        // Set minimal user dat
        router.replace('/(home)/');
      }
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