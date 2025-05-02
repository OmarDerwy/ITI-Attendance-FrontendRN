import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { getRandomBytes } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Constants from "expo-constants";
import Toast from 'react-native-toast-message';
import axiosBackendInstance from '../../../api/axios'
import { useAuthStore } from '@/store/index';
import { useQuery } from '@tanstack/react-query';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';


const { width } = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ClockInOutScreen() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [deviceUUID, setDeviceUUID] = useState(null);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false); 
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(false); 
  const { first_name } = useAuthStore((state) => state.first_name);
  const { id } = useAuthStore((state) => state.id);

  

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
      const response = await axiosBackendInstance.get(`attendance/status/`);

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
      console.log("deviceUUID",deviceUUID);
      
      Toast.show({ type: "error", text1: "UUID is not available" });
      return;
    }
    console.log(id);
    const location = await getLocation();
    if (!location) return;

    const { latitude, longitude } = location.coords;
    // const latitude = 30.071112	;
    // const longitude = 31.018496 ;
  
    
    // console.log("Sending:", {
    //   user_id: 1,
    //   uuid: deviceUUID,
    //   latitude,
    //   longitude,
    // });
    console.log("Sending:", {
      user_id: id,
      uuid: deviceUUID,
      latitude,
      longitude,
    });
    try {
      const response = await axiosBackendInstance.post(
        `attendance/${type}/`,
        {
          user_id: id,
          uuid: deviceUUID,
          latitude,
          longitude,
        }
      );

      console.log("checkin Response:", response.data);

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
      console.error("Error during check-in/out:", errorMessage);
      Toast.show({
        type: "error",
        text1: "API error",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };

  // code to fetch the next upcoming day to be used in the check in and check out using tanstack
  const { data: upcomingRecords, isLoading: isLoadingRecords, error } = useQuery({
    queryKey: ["upcomingRecords"],
    queryFn: async () => {
      const response = await axiosBackendInstance.get(`attendance/upcoming-records/`);
      return response.data;
    },
    refetchOnMount: true,
    staleTime: 0,
  });


  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <ImageBackground
      source={require("../../../assets/images/el3asema2.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.profileSection}>
          <View>
            {isLoadingRecords ? (
              <Animated.View style={animatedStyle}>
                <MaterialCommunityIcons name="loading" size={90} color="gray" />
              </Animated.View>
            ) : (
              upcomingRecords && upcomingRecords.data && upcomingRecords.data.length > 0 ? (
                <View
                  style={{
                    backgroundColor: "#222",
                    borderRadius: 10,
                    padding: 16,
                    width: width * 0.8,
                    marginBottom: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                    {upcomingRecords.data[0].schedule?.name || "Upcoming Schedule"}
                  </Text>
                  <Text style={{ color: "#bbb", fontSize: 14 }}>
                    Date: {upcomingRecords.data[0].schedule?.created_at?.slice(0, 10)}
                  </Text>
                  <Text style={{ color: "#bbb", fontSize: 14 }}>
                    Start: {new Date(upcomingRecords.data[0].schedule?.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  <Text style={{ color: "#bbb", fontSize: 14 }}>
                    End: {new Date(upcomingRecords.data[0].schedule?.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  <Text style={{ color: "#bbb", fontSize: 14, marginTop: 4 }}>
                    Status: {upcomingRecords.data[0].status}
                  </Text>
                  {(upcomingRecords.data[0].status?.includes("late-excused") && upcomingRecords.data[0].adjusted_time) && (
                    <Text style={{ color: "#ffb300", fontSize: 14 }}>
                      Adjusted Start: {new Date(upcomingRecords.data[0].adjusted_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  )}
                  {(upcomingRecords.data[0].status?.includes("early-excused") && upcomingRecords.data[0].adjusted_time) && (
                    <Text style={{ color: "#ffb300", fontSize: 14 }}>
                      Adjusted End: {new Date(upcomingRecords.data[0].adjusted_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  )}
                </View>
              ) : (
                <MaterialCommunityIcons name="calendar-clock" size={90} color="gray" />
              ))}
          </View>
          <Text style={styles.username}>{first_name}</Text>
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
              disabled={isCheckInDisabled}
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
              disabled={isCheckOutDisabled}
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
    borderRadius: 10,
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