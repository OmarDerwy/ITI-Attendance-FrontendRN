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
              <TouchableOpacity onPress={screen.onNotificationPress || (() => alert("Notifications!"))}>
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
