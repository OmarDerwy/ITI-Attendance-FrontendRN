import React, { createContext, useContext, ReactNode } from 'react';
import { useEffect, useState, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as storage from "expo-secure-store";
import { getUserNotifications, markNotificationAsRead, deleteNotification as deleteNotificationAPI } from "../api/notifications";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import Constants from "expo-constants";
import Toast from 'react-native-toast-message';
import { Audio } from 'expo-av'; // Import Audio from expo-av


type Notification = {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
};

export default function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        setHasMoreNotifications(data.length > 0); 
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Reconnect WebSocket when returning to foreground
        connectWebSocket();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // Move connectWebSocket outside of useEffect so it can be called on demand
  const connectWebSocket = async () => {
    const token = await storage.getItemAsync("access_token");
    const wsUrl = `${process.env.EXPO_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8000/'}ws/notifications/?token=${token}`;
    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (e) => console.error("WebSocket error:", e);
    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const newNotification: Notification = {
          id: Date.now(),
          message: data.body || "New notification",
          created_at: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          is_read: false,
        };
        console.log("Before JSON.parse", e.data);
        console.log("New notification received:", data);
        //play sound and raise toast
        Toast.show({
          type: 'success',
          text1: data.title || "New notification",
          text2: data.body || "",
          position: 'top',
          visibilityTime: 4000,
        });

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } catch (err) {
        console.error("Invalid WebSocket message", e.data);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id); 
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await deleteNotificationAPI(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      setUnreadCount((prev) => prev - 1); 
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    hasMoreNotifications,
    markAsRead,
    deleteNotification,
  };
}

type NotificationsContextType = ReturnType<typeof useWebSocketNotifications>;
const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const notificationsValue = useWebSocketNotifications();
  return (
    <NotificationsContext.Provider value={notificationsValue}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationsProvider');
  return context;
}
