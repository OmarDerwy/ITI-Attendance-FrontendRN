import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useWebSocketNotifications from "../hooks/useWebSocketNotifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, deleteNotification } = useWebSocketNotifications();
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null); 
  const [visibleCount, setVisibleCount] = useState(10); // Number of notifications currently visible

  useEffect(() => {
    setDisplayedNotifications(notifications.slice(0, visibleCount)); 
  }, [notifications, visibleCount]);

  const handleMarkAsRead = (id) => {
    markAsRead(id); // Mark the notification as read
    Alert.alert("Notification marked as read");
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Remove the notification from the displayed list
            setDisplayedNotifications((prev) =>
              prev.filter((notification) => notification.id !== id)
            );
            deleteNotification(id); 
          },
        },
      ]
    );
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10); // Increase the visible count by 10
  };

  const renderNotificationItem = ({ item }) => {
    const formattedTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo", // Set the timezone to Cairo
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    }).format(new Date(item.created_at));

    return (
      <View style={styles.notificationItemContainer}>
        <TouchableOpacity
          style={[
            styles.notificationItem,
            item.is_read ? styles.readNotification : styles.unreadNotification,
          ]}
          onPress={() => handleMarkAsRead(item.id)}
        >
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{formattedTime}</Text>
        </TouchableOpacity>

        {/* Three Dots Menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            setSelectedNotification(
              selectedNotification === item.id ? null : item.id
            )
          }
        >
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>

        {/* Menu Options */}
        {selectedNotification === item.id && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                handleMarkAsRead(item.id);
                setSelectedNotification(null); // Close the menu
              }}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Mark as Read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleDeleteNotification(item.id);
                setSelectedNotification(null); 
              }}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={displayedNotifications.slice().reverse()} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationList}
      />

      {/* See More Button */}
      {visibleCount < notifications.length && (
        <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationList: {
    flexGrow: 1,
  },
  notificationItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  notificationItem: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  unreadNotification: {
    backgroundColor: "#f9f9f9",
  },
  readNotification: {
    backgroundColor: "#fff",
  },
  notificationMessage: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
  },
  menuButton: {
    padding: 10,
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuOptionText: {
    fontSize: 14,
    color: "black",
  },
  seeMoreButton: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 10,
  },
  seeMoreText: {
    color: "#ac0808",
    fontWeight: "bold",
  },
});