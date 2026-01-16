import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import cardsData from "../src/data/cards";

type Card = {
  id: string | number;
  name: string;
  image: ImageSourcePropType;
};

const { width: SCREEN_W } = Dimensions.get("window");

// Android Back-Geste geht oft links ODER rechts am Rand:
const EDGE_WIDTH = 48;

// Swipe-Feeling:
const SWIPE_DISTANCE = Math.min(110, SCREEN_W * 0.22);
const SWIPE_VELOCITY = 0.35;

export default function Index() {
  const router = useRouter();

  const list = useMemo<Card[]>(() => {
    return Array.isArray(cardsData) ? (cardsData as Card[]) : [];
  }, []);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  indexRef.current = index;

  const translateX = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  const clamp = (i: number) => {
    if (list.length === 0) return 0;
    return Math.max(0, Math.min(list.length - 1, i));
  };

  const current = list[index];

  const panResponder = useRef(
    PanResponder.create({
      // NICHT sofort übernehmen (sonst blockierst du System-Back-Gesten am Rand)
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (evt, gs) => {
        if (locked.current) return false;
        if (list.length <= 1) return false;

        const x0 = evt?.nativeEvent?.pageX ?? 9999;

        // Links UND rechts am Rand frei lassen -> Android System-Back-Geste funktioniert
        if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;

        const absDx = Math.abs(gs.dx);
        const absDy = Math.abs(gs.dy);

        // Nur klar horizontal
        return absDx > 6 && absDx > absDy + 4;
      },

      onPanResponderGrant: () => {
        locked.current = false;
        translateX.stopAnimation();
        translateX.setValue(0);
      },

      onPanResponderMove: (_evt, gs) => {
        translateX.setValue(gs.dx * 0.92);
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          speed: 18,
          bounciness: 0,
        }).start();
      },

      onPanResponderRelease: (_evt, gs) => {
        const dx = gs.dx;
        const vx = gs.vx;

        const swipeLeft = dx < -SWIPE_DISTANCE || vx < -SWIPE_VELOCITY;
        const swipeRight = dx > SWIPE_DISTANCE || vx > SWIPE_VELOCITY;

        const canGoNext = indexRef.current < list.length - 1;
        const canGoPrev = indexRef.current > 0;

        if (swipeLeft && canGoNext) {
          if (locked.current) return;
          locked.current = true;

          Animated.timing(translateX, {
            toValue: -SCREEN_W,
            duration: 160,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);

            // WICHTIG: funktionales Update -> kein "stale index" mehr
            setIndex((prev) => clamp(prev + 1));

            locked.current = false;
          });
          return;
        }

        if (swipeRight && canGoPrev) {
          if (locked.current) return;
          locked.current = true;

          Animated.timing(translateX, {
            toValue: SCREEN_W,
            duration: 160,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);

            setIndex((prev) => clamp(prev - 1));

            locked.current = false;
          });
          return;
        }

        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          speed: 18,
          bounciness: 0,
        }).start();
      },
    })
  ).current;

  const openCurrentCard = () => {
    if (!current) return;
    router.push(`/card/${String(current.id)}`);
  };

  if (!current) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Keine Karten gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.flex, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        <Image source={current.image} style={styles.image} resizeMode="contain" />

        {/* Overlay blockiert keine Gesten */}
        <View pointerEvents="none" style={styles.overlay}>
          <Text style={styles.title}>{current.name}</Text>
          <Text style={styles.subtitle}>
            {index + 1} / {list.length} • Tippen: Details • Wischen: nächste/vorige
          </Text>
        </View>

        {/* Tap-Fläche, ohne Pressable-Layer der Swipes klaut */}
        <Text onPress={openCurrentCard} style={styles.tapArea} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  flex: { flex: 1 },
  image: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
  },
  title: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  tapArea: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // unsichtbar, aber tappbar:
    color: "transparent",
  },
  fallback: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black", padding: 24 },
  fallbackText: { color: "white", opacity: 0.8 },
});
