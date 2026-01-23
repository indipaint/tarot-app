import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Swipe-Tuning
const EDGE_WIDTH = 18;
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 0.35;

const BUTTON_BAR_H = 76;

// Karten laden (robust: default oder named export)
function getCards(): any[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

// Roman numerals (Narr = 0)
function toRoman(n: number) {
  if (n === 0) return "0";
  if (!Number.isFinite(n) || n < 0) return "";

  const map: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let res = "";
  let x = Math.floor(n);

  for (const [v, s] of map) {
    while (x >= v) {
      res += s;
      x -= v;
    }
  }
  return res;
}

export default function Index() {
  const router = useRouter();

  const cards = useMemo(() => getCards(), []);
  const [index, setIndex] = useState(0);
  const card = cards[index];

  const translateX = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  const next = () =>
    setIndex((i) => (cards.length ? Math.min(i + 1, cards.length - 1) : 0));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  // ✅ Random draw (nicht dieselbe Karte zweimal hintereinander)
  const randomDraw = () => {
    if (!cards.length) return;

    let r = index;
    if (cards.length === 1) {
      setIndex(0);
      return;
    }

    while (r === index) {
      r = Math.floor(Math.random() * cards.length);
    }
    setIndex(r);
  };

  const springBack = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Tap soll NIE den Responder claimen (sonst Buttons kaputt)
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,

        // Nur bei echter horizontaler Bewegung
        onMoveShouldSetPanResponder: (evt, gs) => {
          if (locked.current) return false;

          const x0 = evt.nativeEvent.pageX;
          if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;

          const absDx = Math.abs(gs.dx);
          const absDy = Math.abs(gs.dy);
          return absDx > 8 && absDx > absDy + 6;
        },

        onMoveShouldSetPanResponderCapture: (evt, gs) => {
          if (locked.current) return false;

          const x0 = evt.nativeEvent.pageX;
          if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;

          const absDx = Math.abs(gs.dx);
          const absDy = Math.abs(gs.dy);
          return absDx > 8 && absDx > absDy + 6;
        },

        onPanResponderGrant: () => {
          locked.current = true;
        },

        onPanResponderMove: (_e, gs) => {
          translateX.setValue(gs.dx * 0.9);
        },

        // Termination erlauben (Android/OS)
        onPanResponderTerminationRequest: () => true,

        onPanResponderRelease: (_e, gs) => {
          const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
          const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;

          if (swipeLeft) next();
          else if (swipeRight) prev();

          locked.current = false;
          springBack();
        },

        onPanResponderTerminate: () => {
          locked.current = false;
          springBack();
        },
      }),
    [cards.length]
  );

  if (!cards.length || !card) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar hidden />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Cards fehlen / Import stimmt nicht</Text>
          <Text style={styles.errorText}>
            Prüfe: src/data/cards.ts export (default oder named)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const num = typeof (card as any).id === "number" ? (card as any).id : index;
  const roman = toRoman(num);
  const name = (card as any).name ?? (card as any).title ?? "Unbenannt";
  const id = (card as any).id ?? index;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />

      <View style={styles.container}>
        {/* SWIPE NUR AUF DEM BILD-BLOCK */}
        <Animated.View
          style={[styles.swipeArea, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <Image
            source={(card as any).image}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            {roman} · {name}
          </Text>
        </Animated.View>

        {/* BUTTONS: AUßERHALB vom PanResponder => werden nicht geschluckt */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={() => router.push(`/meaning/${id}` as any)}>
            <Text style={styles.btnText}>Deutung</Text>
          </Pressable>

          {/* ✅ Random statt next */}
          <Pressable style={styles.btn} onPress={randomDraw}>
            <Text style={styles.btnText}>Zieh</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1 },

  // Bild ganz oben (knapp unter Notch)
  swipeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0, // 👈 hier feinjustieren (0 / 1 / 2)
    paddingHorizontal: 0,
    paddingBottom: BUTTON_BAR_H + 10,
  },

  image: {
    width: "100%",
    height: SCREEN_H * 0.72,
  },

  title: {
    marginTop: 8,
    fontSize: 18,
    color: "#bbb",
    letterSpacing: 1,
    textAlign: "center",
  },

  buttonRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    height: BUTTON_BAR_H,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 18,
    zIndex: 999,
    elevation: 999,
  },

  btn: {
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    backgroundColor: "#000",
  },

  btnText: { color: "#ddd", fontSize: 16, letterSpacing: 1 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorTitle: { color: "#fff", fontSize: 16, marginBottom: 10, textAlign: "center" },
  errorText: { color: "#bbb", fontSize: 13, paddingHorizontal: 20, textAlign: "center" },
});
