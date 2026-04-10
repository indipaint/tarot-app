import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  // Splash: expo-router steuert hide über renderRootComponent/router-store — kein zweites
  // preventAutoHide aus expo-splash-screen hier (Konflikt / Overlay-Risiko).
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        initialRouteName="language"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000" },
          freezeOnBlur: false,
          animation: "slide_from_right",
        }}
      />
    </GestureHandlerRootView>
  );
}
