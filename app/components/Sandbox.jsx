import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import * as storage from 'expo-secure-store'
import { useAuthStore } from '../../store/index'
import { COLORS } from '../constants/theme'
export default function Sandbox() {
  const setUser = useAuthStore((state) => state.setUser)
  const handleSignOut = () => {
     storage.setItem('token', "")
     setUser(null)
     console.log('signed out')
  }
  return (
    <Pressable onPress={handleSignOut}>
      <CustomButton text="Sign Out" color={COLORS.red} />
    </Pressable>
  )
}

