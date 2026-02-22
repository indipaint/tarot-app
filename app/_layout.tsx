import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="language"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="intro" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="meaning" />
    </Stack>
  );
}
