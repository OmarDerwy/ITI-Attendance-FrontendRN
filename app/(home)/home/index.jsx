import React from "react";
import { useRouter } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomDrawerNavigator from "../../components/CustomDrawerNavigator";
import ClockInOutScreen from "../attendance";
import ReportScreen from "../report";
import LogoutScreen from "../logout";
import { useAuthStore } from '@/store/index';
import LeaveRequestScreen from "../leave-request";
import LeaveRequestCenter from "../leave-requests-center";
import GuestEventsScreen from "../guest-events";
// import EventDetailsScreen from "./event-details";

const { width, height } = Dimensions.get("window");

function isAllowed(allowedRoles, role) {
  if (allowedRoles === "all") return true;
  return Array.isArray(allowedRoles) && allowedRoles.includes(role);
}

// Unified config for screens and buttons
const screensConfig = [
  {
    name: "Home",
    component: null, // HomeScreen will be injected below
    title: "Home",
    allowedRoles: "all",
    showButton: false
  },
  {
    name: "Clock In/Out",
    component: ClockInOutScreen,
    title: "Clock In/Out",
    allowedRoles: ["student", "guest"],
    showButton: true,
    icon: { type: MaterialCommunityIcons, name: "fingerprint", color: "#ac0808", size: 30 },
    buttonLabel: "Clock In/Out"
  },
  {
    name: "Leave Requests Center",
    component: LeaveRequestCenter,
    title: "Leave Requests Center",
    allowedRoles: ["supervisor", "coordinator"],
    showButton: true,
    icon: { type: MaterialIcons, name: "assignment", color: "#ac0808", size: 30 },
    buttonLabel: "Leave Requests Center"
  },
  {
    name: "Report Found/Lost Item",
    component: ReportScreen,
    title: "Report Found/Lost Item",
    allowedRoles: "all",
    showButton: true,
    icon: { type: MaterialIcons, name: "report-problem", color: "#ac0808", size: 30 },
    buttonLabel: "Report Found/Lost Item"
  },
  {
    name: "Leave Request",
    component: LeaveRequestScreen,
    title: "Request Leave",
    allowedRoles: ["student"],
    showButton: true,
    icon: { type: MaterialIcons, name: "event-busy", color: "#ac0808", size: 30 },
    buttonLabel: "Request Leave"
  },
  {
    name: "Guest Events",
    component: GuestEventsScreen,
    title: "Upcoming Events",
    allowedRoles: ["guest"],
    showButton: true,
    icon: { type: MaterialCommunityIcons, name: "calendar", color: "#ac0808", size: 30 },
    buttonLabel: "View Events"
  },
  {
    name: "Schedule",
    component: require("../schedule").default,
    title: "Schedule",
    allowedRoles: ["student", "guest"],
    showButton: true,
    icon: { type: MaterialCommunityIcons, name: "calendar-month", color: "#ac0808", size: 30 },
    buttonLabel: "View Schedule"
  },
  {
    name: "Logout",
    component: LogoutScreen,
    title: "Logout",
    allowedRoles: "all",
    showButton: false
  },
  // {
  //   name: "EventDetails",
  //   component: EventDetailsScreen,
  //   title: "Event Details",
  //   allowedRoles: ["student", "guest"],
  //   showButton: false
  // }
];

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
    <ImageBackground source={require("../../../assets/images/el3asema2.png")} style={styles.background}>
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
          {screensConfig.filter(s => s.showButton && isAllowed(s.allowedRoles, role)).map(screen => (
            <TouchableOpacity
              key={screen.name}
              style={styles.actionButton}
              onPress={() => navigation.navigate(screen.name)}
            >
              {screen.icon && (
                <screen.icon.type
                  name={screen.icon.name}
                  size={screen.icon.size}
                  color={screen.icon.color}
                />
              )}
              <Text style={styles.actionLabel}>{screen.buttonLabel}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

// Inject HomeScreen as the component for Home
screensConfig[0].component = HomeScreen;

export default function App() {
  const { role } = useAuthStore((state) => state.role);
  // Only include screens allowed for the current role
  const screens = screensConfig.filter(s => isAllowed(s.allowedRoles, role));
  return <CustomDrawerNavigator screens={screens} />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
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
    backgroundColor: "rgba(211, 211, 211, 0.5)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    marginHorizontal: 20,
    width: "90%",
  },
  content: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(211, 211, 211, 0.5)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 30,
    width: "90%",
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
    color: "black",
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
  actionLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ac0808",
    fontWeight: "bold",
  },
});

