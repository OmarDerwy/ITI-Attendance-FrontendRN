import React, { useEffect } from "react";
import { View, Text, Image, Dimensions, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); //for some delay for the splash screen

      // Check if the user is logged in (e.g., token exists in SecureStore)
      const token = await SecureStore.getItemAsync("authToken"); //using expo-secure-store to store authentication tokens

      if (true) {
        router.replace("/home");
      } else {
        router.replace("/auth/sign-in");
      }
      return null;
    };

    checkAuth();
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