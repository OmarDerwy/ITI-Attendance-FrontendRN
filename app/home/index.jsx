import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/home-bg.webp")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>TrackIt:</Text>
          <Text style={styles.subtitle}>
            Secure Your Presence, Simplify Your Day
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* Check In Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.checkInButton}>
              <MaterialCommunityIcons
                name="map-marker-check"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Check In</Text>
          </View>

          {/* Check Out Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.checkOutButton}>
              <MaterialIcons name="location-off" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Check Out</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  return (
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
            width: 250, // Drawer width
          },
          overlayColor: "transparent", // No overlay color
          drawerContentStyle: {
            paddingTop: 20,
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", 
    marginTop: 100, 
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 120,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  checkInButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  checkOutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});