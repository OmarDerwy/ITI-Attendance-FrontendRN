import * as Linking from 'expo-linking'
import { Text, TouchableOpacity, StyleSheet} from 'react-native'
import { COLORS, FONT_SIZES } from '../constants/theme'
import { View } from 'react-native';

export const SignOutButton = () => {
  return (
    <View style={styles.button} >
      <Text>Sign out</Text>
    </View>
  )
}

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