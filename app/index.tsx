import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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

// Ritual-Fade-Dauer
const RITUAL_FADE_MS = 4000;

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

  // Während der Transition liegt die Zielkarte "hinten" und wird sichtbar
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);

  // progress: 0 = nur alte Karte sichtbar, 1 = nur neue Karte sichtbar
  const progress = useRef(new Animated.Value(0)).current;

  const locked = useRef(false);

  const clampIndex = (i: number) => Math.max(0, Math.min(i, cards.length - 1));

  const startRitualTo = (targetIndex: number) => {
    if (locked.current) return;
    if (!cards.length) return;

    const nextIndex = clampIndex(targetIndex);
    if (nextIndex === index) return; // am Rand: nix

    locked.current = true;
    setIncomingIndex(nextIndex);

    progress.stopAnimation();
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: RITUAL_FADE_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        // Abbruch -> sauber zurück
        progress.setValue(0);
        setIncomingIndex(null);
        locked.current = false;
        return;
      }

      // Jetzt erst "wirklich" umschalten, dann Reset
      setIndex(nextIndex);
      requestAnimationFrame(() => {
  setIncomingIndex(null);
  progress.setValue(0);
  locked.current = false;
});
    });
  };

  const next = () => startRitualTo(index + 1);
  const prev = () => startRitualTo(index - 1);

  const randomDraw = () => {
    if (!cards.length) return;
    if (cards.length === 1) {
      setIndex(0);
      return;
    }

    let r = index;
    while (r === index) r = Math.floor(Math.random() * cards.length);

    startRitualTo(r);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,

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
          // Falls gerade irgendwas läuft, Finger “nimmt Kontrolle” -> wir lassen aber NICHT ziehen,
          // weil du "einmal wischen -> dann Ritual" willst.
          // (Optional: hier könnte man progress abbrechen, mache ich bewusst NICHT automatisch.)
        },

        onPanResponderMove: () => {
          // absichtlich keine Bewegung / kein Drag-Preview
        },

        onPanResponderTerminationRequest: () => true,

        onPanResponderRelease: (_e, gs) => {
          if (locked.current) return;

          const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
          const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;

          if (swipeLeft) next();
          else if (swipeRight) prev();
        },

        onPanResponderTerminate: () => {
          // nix
        },
      }),
    [cards.length, index]
  );

  const currentCard = cards[index];
  const nextCard = incomingIndex != null ? cards[incomingIndex] : null;

  if (!cards.length || !currentCard) {
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

  const outgoingOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const incomingOpacity = progress; // 0..1

  const currentNum =
    typeof (currentCard as any).id === "number" ? (currentCard as any).id : index;
  const currentRoman = toRoman(currentNum);
  const currentName = (currentCard as any).name ?? (currentCard as any).title ?? "Unbenannt";
  const currentId = String((currentCard as any).id ?? index);

  const nextNum =
    nextCard && typeof (nextCard as any).id === "number"
      ? (nextCard as any).id
      : incomingIndex ?? index;
  const nextRoman = toRoman(nextNum);
  const nextName = nextCard ? ((nextCard as any).name ?? (nextCard as any).title ?? "Unbenannt") : "";

  const currentSource = (currentCard as any).image;
  const nextSource = nextCard ? (nextCard as any).image : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />

      <View style={styles.container}>
        {/* SWIPE AREA */}
        <View style={styles.swipeArea} {...panResponder.panHandlers}>
          <View style={styles.imageBox}>
            {/* INCOMING (hinten) */}
            {nextSource ? (
              <Animated.Image
                source={nextSource}
                style={[styles.imageAbs, { opacity: incomingOpacity }]}
                resizeMode="contain"
              />
            ) : null}

            {/* OUTGOING (oben) */}
            <Animated.Image
              source={currentSource}
              style={[styles.imageAbs, { opacity: outgoingOpacity }]}
              resizeMode="contain"
            />
          </View>

          {/* TITLES (gleiches Prinzip) */}
          {nextCard ? (
            <Animated.Text style={[styles.title, { opacity: incomingOpacity }]} numberOfLines={2}>
              {nextRoman} · {nextName}
            </Animated.Text>
          ) : null}

          <Animated.Text style={[styles.title, { opacity: outgoingOpacity }]} numberOfLines={2}>
            {currentRoman} · {currentName}
          </Animated.Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={() => router.push(`/meaning/${currentId}` as any)}>
            <Text style={styles.btnText}>Deutung</Text>
          </Pressable>

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

  swipeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: BUTTON_BAR_H + 120,
  },

  imageBox: {
    width: "100%",
    height: SCREEN_H * 0.72,
  },
  imageAbs: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  title: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 20,
    color: "#888",
    letterSpacing: 1,
    textAlign: "center",
  },

  buttonRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 60,
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
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    backgroundColor: "#000",
  },

  btnText: { color: "#888", fontSize: 13, letterSpacing: 1 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorTitle: { color: "#fff", fontSize: 16, marginBottom: 10, textAlign: "center" },
  errorText: { color: "#bbb", fontSize: 13, paddingHorizontal: 20, textAlign: "center" },
});
