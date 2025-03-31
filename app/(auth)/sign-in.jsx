import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useLoadingStore, useAuthStore } from '../../store'
import axiosBackendInstance from '../../api/axios'
import * as storage from 'expo-secure-store'

export default function Page() {  

  const { isLoaded, setLoading } = useLoadingStore((state) => state)
  const setUser = useAuthStore((state => state.setUser))
  const user = useAuthStore((state => state.user))
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {

    setLoading(true)

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
    <View>
      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}