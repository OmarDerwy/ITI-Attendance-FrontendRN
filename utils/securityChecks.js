import { NativeModules, Platform } from 'react-native';

export const checkDeveloperMode = async () => {
  if (Platform.OS === 'android') {
    try {
      const adbEnabled = await NativeModules.AndroidSettings.isAdbEnabled();
      const developerMode = await NativeModules.AndroidSettings.isDeveloperModeEnabled();
      return adbEnabled || developerMode;
    } catch (error) {
      console.error('Error checking developer mode:', error);
      return false;
    }
} else if (Platform.OS === 'ios') {
    // iOS doesn't provide direct access to developer mode status
    return false;
  }
  return false;
};