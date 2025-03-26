import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { COLORS } from '@/app/constants/theme'
import { FONT_SIZES } from '../../constants/theme'


const GetStarted = () => {
  return (
    <Pressable onPress={() => alert('Get Started Pressed!')}>
        <View style={styles.button}>
          <Text style={styles.buttonFont}>Get Started</Text>
        </View>
    </Pressable>
  )
}

export default GetStarted

const styles = StyleSheet.create({
    button:{
        backgroundColor: COLORS.red,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    buttonFont: {
        color: 'white',
        fontSize: FONT_SIZES.large,
    }
})