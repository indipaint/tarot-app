import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000); // Splash bleibt 2 Sekunden sichtbar

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      initialRouteName="language"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="language" />
      <Stack.Screen name="intro" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="meaning" />
      <Stack.Screen name="journal" />
    </Stack>
  );
}