[1mdiff --git a/app/_layout.tsx b/app/_layout.tsx[m
[1mindex da51882..a8a3be4 100644[m
[1m--- a/app/_layout.tsx[m
[1m+++ b/app/_layout.tsx[m
[36m@@ -2,9 +2,16 @@[m [mimport { Stack } from "expo-router";[m
 [m
 export default function RootLayout() {[m
   return ([m
[31m-    <Stack screenOptions={{ headerShown: false }}>[m
[31m-      <Stack.Screen name="(tabs)" />[m
[31m-      <Stack.Screen name="meaning" />[m
[32m+[m[32m    <Stack[m
[32m+[m[32m      screenOptions={{ headerShown: false }}[m
[32m+[m[32m      initialRouteName="index"[m
[32m+[m[32m    >[m
[32m+[m[32m      <Stack.Screen name="index" />[m
[32m+[m[32m      <Stack.Screen name="fan-test" />[m
[32m+[m[32m      <Stack.Screen name="_tabs_off" />[m
[32m+[m[32m      <Stack.Screen name="card/[id]" />[m
[32m+[m[32m      <Stack.Screen name="meaning/[id]/index" />[m
[32m+[m[32m      <Stack.Screen name="modal" options={{ presentation: "modal" }} />[m
     </Stack>[m
   );[m
 }[m
[1mdiff --git a/app/_tabs_off/_layout.tsx b/app/_tabs_off/_layout.tsx[m
[1mdeleted file mode 100644[m
[1mindex 54e11d0..0000000[m
[1m--- a/app/_tabs_off/_layout.tsx[m
[1m+++ /dev/null[m
[36m@@ -1,35 +0,0 @@[m
[31m-import { Tabs } from 'expo-router';[m
[31m-import React from 'react';[m
[31m-[m
[31m-import { HapticTab } from '@/components/haptic-tab';[m
[31m-import { IconSymbol } from '@/components/ui/icon-symbol';[m
[31m-import { Colors } from '@/constants/theme';[m
[31m-import { useColorScheme } from '@/hooks/use-color-scheme';[m
[31m-[m
[31m-export default function TabLayout() {[m
[31m-  const colorScheme = useColorScheme();[m
[31m-[m
[31m-  return ([m
[31m-    <Tabs[m
[31m-      screenOptions={{[m
[31m-        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,[m
[31m-        headerShown: false,[m
[31m-        tabBarButton: HapticTab,[m
[31m-      }}>[m
[31m-      <Tabs.Screen[m
[31m-        name="index"[m
[31m-        options={{[m
[31m-          title: 'Home',[m
[31m-          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,[m
[31m-        }}[m
[31m-      />[m
[31m-      <Tabs.Screen[m
[31m-        name="explore"[m
[31m-        options={{[m
[31m-          title: 'Explore',[m
[31m-          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,[m
[31m-        }}[m
[31m-      />[m
[31m-    </Tabs>[m
[31m-  );[m
[31m-}[m
[1mdiff --git a/app/_tabs_off/index.tsx b/app/_tabs_off/index.tsx[m
[1mindex d2b8d97..ff3d6c5 100644[m
[1m--- a/app/_tabs_off/index.tsx[m
[1m+++ b/app/_tabs_off/index.tsx[m
[36m@@ -1,9 +1,23 @@[m
[31m-import { Text, View } from "react-native";[m
[32m+[m[32mimport { useRouter } from "expo-router";[m
[32m+[m[32mimport React from "react";[m
[32m+[m[32mimport { Pressable, Text, View } from "react-native";[m
 [m
 export default function TabIndex() {[m
[32m+[m[32m  const router = useRouter();[m
[32m+[m
[32m+[m[32m  const go = () => {[m
[32m+[m[32m  router.push("/_tabs_off/explore" as any);[m
[32m+[m[32m};[m
[32m+[m
   return ([m
[31m-    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>[m
[31m-      <Text style={{ fontSize: 28 }}>TAB INDEX 777</Text>[m
[32m+[m[32m    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 14 }}>[m
[32m+[m[32m      <Text style={{ fontSize: 18 }}>Bereit.</Text>[m
[32m+[m[32m      <Pressable[m
[32m+[m[32m        onPress={go}[m
[32m+[m[32m        style={{ paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderRadius: 10 }}[m
[32m+[m[32m      >[m
[32m+[m[32m        <Text>WEITER</Text>[m
[32m+[m[32m      </Pressable>[m
     </View>[m
   );[m
 }[m
[1mdiff --git a/app/index.tsx b/app/index.tsx[m
[1mindex 23119b8..8aa0931 100644[m
[1m--- a/app/index.tsx[m
[1m+++ b/app/index.tsx[m
[36m@@ -1,345 +1,27 @@[m
 import { useRouter } from "expo-router";[m
[31m-import { StatusBar } from "expo-status-bar";[m
[31m-import React, { useMemo, useRef, useState } from "react";[m
[31m-import {[m
[31m-  Animated,[m
[31m-  Dimensions,[m
[31m-  PanResponder,[m
[31m-  Pressable,[m
[31m-  StyleSheet,[m
[31m-  Text,[m
[31m-  View,[m
[31m-} from "react-native";[m
[31m-import { SafeAreaView } from "react-native-safe-area-context";[m
[31m-[m
[31m-const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");[m
[31m-[m
[31m-// Swipe-Tuning[m
[31m-const EDGE_WIDTH = 18;[m
[31m-const SWIPE_DISTANCE = 70;[m
[31m-const SWIPE_VELOCITY = 0.35;[m
[31m-[m
[31m-const BUTTON_BAR_H = 76;[m
[31m-[m
[31m-// Ritual-Fade-Dauer[m
[31m-const RITUAL_FADE_MS = 4000;[m
[31m-[m
[31m-// Karten laden (robust: default oder named export)[m
[31m-function getCards(): any[] {[m
[31m-  // eslint-disable-next-line @typescript-eslint/no-var-requires[m
[31m-  const mod = require("../src/data/cards");[m
[31m-  const data = mod?.default ?? mod?.cards ?? mod;[m
[31m-  return Array.isArray(data) ? data : [];[m
[31m-}[m
[31m-[m
[31m-// Roman numerals (Narr = 0)[m
[31m-function toRoman(n: number) {[m
[31m-  if (n === 0) return "0";[m
[31m-  if (!Number.isFinite(n) || n < 0) return "";[m
[31m-[m
[31m-  const map: Array<[number, string]> = [[m
[31m-    [1000, "M"],[m
[31m-    [900, "CM"],[m
[31m-    [500, "D"],[m
[31m-    [400, "CD"],[m
[31m-    [100, "C"],[m
[31m-    [90, "XC"],[m
[31m-    [50, "L"],[m
[31m-    [40, "XL"],[m
[31m-    [10, "X"],[m
[31m-    [9, "IX"],[m
[31m-    [5, "V"],[m
[31m-    [4, "IV"],[m
[31m-    [1, "I"],[m
[31m-  ];[m
[31m-[m
[31m-  let res = "";[m
[31m-  let x = Math.floor(n);[m
[31m-[m
[31m-  for (const [v, s] of map) {[m
[31m-    while (x >= v) {[m
[31m-      res += s;[m
[31m-      x -= v;[m
[31m-    }[m
[31m-  }[m
[31m-  return res;[m
[31m-}[m
[32m+[m[32mimport React from "react";[m
[32m+[m[32mimport { Image, Pressable, StyleSheet, Text, View } from "react-native";[m
 [m
 export default function Index() {[m
   const router = useRouter();[m
 [m
[31m-  const cards = useMemo(() => getCards(), []);[m
[31m-  const [index, setIndex] = useState(0);[m
[31m-[m
[31m-  // Während der Transition liegt die Zielkarte "hinten" und wird sichtbar[m
[31m-  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);[m
[31m-[m
[31m-  // progress: 0 = nur alte Karte sichtbar, 1 = nur neue Karte sichtbar[m
[31m-  const progress = useRef(new Animated.Value(0)).current;[m
[31m-[m
[31m-  const locked = useRef(false);[m
[31m-[m
[31m-  const clampIndex = (i: number) => Math.max(0, Math.min(i, cards.length - 1));[m
[31m-[m
[31m-  const startRitualTo = (targetIndex: number) => {[m
[31m-    if (locked.current) return;[m
[31m-    if (!cards.length) return;[m
[31m-[m
[31m-    const nextIndex = clampIndex(targetIndex);[m
[31m-    if (nextIndex === index) return; // am Rand: nix[m
[31m-[m
[31m-    locked.current = true;[m
[31m-    setIncomingIndex(nextIndex);[m
[31m-[m
[31m-    progress.stopAnimation();[m
[31m-    progress.setValue(0);[m
[31m-[m
[31m-    Animated.timing(progress, {[m
[31m-      toValue: 1,[m
[31m-      duration: RITUAL_FADE_MS,[m
[31m-      useNativeDriver: true,[m
[31m-    }).start(({ finished }) => {[m
[31m-      if (!finished) {[m
[31m-        // Abbruch -> sauber zurück[m
[31m-        progress.setValue(0);[m
[31m-        setIncomingIndex(null);[m
[31m-        locked.current = false;[m
[31m-        return;[m
[31m-      }[m
[31m-[m
[31m-      // Jetzt erst "wirklich" umschalten, dann Reset[m
[31m-      setIndex(nextIndex);[m
[31m-      requestAnimationFrame(() => {[m
[31m-  setIncomingIndex(null);[m
[31m-  progress.setValue(0);[m
[31m-  locked.current = false;[m
[31m-});[m
[31m-    });[m
[31m-  };[m
[31m-[m
[31m-  const next = () => startRitualTo(index + 1);[m
[31m-  const prev = () => startRitualTo(index - 1);[m
[31m-[m
[31m-  const randomDraw = () => {[m
[31m-    if (!cards.length) return;