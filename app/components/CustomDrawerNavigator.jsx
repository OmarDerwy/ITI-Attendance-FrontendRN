import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useWebSocket from "../hooks/useWebSocket"; // Import the WebSocket hook

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

export default function CustomDrawerNavigator({ screens }) {
  const { messages, isConnected } = useWebSocket("ws://192.168.x.x:8000/ws/notifications/"); // Replace with your server's IP
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (messages?.length > 0) {
      setUnreadCount((prevCount) => prevCount + 1); // Increment unread count for new messages
    }
  }, [messages]);

  const handleNotificationPress = () => {
    alert("Notifications!");
    setUnreadCount(0); // Reset unread count when the icon is pressed
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            width: 250,
          },
          overlayColor: "transparent",
          drawerContentStyle: {
            paddingTop: 20,
          },
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleAlign: "center",
          drawerLabelStyle: {
            color: "white",
            fontSize: 16,
          },
        }}
      >
        {screens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            component={screen.component}
            options={{
              title: screen.title,
              headerTitle: () => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    left: "50%",
                    transform: [{ translateX: -80 }],
                  }}
                >
                  <Image
                    source={require("../../assets/images/iti-logo.png")}
                    style={{ width: 100, height: 40, marginRight: -32 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      fontWeight: "bold",
                      marginLeft: -5,
                      alignSelf: "flex-end",
                    }}
                  >
                    -TrackIt
                  </Text>
                </View>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={25}
                    color="black"
                    style={{ marginRight: width * 0.04 }}
                  />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            }}
          />
        ))}
      </Drawer.Navigator>
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionStatusText}>WebSocket Disconnected</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  notificationIcon: {
    position: "relative",
    marginRight: width * 0.04,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  connectionStatus: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  connectionStatusText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
});
