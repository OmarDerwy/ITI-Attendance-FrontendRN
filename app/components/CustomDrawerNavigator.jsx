import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNotifications } from '../../hooks/useWebSocketNotifications';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

export default function CustomDrawerNavigator({ screens }) {
  const router = useRouter();
  const { unreadCount } = useNotifications(); 

  return (
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
                  transform: [{ translateX: -90 }],
                }}
              >
                <Image
                  source={require("../../assets/images/iti-logo.png")}
                  style={{ width: 100, height: 40, marginRight: -27 }}
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
                  InTrack AI
                </Text>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push("/notifications")} // Navigate to notifications screen
                style={styles.notificationIcon}
              >
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color="black"
                  style={{ marginRight: width * 0.04 }}
                />
                {unreadCount > 0 && ( // Show badge only if there are unread notifications
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
    right: -0.01,
    backgroundColor: "#c71717",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
