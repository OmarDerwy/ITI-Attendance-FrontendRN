import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ClockInOutScreen() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDate(date);
      setCurrentTime(time);
    };

    // Update date and time every second
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/home-bg.webp")}
      style={styles.background}
    >
      <View style={styles.overlay}>      
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <MaterialCommunityIcons name="account-circle" size={100} color="gray" />
          </View>
          <Text style={styles.username}>Ahmed</Text>
          <Text style={styles.date}>{currentDate}</Text>
          <Text style={styles.time}>{currentTime}</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 50,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 100,
    padding: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  date: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
  time: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  clockInButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  clockOutButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
});
