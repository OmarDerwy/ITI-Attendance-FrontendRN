import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

export default function CustomDrawerNavigator({ screens }) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "rgba(39, 39, 39, 0.5)",
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
            headerTitle: screen.headerTitle || screen.title,
            headerRight: () => (
              <TouchableOpacity onPress={() => alert("Notifications!")}>
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color="black"
                  style={{ marginRight: width * 0.04 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
