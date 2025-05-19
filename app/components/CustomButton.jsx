import { useEffect } from 'react'
import { Text, StyleSheet, Pressable} from 'react-native'
import { FONT_SIZES, COLORS } from '../constants/theme'
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const CustomButton = ({ text, color, fontSize, buttonHandler, disabled }) => {
  const styles = dynamicColor(color, fontSize)
  const spin = useSharedValue(0);
  
  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));
  return (
    // <View style={styles.buttonContainer}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonBody} onPress={buttonHandler} android_ripple={{color: 'darkred'}} disabled={disabled}>
          {disabled ? (
            <>
              <Animated.View style={[styles.disabledButtonFont ,animatedStyle]}>
                <MaterialCommunityIcons name="loading" size={24} color="white" />
              </Animated.View>
              <Text style={styles.disabledButtonFont}>Loading</Text>
            </>
          ) : (<Text style={styles.buttonFont}>{text}</Text>)}
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
      paddingVertical: 20,
      paddingHorizontal: 5,
    },
    disabledButtonFont: {
      color: 'white',
      fontSize: fontSize || FONT_SIZES.medium,
      paddingVertical: 20,
      paddingHorizontal: 5,
      opacity: 0.5,
    },
    buttonBody: {
      backgroundColor: color || COLORS.red,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  })
}

export default CustomButton