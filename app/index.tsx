import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StatusBar,
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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Android Back-Geste: links und rechts Rand freilassen
const EDGE_WIDTH = 48;

// Swipe
const SWIPE_DISTANCE = Math.min(110, SCREEN_W * 0.22);
const SWIPE_VELOCITY = 0.35;

// Layout: Bild oben, UI unten
const IMAGE_AREA_FRACTION = 0.80; // kleiner = mehr Platz unten

// Bildposition im oberen Bereich
const IMAGE_TOP_PULL = -90; // stärker hochziehen: -70 / -90 / -110

// Punch-hole / Kamera: wir reservieren oben zuverlässig Platz
// (StatusbarHeight ist oft zu klein für Punch-hole, daher MIN_TOP_SAFE)
const MIN_TOP_SAFE = 40; // <<< zuverlässig "Kamera raus" (bei Bedarf 48)
const EXTRA_GAP = 6;     // "knapp darunter"

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
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (evt, gs) => {
        if (locked.current) return false;
        if (list.length <= 1) return false;

        const x0 = evt?.nativeEvent?.pageX ?? 9999;
        if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;

        const absDx = Math.abs(gs.dx);
        const absDy = Math.abs(gs.dy);

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

  // Top-Safe: garantiert genug Abstand für Punch-hole/Kamera
  const statusH = Math.round(Constants.statusBarHeight || 0);
  const topSafe = Math.max(MIN_TOP_SAFE, statusH + EXTRA_GAP);

  const imageAreaHeight = Math.round(SCREEN_H * IMAGE_AREA_FRACTION);

  return (
    <View style={styles.root}>
      {/* Statusbar weg */}
      <StatusBar hidden />

      <Animated.View style={[styles.flex, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        {/* Bildbereich oben, aber mit "Kamera-Schutz" */}
        <View style={[styles.imageArea, { height: imageAreaHeight, paddingTop: topSafe }]}>
          <Image source={current.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* UI unten */}
        <View style={styles.infoArea}>
          <Text style={styles.name}>{current.name}</Text>

          <Pressable onPress={openCurrentCard} style={styles.button}>
            <Text style={styles.buttonText}>Deutung öffnen</Text>
          </Pressable>

          <Text style={styles.counter}>
            {index + 1} / {list.length} • Wischen: nächste/vorige
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  flex: { flex: 1 },

  imageArea: {
    overflow: "hidden",
    backgroundColor: "black",
  },

  // Bild wird "hochgezogen", aber erst NACH dem Top-Safe Padding
  image: {
    width: "100%",
    height: "120%",
    marginTop: IMAGE_TOP_PULL,
  },

  infoArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    alignItems: "center",
  },

  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    marginBottom: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  counter: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },

  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 24,
  },
  fallbackText: { color: "white", opacity: 0.8 },
});
