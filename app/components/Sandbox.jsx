import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SignOutButton } from './SignOutButton'
import * as storage from 'expo-secure-store'
import { useAuthStore } from '../../store/index'
export default function Sandbox() {
  const setUser = useAuthStore((state) => state.setUser)
  const handleSignOut = () => {
     storage.setItem('token', "")
     setUser(null)
     console.log('signed out')
  }
  return (
    <Pressable onPress={handleSignOut}>
      <SignOutButton/>
    </Pressable>
  )
}

