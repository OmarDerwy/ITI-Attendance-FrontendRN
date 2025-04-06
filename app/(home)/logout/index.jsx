import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useAuthStore } from '@/store/index';

export default function LogoutScreen() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.isSignedIn);

  const handleLogout = async () => {
    await clearUser()
    console.log(user)
    router.replace("/(home)/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomButton text={'Logout'} buttonHandler={async () => handleLogout()}/>
    </View>
  );
}
