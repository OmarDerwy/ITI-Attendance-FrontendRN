import { Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native'
import { FONT_SIZES, COLORS } from '../constants/theme'
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export const CustomButton = ({ text, color, fontSize, buttonHandler }) => {
  const router = useRouter()
  const styles = dynamicColor(color, fontSize)
  return (
    // <View style={styles.buttonContainer}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonBody} onPress={buttonHandler} android_ripple={{color: 'darkred'}}>
          <Text style={styles.buttonFont}>{text}</Text>
        </Pressable>
      </View>
    // </View>
  )
}

function dynamicColor(color, fontSize) {
  return StyleSheet.create({
    buttonContainer: {
      borderRadius: 20,
      overflow: 'hidden',
    },
    buttonFont: {
      color: 'white',
      fontSize: fontSize || FONT_SIZES.medium,
      padding: 20,
    },
    buttonBody: {
      backgroundColor: color || COLORS.red,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
}

export default CustomButton