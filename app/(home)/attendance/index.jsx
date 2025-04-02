import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { getRandomBytes } from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Constants from "expo-constants";
import Toast from 'react-native-toast-message';
import axiosBackendInstance from '../../../api/axios'

const { width } = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function ClockInOutScreen() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [deviceUUID, setDeviceUUID] = useState(null);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false); 
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(false); 

  const fetchDeviceUUID = async () => {
    let storedUUID = await SecureStore.getItemAsync("deviceUUID");
    if (!storedUUID) {
      storedUUID = uuidv4({ random: getRandomBytes(16) });
      await SecureStore.setItemAsync("deviceUUID", storedUUID);
    }
    setDeviceUUID(storedUUID);    
  };

  const fetchUserStatus = async () => {
    try {
      const response = await axiosBackendInstance.get(`api/v1/attendance/status/`);

      if (response.data.is_checked_in) {
        setIsCheckInDisabled(true); 
        setIsCheckOutDisabled(false); 
      } else {
        setIsCheckInDisabled(false); 
        setIsCheckOutDisabled(true); 
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
      Toast.show({
        type: "error",
        text1: "Error fetching user status",
        text2: error.message,
      });
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    fetchDeviceUUID();
    fetchUserStatus(); 
    return () => clearInterval(interval);
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Location permission denied" });
        return null;
      }
      return await Location.getCurrentPositionAsync({ timeout: 5000 });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error fetching location" });
      return null;
    }
  };

  const checkInOrOut = async (type) => {
    if (!deviceUUID) {
      Toast.show({ type: "error", text1: "UUID is not available" });
      return;
    }
    const location = await getLocation();
    if (!location) return;

    // const { latitude, longitude } = location.coords;
    const latitude = 30.0444;
    const longitude = 31.2357; 
   

    console.log("Sending:", {
      user_id: 1,
      uuid: deviceUUID,
      latitude,
      longitude,
    });

    try {
      const response = await axiosBackendInstance.post(
        `api/v1/attendance/${type}/`,
        {
          user_id: 34,
          uuid: deviceUUID,
          latitude,
          longitude,
        }
      );

      console.log("Response:", response.data);

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: `${response.data.message}`,
          position: "bottom",
          timeout: 3000,
        });

        if (type === "check-in") {
          setIsCheckInDisabled(true);
          setIsCheckOutDisabled(false);
        } else if (type === "check-out") {
          setIsCheckInDisabled(false);
          setIsCheckOutDisabled(true);
        }
      } else {
        Toast.show({
          type: "error",
          text1: `Failed: ${response.data.message}`,
          position: "bottom",
          timeout: 3000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Toast.show({
        type: "error",
        text1: "API error",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/home-bg.webp")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <MaterialCommunityIcons
              name="account-circle"
              size={100}
              color="gray"
            />
          </View>
          <Text style={styles.username}>Ahmed</Text>
          <Text style={styles.date}>{currentDate}</Text>
          <Text style={styles.time}>{currentTime}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[
                styles.checkInButton,
                isCheckInDisabled && styles.disabledButton,
              ]}
              onPress={() => checkInOrOut("check-in")}
              disabled={isCheckInDisabled} // Disable button if state is true
            >
              <MaterialCommunityIcons
                name="map-marker-check"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Check In</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[
                styles.checkOutButton,
                isCheckOutDisabled && styles.disabledButton,
              ]}
              onPress={() => checkInOrOut("check-out")}
              disabled={isCheckOutDisabled} // Disable button if state is true
            >
              <MaterialIcons name="location-off" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Check Out</Text>
          </View>
        </View>
      </View>
      <Toast />
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
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});