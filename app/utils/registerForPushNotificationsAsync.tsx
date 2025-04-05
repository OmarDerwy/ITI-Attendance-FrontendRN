import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',

        }
    );}
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            throw new Error('Failed to get push token for push notification!');
            return;
        }
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
        if (!projectId) {
            throw new Error('Project ID not found in EAS config');
        }
        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data;
            console.log('Push token:', pushTokenString);
            return pushTokenString;
        } catch (error) {
            console.error('Error getting push token:', error);
            throw new Error('Failed to get push token for push notification!');
        }

    }
}
