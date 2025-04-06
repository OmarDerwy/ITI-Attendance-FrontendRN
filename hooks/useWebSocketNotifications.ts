import { useEffect, useState, useRef } from "react";
import * as storage from "expo-secure-store";
import { getUserNotifications, markNotificationAsRead, deleteNotification as deleteNotificationAPI } from "../api/notifications";

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        setHasMoreNotifications(data.length > 0); 
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const connectWebSocket = async () => {
      const token = await storage.getItemAsync("token");
      const wsUrl = `ws://192.168.1.7:8000/ws/notifications/?token=${token}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => console.log("WebSocket connected");
      ws.current.onclose = () => console.log("WebSocket disconnected");
      ws.current.onerror = (e) => console.error("WebSocket error:", e);

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const newNotification: Notification = {
            id: Date.now(),
            message: data.message || "New notification",
            created_at: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            is_read: false,
          };

          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        } catch (err) {
          console.error("Invalid WebSocket message", e.data);
        }
      };
    };

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
