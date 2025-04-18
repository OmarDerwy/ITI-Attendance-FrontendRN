import React from "react";
import { useRouter } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomDrawerNavigator from "../../components/CustomDrawerNavigator";
import ClockInOutScreen from "../attendance";
import ReportScreen from "../report";
import LogoutScreen from "../logout";
import { useAuthStore } from '@/store/index';
import LeaveRequestScreen from "../leave-request";

const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");

function HomeScreen({ navigation }) {
  const { first_name } = useAuthStore((state) => state.first_name);
  const { last_name } = useAuthStore((state) => state.last_name);
  const { role } = useAuthStore((state) => state.role);
  const { email } = useAuthStore((state) => state.email);
  const router = useRouter();
  console.log(`Welcome ${first_name} ${last_name}`);
  console.log(`Email: ${email}`);
  console.log(`Role: ${role}`);

  return (
    <ImageBackground
      source={require("../../../assets/images/home-bg.webp")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <MaterialCommunityIcons name="account-circle" size={90} color="gray" />
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.welcome}>Welcome, {first_name}!</Text>
            <Text style={styles.subtitle}>
              Secure Your Presence, {"\n"}Simplify Your Day.
            </Text>
          </View>
        </View>
        <View style={styles.content}>

          { role == "student" && <TouchableOpacity style={styles.actionButton}
          onPress={() => navigation.navigate("Clock In/Out")}
          >
            <MaterialCommunityIcons name="fingerprint" size={30} color="#ac0808" />
            <Text style={styles.actionLabel}>Clock In/Out</Text>
          </TouchableOpacity>}

          <TouchableOpacity style={styles.actionButton}
            onPress={() => navigation.navigate("Report Found/Lost Item")}>
            <MaterialIcons name="report-problem" size={30} color="#ac0808" />
            <Text style={styles.actionLabel}>Report Found/Lost Item</Text>
          </TouchableOpacity>
          
          { role == "student" && <TouchableOpacity style={styles.actionButton}
            onPress={() => navigation.navigate("Leave Request")}>
            <MaterialIcons name="event-busy" size={30} color="#ac0808" />
            <Text style={styles.actionLabel}>Request Leave</Text>
          </TouchableOpacity>}
        </View >

      </View>
    </ImageBackground>
  );
}

export default function App() {
  const { role } = useAuthStore((state) => state.role);
  const screens = [
    { name: "Home", component: HomeScreen, title: "Home" },
    { name: "Clock In/Out", component: ClockInOutScreen, title: "Clock In/Out" },
    { name: "Report Found/Lost Item", component: ReportScreen, title: "Report Found/Lost Item" },
    { name: "Leave Request", component: LeaveRequestScreen, title: "Request Leave" },
    { name: "Logout", component: LogoutScreen, title: "Logout" },
  ];

  if (role !== "student") {
    screens.splice(1, 1); // Remove Clock In/Out for non-students
    screens.splice(2, 1); // Remove Leave Request for non-students
  }

  return <CustomDrawerNavigator screens={screens} />;
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(211, 211, 211, 0.212)",
    borderRadius: 10,
    marginHorizontal: 20,
    width: "85%",
  },
  content: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(211, 211, 211, 0.212)",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 30,
    width: "85%",
    height: height * 0.35,
  },
  avatarWrapper: {
    marginRight: 15,
  },
  welcomeText: {
    flexDirection: "column",
  },
  welcome: {
    fontSize: 20,
    color: "#ac0808",
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    marginTop: 5,
  },
 
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 15,
    width: "98%",
    elevation: 5,
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

