import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="intro" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="meaning" />
    </Stack>
  );
}
