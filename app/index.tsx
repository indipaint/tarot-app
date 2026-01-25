import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const springBack = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start();
  };

  // ✅ Slide mit korrekter Reihenfolge (gegen "taucht nochmal auf")
  const slideTo = (targetIndex: number, outDir: -1 | 1) => {
    if (locked.current) return;
    locked.current = true;

    if (!cards.length) {
      locked.current = false;
      return;
    }

    const nextIndex = Math.max(0, Math.min(targetIndex, cards.length - 1));
    const OUT = SCREEN_W;

    // am Rand: zurück
    if (nextIndex === index) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 18,
      }).start(() => {
        locked.current = false;
      });
      return;
    }

    // 1) aktuelle Karte raus
    Animated.timing(translateX, {
      toValue: outDir * OUT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 🔧 WICHTIG: erst neue Startposition setzen ...
      translateX.setValue(-outDir * OUT);

      // ... dann Index wechseln (verhindert "alte Karte kommt nochmal")
      setIndex(nextIndex);

      // ... dann im nächsten Frame rein sliden
      requestAnimationFrame(() => {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }).start(() => {
          locked.current = false;
        });
      });
    });
  };

  const next = () => slideTo(index + 1, -1);
  const prev = () => slideTo(index - 1, 1);

  const randomDraw = () => {
    if (!cards.length) return;

    if (cards.length === 1) {
      setIndex(0);
      return;
    }

    let r = index;
    while (r === index) r = Math.floor(Math.random() * cards.length);

    const outDir: -1 | 1 = r > index ? -1 : 1;
    slideTo(r, outDir);
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
          translateX.stopAnimation();
        },

        onPanResponderMove: (_e, gs) => {
          if (locked.current) return;
          translateX.setValue(gs.dx * 0.9);
        },

        onPanResponderTerminationRequest: () => true,

        onPanResponderRelease: (_e, gs) => {
          if (locked.current) return;

          const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
          const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;

          if (swipeLeft) next();
          else if (swipeRight) prev();
          else springBack();
        },

        onPanResponderTerminate: () => {
          if (locked.current) return;
          springBack();
        },
      }),
    [cards.length, index]
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
  const id = String((card as any).id ?? index);

  // ===== Crossfade (NUR FRONT) =====
  const fade = useRef(new Animated.Value(1)).current;
  const [prevSource, setPrevSource] = useState<any | null>(null);
  const lastSourceRef = useRef<any | null>(null);
  const didMountRef = useRef(false);

  const currentSource = (card as any).image;

  useEffect(() => {
    if (!currentSource) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      lastSourceRef.current = currentSource;
      fade.setValue(1);
      setPrevSource(null);
      return;
    }

    const prevImg = lastSourceRef.current;
    lastSourceRef.current = currentSource;

    if (prevImg && prevImg !== currentSource) {
      // prev drunter liegen lassen
      setPrevSource(prevImg);

      // ✅ neues Bild startet unsichtbar (damit es nicht erst "aufploppt")
      fade.stopAnimation();
      fade.setValue(0);

      requestAnimationFrame(() => {
        Animated.timing(fade, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => setPrevSource(null));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ✅ BACK-LAYER: füllt den Hintergrund (gegen schwarzes Loch), ohne Crossfade
  const BackVisual = () => (
    <>
      <View style={styles.imageBox}>
        <Animated.Image
          source={currentSource}
          style={styles.imageAbs}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {roman} · {name}
      </Text>
    </>
  );

  // ✅ FRONT-LAYER: Crossfade
  const FrontVisual = () => (
    <>
      <View style={styles.imageBox}>
        {prevSource ? (
          <Animated.Image
            source={prevSource}
            style={styles.imageAbs}
            resizeMode="contain"
          />
        ) : null}

        <Animated.Image
          source={currentSource}
          style={[styles.imageAbs, { opacity: fade }]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {roman} · {name}
      </Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />

      <View style={styles.container}>
        {/* BACK-LAYER: verhindert Schwarz */}
        <View pointerEvents="none" style={[styles.swipeArea, styles.backLayer]}>
          <BackVisual />
        </View>

        {/* FRONT-LAYER: swipe + slide + crossfade */}
        <Animated.View
          style={[styles.swipeArea, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <FrontVisual />
        </Animated.View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.btn}
            onPress={() => router.push(`/meaning/${id}` as any)}
          >
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

  backLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
