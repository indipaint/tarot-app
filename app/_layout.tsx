import React, { useEffect } from "react";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { ensureCommunityAuth } from "../src/ensureCommunityAuth";
import { db } from "../src/firebase";

export default function RootLayout() {
  useEffect(() => {
    let unsub: (() => void) | null = null;
    let stopped = false;

    const isExpoGo =
      (Constants as any)?.appOwnership === "expo" || (Constants as any)?.executionEnvironment === "storeClient";
    const canSetBadgeInThisRuntime = !(isExpoGo && Platform.OS === "android");

    (async () => {
      try {
        const uid = await ensureCommunityAuth();
        if (stopped || !uid) return;
        unsub = onSnapshot(doc(db, "community_users", uid), (snap) => {
          const unread = Number(snap.data()?.unreadCount || 0);
          if (canSetBadgeInThisRuntime) {
            try {
              // Lazy-require: avoid importing expo-notifications in Expo Go Android (SDK 53+).
              const Notifications = require("expo-notifications");
              Notifications.setBadgeCountAsync(Math.max(0, unread)).catch(() => {});
            } catch {
              // ignore
            }
          }
        });
      } catch {
        // keep app usable even when notifications fail
      }
    })();

    return () => {
      stopped = true;
      if (unsub) unsub();
    };
  }, []);

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
