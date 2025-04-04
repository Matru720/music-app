import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerShown: false,
      statusBarBackgroundColor: "#000",
    }}
  >
    <Stack.Screen name="login" />
    <Stack.Screen name="index" />
    <Stack.Screen name="home" />
    <Stack.Screen name="library" />
    <Stack.Screen name="player" />
    <Stack.Screen name="profile"/>
  </Stack>
    ;
}