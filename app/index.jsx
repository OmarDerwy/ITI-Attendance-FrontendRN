import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import {useNotifications} from "../../context/NotificationContext";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const {notification, expoPushToken, error} = useNotifications();
  if (error) {
    <ThemedText>Error: {error}</ThemedText>
  }
  useEffect(() => {
    const waitForSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); //for some delay for the splash screen

      if (true) {
        router.replace('(home)');
      }
      return null;
    };

    waitForSplash();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Image
        source={require("../assets/images/iti-logo.png")}
        style={{
          width: width * 0.7,
          height: width * 0.7,
          marginBottom: height * 0.01,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "black",
          fontWeight: "900",
          fontSize: width * 0.12,
          textAlign: "center",
        }}
      >
        TrackIt
      </Text>
    </View>
  );
}