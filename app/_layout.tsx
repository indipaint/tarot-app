import { Stack } from "expo-router";
<Stack.Screen name="language" />

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
