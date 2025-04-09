import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import * as storage from 'expo-secure-store'
import { useAuthStore } from '../../store/index'
import { COLORS, FONT_SIZES } from '../constants/theme'
export default function Sandbox() {
  const handleSignOut = () => {
     storage.setItem('token', "")
     console.log('signed out')
  }
  return (
    <Pressable onPress={handleSignOut}>
      <CustomButton text="Sign Out" color={COLORS.red} fontSize={FONT_SIZES.large} buttonHandler={handleSignOut} />
    </Pressable>
  )
}

