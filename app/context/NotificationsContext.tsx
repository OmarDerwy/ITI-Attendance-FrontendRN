import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
  } from "react";
  import * as Notifications from "expo-notifications";
  import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
  
  interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
  }
  
  const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
  
  export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
  };
  
  interface NotificationProviderProps {
    children: ReactNode;
  }
  
  export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
    const notificationListener = useRef<any>(null);
    const responseListener = useRef<any>(null);
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(
        (token) => setExpoPushToken(token ?? null),
        (err) => setError(err)
      );
  
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("🔔 Notification Received while the app is running:", notification);
          setNotification(notification);
        }
      );
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log("🔔 Notification Response:", JSON.stringify(response, null, 2));
        }
      );
  
      return () => {
        notificationListener.current?.remove();
        responseListener.current?.remove();
      };
    }, []);
  
    return (
      <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
        {children}
      </NotificationContext.Provider>
    );
  };
  