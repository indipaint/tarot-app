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

// Ritual-Fade-Dauer
const RITUAL_FADE_MS = 4000;

// ===== WELCOME FEINTUNING (HIER DREHST DU NUR ZAHLEN) =====
const WELCOME_SCALE = 1.12; // höher = weniger Rand, aber mehr „Zoom“
const WELCOME_TRANSLATE_Y = -177; // negativer = höher Richtung Selfiekamera
const WELCOME_BTN_MARGIN_TOP = -266; // negativer = Button höher ins Bild

// Karten laden
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

const cards = useMemo(() => {
  const all = getCards();

  // Rückseite / Welcome-Karte darf NIE im Spieldeck sein
  return all.filter((c: any) => String(c?.id) !== "BACK");
}, []);


  const [index, setIndex] = useState(0);

  // Begrüßungs-Overlay
  const [showWelcome, setShowWelcome] = useState(true);

  // Transition
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  const clampIndex = (i: number) => Math.max(0, Math.min(i, cards.length - 1));

  const startRitualTo = (targetIndex: number) => {
    if (locked.current) return;
    if (!cards.length) return;

    const nextIndex = clampIndex(targetIndex);
    if (nextIndex === index) return;

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
        progress.setValue(0);
        setIncomingIndex(null);
        locked.current = false;
        return;
      }

      setIndex(nextIndex);

      // wichtig: erst im nächsten Frame resetten -> stabil, kein Flicker
      requestAnimationFrame(() => {
        setIncomingIndex(null);
        progress.setValue(0);
        locked.current = false;
      });
    });
  };

  const next = () => startRitualTo(index + 1);
  const prev = () => startRitualTo(index - 1);

  // ===== Deck ohne Dopplung (für Zieh-Button) =====
  const deckRef = useRef<number[]>([]);
  const deckPosRef = useRef(0);

  const shuffleInPlace = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const rebuildDeck = (excludeIndex?: number) => {
    const arr = Array.from({ length: cards.length }, (_, i) => i);
    const filtered =
      typeof excludeIndex === "number" ? arr.filter((i) => i !== excludeIndex) : arr;
    shuffleInPlace(filtered);
    deckRef.current = filtered;
    deckPosRef.current = 0;
  };

  const drawUnique = () => {
    if (!cards.length) return;

    // Deck leer/aufgebraucht -> neu mischen (ohne aktuelle Karte)
    if (deckRef.current.length === 0 || deckPosRef.current >= deckRef.current.length) {
      rebuildDeck(index);
    }

    const nextIdx = deckRef.current[deckPosRef.current++];
    startRitualTo(nextIdx);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
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

        onPanResponderRelease: (_e, gs) => {
          if (locked.current) return;

          const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
          const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;

          if (swipeLeft) next();
          else if (swipeRight) prev();
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
  const incomingOpacity = progress;

  // Prefix (Arkana: römisch, Stäbe: 01..14) – NUR aus der Karten-ID, nie aus Index
  const displayPrefix = (card: any) => {
    const id = String(card?.id ?? "");

    // Arkana: "01".."22" => römisch
    if (/^\d+$/.test(id)) return toRoman(Number(id));

    // Stäbe: "W01".."W14" => "01".."14"
    if (id.startsWith("W")) return id.slice(1);

    return "";
  };

  const currentPrefix = displayPrefix(currentCard);
  const nextPrefix = nextCard ? displayPrefix(nextCard) : "";

  const currentName =
    (currentCard as any).name ?? (currentCard as any).title ?? "Unbenannt";
  const currentId = String((currentCard as any).id ?? index);

  const nextName = nextCard
    ? ((nextCard as any).name ?? (nextCard as any).title ?? "Unbenannt")
    : "";

  const currentSource = (currentCard as any).image;
  const nextSource = nextCard ? (nextCard as any).image : null;

  const isTransitioning = incomingIndex !== null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />

      <View style={styles.container}>
        {/* WELCOME OVERLAY */}
        {showWelcome ? (
          <View style={styles.welcomeOverlay}>
            <Image
              source={require("../assets/images/cards/Rueckseite.jpg")}
              style={{
                width: "100%",
                height: "100%",
                transform: [
                  { scale: WELCOME_SCALE },
                  { translateY: WELCOME_TRANSLATE_Y },
                ],
              }}
              resizeMode="contain"
            />

            <Pressable
              style={[styles.welcomeBtn, { marginTop: WELCOME_BTN_MARGIN_TOP }]}
              onPress={() => {
                if (cards.length > 1) {
                  let r = index;
                  while (r === index) r = Math.floor(Math.random() * cards.length);
                  setIndex(r);
                  rebuildDeck(r); // verhindert Sofort-Repeat bei "Zieh"
                } else {
                  rebuildDeck(index);
                }
                setShowWelcome(false);
              }}
            >
              <Text style={styles.welcomeBtnText}>ZIEH EINE KARTE</Text>
            </Pressable>
          </View>
        ) : null}

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

          {/* TITEL: exakt wie Bilder überblenden -> kein "1 weiter" Gefühl */}
          <View style={styles.titleWrap}>
            {/* INCOMING Titel */}
            {nextCard ? (
              <Animated.Text style={[styles.title, { opacity: incomingOpacity }]} numberOfLines={2}>
                {nextPrefix} · {nextName}
              </Animated.Text>
            ) : null}

            {/* OUTGOING Titel */}
            <Animated.Text
              style={[styles.title, { opacity: outgoingOpacity, position: "absolute" }]}
              numberOfLines={2}
            >
              {currentPrefix} · {currentName}
            </Animated.Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={() => router.push(`/meaning/${currentId}` as any)}>
            <Text style={styles.btnText}>Deutung</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={drawUnique}>
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

titleWrap: {
  marginTop: 8,
  height: 44,          // <-- statt 24 (2 Zeilen à ~20 + Luft)
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  width: "100%",
  },

  title: {
    marginTop: 0,
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

  /* WELCOME STYLES */
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#05050A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    zIndex: 9999,
    elevation: 9999,
  },

  welcomeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(180,180,255,0.6)",
    backgroundColor: "rgba(40,40,80,0.6)",
  },

  welcomeBtnText: { color: "#eaeaff", letterSpacing: 1.4, fontWeight: "700" },
});
