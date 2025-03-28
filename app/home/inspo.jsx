// import React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import {
//   Text,
//   View,
//   StyleSheet,
//   ImageBackground,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// const Drawer = createDrawerNavigator();
// const { width, height } = Dimensions.get("window");

// function HomeScreen() {
//   return (
//     <ImageBackground
//       source={require("../../assets/images/home-bg.webp")}
//       style={styles.background}
//     >
//       {/* User Profile Section */}
//       <View style={styles.profileSection}>
//         <View style={styles.avatarWrapper}>
//           <MaterialCommunityIcons name="account-circle" size={80} color="gray" />
//         </View>
//         <View style={styles.welcomeText}>
//           <Text style={styles.welcome}>Welcome</Text>
//           <Text style={styles.username}>Ahmed</Text>
//         </View>
//       </View>

//       {/* Statistics Section */}
//       <View style={styles.statsSection}>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>25.14</Text>
//           <Text style={styles.statLabel}>Annual</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>0.00</Text>
//           <Text style={styles.statLabel}>Days Off</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>0.00</Text>
//           <Text style={styles.statLabel}>Holidays</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statValue}>4.00</Text>
//           <Text style={styles.statLabel}>Perms.</Text>
//         </View>
//       </View>

//       {/* Action Buttons Section */}
//       <View style={styles.actionsSection}>
//         <TouchableOpacity style={styles.actionButton}>
//           <MaterialIcons name="pending-actions" size={30} color="green" />
//           <Text style={styles.actionLabel}>Pending Requests</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="time-outline" size={30} color="green" />
//           <Text style={styles.actionLabel}>Time Keeping</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <MaterialCommunityIcons name="fingerprint" size={30} color="green" />
//           <Text style={styles.actionLabel}>Clock In/Out</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.buttonContainer}>
//                 {/* Check In Button */}
//                 <View style={styles.buttonWrapper}>
//                   <TouchableOpacity style={styles.checkInButton}>
//                     <MaterialCommunityIcons
//                       name="map-marker-check"
//                       size={30}
//                       color="white"
//                     />
//                   </TouchableOpacity>
//                   <Text style={styles.buttonText}>Check In</Text>
//                 </View>
      
//                 {/* Check Out Button */}
//                 <View style={styles.buttonWrapper}>
//                   <TouchableOpacity style={styles.checkOutButton}>
//                     <MaterialIcons name="location-off" size={30} color="white" />
//                   </TouchableOpacity>
//                   <Text style={styles.buttonText}>Check Out</Text>
//                 </View>
//               </View>

//       {/* Footer Section */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Last update: 28 Mar, 08:12 AM</Text>
//         <Text style={styles.footerText}>Bits Egypt Systems Integrations</Text>
//       </View>

//       {/* Floating Action Button */}
//       <TouchableOpacity style={styles.floatingButton}>
//         <Ionicons name="add" size={30} color="white" />
//       </TouchableOpacity>
//     </ImageBackground>
//   );
// }

// function ProfileScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Profile Screen</Text>
//     </View>
//   );
// }

// export default function App() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           width: 250,
//         },
//         overlayColor: "transparent",
//         drawerContentStyle: {
//           paddingTop: 20,
//         },
//         headerStyle: {
//           backgroundColor: "white",
//         },
//         headerTitleAlign: "center",
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           headerTitle: () => (
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "absolute",
//                 left: "50%",
//                 transform: [{ translateX: -80 }],
//               }}
//             >
//               <Image
//                 source={require("../../assets/images/iti-logo.png")}
//                 style={{
//                   width: 100,
//                   height: 40,
//                   marginRight: -32,
//                 }}
//                 resizeMode="contain"
//               />
//               <Text
//                 style={{
//                   fontSize: width * 0.04,
//                   fontWeight: "bold",
//                   marginLeft: -5,
//                   alignSelf: "flex-end",
//                 }}
//               >
//                 -TrackIt
//               </Text>
//             </View>
//           ),
//           headerRight: () => (
//             <TouchableOpacity onPress={() => alert("Notifications!")}>
//               <Ionicons
//                 name="notifications-outline"
//                 size={25}
//                 color="black"
//                 style={{ marginRight: width * 0.04 }}
//               />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ title: "👤 My Profile" }}
//       />
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 50,
//     paddingHorizontal: 20,
//   },
//   avatarWrapper: {
//     marginRight: 15,
//   },
//   welcomeText: {
//     flexDirection: "column",
//   },
//   welcome: {
//     fontSize: 18,
//     color: "green",
//     fontWeight: "bold",
//   },
//   username: {
//     fontSize: 22,
//     color: "green",
//     fontWeight: "bold",
//   },
//   statsSection: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//     paddingHorizontal: 10,
//   },
//   statCard: {
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 10,
//     width: width * 0.2,
//     elevation: 5,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "green",
//   },
//   statLabel: {
//     fontSize: 14,
//     color: "gray",
//   },
//   actionsSection: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 30,
//     paddingHorizontal: 10,
//   },
//   actionButton: {
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     width: width * 0.25,
//     elevation: 5,
//   },
//   actionLabel: {
//     fontSize: 14,
//     color: "gray",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 20,
//     alignItems: "center",
//     width: "100%",
//   },
//   footerText: {
//     fontSize: 12,
//     color: "gray",
//   },
//   floatingButton: {
//     position: "absolute",
//     bottom: 80,
//     right: 20,
//     backgroundColor: "green",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });