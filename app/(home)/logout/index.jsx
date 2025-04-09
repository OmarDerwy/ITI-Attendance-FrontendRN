import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useAuthStore } from '@/store/index';

export default function LogoutScreen() {
  const router = useRouter();
  const userContext = useAuthStore((state) => state);
  // const user = useAuthStore((state) => state.isSignedIn);

  const handleLogout = async () => {
    await userContext.clearUser()
    console.log("User logged out")
    router.replace("/(home)/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomButton text={'Logout'} buttonHandler={ async () => handleLogout()}/>
    </View>
  );
}
