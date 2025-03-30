import { Stack } from "expo-router";

// TODO implement some form of caching and state management


export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="(home)"/>
      </Stack>
  );
}
