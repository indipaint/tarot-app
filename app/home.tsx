import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
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

// ✅ FIX 1: Kein require() mehr – sauberer ES-Import
import i18n, { getLocale, setLocale, subscribeLocale } from "../src/i18n";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const EDGE_WIDTH = 18;
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 0.35;
const BUTTON_BAR_H = 76;
const RITUAL_FADE_MS = 4000;

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

function toRoman(n: number) {
  if (n === 0) return "0";
  if (!Number.isFinite(n) || n < 0) return "";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "";
  let x = Math.floor(n);
  for (const [v, s] of map) {
    while (x >= v) { res += s; x -= v; }
  }
  return res;
}

export default function Index() {
  const router = useRouter();

  // ✅ FIX 2: Locale-State damit Re-render bei Sprachwechsel passiert
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    return subscribeLocale((lang: string) => setLocaleState(lang));
  }, []);

  const cards = useMemo(() => {
    const all = getCards();
    return all.filter((c: any) => String(c?.id) !== "BACK");
  }, []);

  const [index, setIndex] = useState(0);
  const [showWelcome] = useState(true);
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
      requestAnimationFrame(() => {
        setIncomingIndex(null);
        progress.setValue(0);
        locked.current = false;
      });
    });
  };

  const next = () => startRitualTo(index + 1);
  const prev = () => startRitualTo(index - 1);

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
    const filtered = typeof excludeIndex === "number" ? arr.filter((i) => i !== excludeIndex) : arr;
    shuffleInPlace(filtered);
    deckRef.current = filtered;
    deckPosRef.current = 0;
  };

  const drawUnique = () => {
    if (!cards.length) return;
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
          <Text style={styles.errorText}>Prüfe: src/data/cards.ts export (default oder named)</Text>
        </View>
      </SafeAreaView>
    );
  }

  const outgoingOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const incomingOpacity = progress;

  const displayPrefix = (card: any) => {
    const id = String(card?.id ?? "");
    if (/^\d+$/.test(id)) return toRoman(Number(id));
    if (id.startsWith("W")) return id.slice(1);
    return "";
  };

  const currentPrefix = displayPrefix(currentCard);
  const nextPrefix = nextCard ? displayPrefix(nextCard) : "";
  const currentName = (currentCard as any).name ?? (currentCard as any).title ?? "Unbenannt";
  const currentId = String((currentCard as any).id ?? index);
  const nextName = nextCard ? ((nextCard as any).name ?? (nextCard as any).title ?? "Unbenannt") : "";
  const currentSource = (currentCard as any).image;
  const nextSource = nextCard ? (nextCard as any).image : null;

  // ✅ FIX 3: EN navigiert jetzt genauso zur App wie DE
  const setLangAndStart = (lang: "de" | "en") => {
    setLocale(lang);
    router.replace("/intro");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />
      <View style={styles.container}>

        {/* WELCOME OVERLAY */}
        {showWelcome ? (
          <View style={styles.welcomeOverlay}>
            <Image
              source={require("../assets/images/cards/Rueckseite.jpg")}
              style={styles.welcomeBg}
              resizeMode="cover"
            />
            <View style={styles.welcomeCard}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.welcomeIcon}
                resizeMode="contain"
              />
              <View style={styles.langCol}>
                <Pressable
                  style={[styles.langBtn, styles.langBtnPrimary]}
                  onPress={() => setLangAndStart("de")}
                >
                  <Text style={[styles.langBtnText, styles.langBtnTextPrimary]}>
                    DE — Deutsch
                  </Text>
                </Pressable>

                <Pressable style={styles.langBtn} onPress={() => setLangAndStart("en")}>
                  <Text style={styles.langBtnText}>EN — English</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {/* SWIPE AREA */}
        <View style={styles.swipeArea} {...panResponder.panHandlers}>
          <View style={styles.imageBox}>
            {nextSource ? (
              <Animated.Image
                source={nextSource}
                style={[styles.imageAbs, { opacity: incomingOpacity }]}
                resizeMode="contain"
              />
            ) : null}
            <Animated.Image
              source={currentSource}
              style={[styles.imageAbs, { opacity: outgoingOpacity }]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleWrap}>
            {nextCard ? (
              <Animated.Text style={[styles.title, { opacity: incomingOpacity }]} numberOfLines={2}>
                {nextPrefix} · {nextName}
              </Animated.Text>
            ) : null}
            <Animated.Text
              style={[styles.title, { opacity: outgoingOpacity, position: "absolute" }]}
              numberOfLines={2}
            >
              {currentPrefix} · {currentName}
            </Animated.Text>
          </View>
        </View>

        {/* ✅ FIX 4: Buttons verwenden i18n.t() statt hardcoded Deutsch */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={() => router.push(`/meaning/${currentId}` as any)}>
            <Text style={styles.btnText}>{i18n.t("buttons.meaning")}</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={drawUnique}>
            <Text style={styles.btnText}>{i18n.t("buttons.draw")}</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => {}}>
            <Text style={styles.btnText}>Language</Text>
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
  imageBox: { width: "100%", height: SCREEN_H * 0.72 },
  imageAbs: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  titleWrap: {
    marginTop: 8,
    height: 44,
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
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#05050a",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  welcomeBg: { ...StyleSheet.absoluteFillObject, opacity: 0.25 },
  welcomeCard: { width: "100%", maxWidth: 460, paddingHorizontal: 24, alignItems: "center" },
  welcomeIcon: { width: 140, height: 140, marginBottom: 18 },
  langCol: { width: "100%", gap: 10 },
  langBtn: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  langBtnPrimary: {
    borderColor: "rgba(180,180,255,0.8)",
    backgroundColor: "rgba(40,40,80,0.55)",
  },
  langBtnText: { color: "#bbb", letterSpacing: 1, fontSize: 15, fontWeight: "600" },
  langBtnTextPrimary: { color: "#eaeaff" },
});
