import React, { useMemo, useRef, useState } from "react";

function toRoman(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "";
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
  let x = Math.floor(n);
  let out = "";
  for (const [v, s] of map) {
    while (x >= v) {
      out += s;
      x -= v;
    }
  }
  return out;
}

import type { ImageSourcePropType } from "react-native";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import cardsData from "../src/data/cards";

type Card = {
  id: string | number;
  name: string;
  image: ImageSourcePropType;

  // optional – falls vorhanden in deiner cards.ts
  meaningShort?: string;
  meaning?: string;
  keywords?: string[];
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ---- Gesten ---- */
const EDGE_WIDTH = 48;
const SWIPE_DISTANCE = Math.min(110, SCREEN_W * 0.22);
const SWIPE_VELOCITY = 0.35;

/* ---- Layout Tuning (nur hier drehen) ---- */
const MIN_TOP_SAFE = 105;
const EXTRA_GAP = 6;
const TITLE_PULL_UP = 8;
const IMAGE_AREA_FRACTION = 0.74;
const IMAGE_TOP_PULL = -90;

export default function Index() {
  const insets = useSafeAreaInsets();

  const list = useMemo<Card[]>(() => {
    return Array.isArray(cardsData) ? (cardsData as Card[]) : [];
  }, []);

  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // Zieh-Stapel
  const [pile, setPile] = useState<number[]>([]);
  const [pilePos, setPilePos] = useState(0);

  // Modal
  const [meaningOpen, setMeaningOpen] = useState(false);

  const indexRef = useRef(0);
  indexRef.current = index;

  const translateX = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  const clamp = (i: number) => Math.max(0, Math.min(list.length - 1, i));
  const current = list[index];

  const makeShuffled = (n: number) => {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const drawNext = () => {
    if (list.length < 2) return;

    // neuer Stapel, wenn leer oder verbraucht
    if (pile.length !== list.length || pilePos >= pile.length) {
      const fresh = makeShuffled(list.length);

      // nicht direkt dieselbe Karte als erste
      if (fresh[0] === index && fresh.length > 1) {
        [fresh[0], fresh[1]] = [fresh[1], fresh[0]];
      }

      setPile(fresh);
      setPilePos(1);
      setIndex(fresh[0]);
      return;
    }

    setIndex(pile[pilePos]);
    setPilePos((p) => p + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gs) => {
        if (locked.current || list.length <= 1) return false;

        const x0 = evt.nativeEvent.pageX;
        if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;

        const absDx = Math.abs(gs.dx);
        const absDy = Math.abs(gs.dy);
        return absDx > 6 && absDx > absDy + 4;
      },
      onPanResponderMove: (_e, gs) => translateX.setValue(gs.dx * 0.9),
      onPanResponderRelease: (_e, gs) => {
        const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
        const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;

        const canNext = indexRef.current < list.length - 1;
        const canPrev = indexRef.current > 0;

        if (swipeLeft && canNext) {
          locked.current = true;
          Animated.timing(translateX, {
            toValue: -SCREEN_W,
            duration: 160,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);
            setIndex((p) => clamp(p + 1));
            locked.current = false;
          });
          return;
        }

        if (swipeRight && canPrev) {
          locked.current = true;
          Animated.timing(translateX, {
            toValue: SCREEN_W,
            duration: 160,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);
            setIndex((p) => clamp(p - 1));
            locked.current = false;
          });
          return;
        }

        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!current) return null;

  const topSafe = Math.max(MIN_TOP_SAFE, Math.round(insets.top) + EXTRA_GAP);
  const imageAreaHeight = Math.round(SCREEN_H * IMAGE_AREA_FRACTION);

  const num = Number(current.id);
  const idText = num === 1 ? "0" : toRoman(num - 1);
  const title = `${idText} – ${current.name}`;

  // Text-Fallbacks: egal wie dein cards.ts heißt – es zeigt irgendwas Sinnvolles
  const shortText =
    current.meaningShort ??
    (Array.isArray(current.keywords) ? current.keywords.join(" · ") : "");
  const longText = current.meaning ?? "";

  return (
    <View style={styles.root}><Text style={{ position: "absolute", top: 40, left: 12, color: "lime", zIndex: 999 }}>
  INDEX SCREEN
</Text>
<Text style={{ position: "absolute", top: 40, left: 12, color: "lime", zIndex: 999 }}>
  INDEX SCREEN
</Text>

      <StatusBar hidden />

      <Animated.View
        style={[styles.flex, { transform: [{ translateX }] }]}
      
      >
        {/* Bildbereich */}
        <View style={[styles.imageArea, { height: imageAreaHeight, paddingTop: topSafe }]}>
          <Image source={current.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Titel */}
        <View style={[styles.titleWrap, { marginTop: -TITLE_PULL_UP }]}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        {/* Buttons (NICHT doppelt rendern!) */}
        <View style={styles.buttonRow}>
          <Pressable onPress={() => setShowMeaning(v => !v)}
style={styles.button}>
            <Text style={styles.buttonText}>Deutung</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={drawNext}>
            <Text style={styles.buttonText}>zieh</Text>
          </Pressable>
        </View>
        {showMeaning && (
  <Text style={{ color: "white", textAlign: "center", marginTop: 12 }}>
    Platzhalter
  </Text>
)}

      </Animated.View>

      {/* MODAL: Deutung als Overlay (ohne Router) */}
      <Modal
        visible={meaningOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMeaningOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          {/* Klick auf Hintergrund schließt */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMeaningOpen(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {title}
              </Text>

              <Pressable onPress={() => setMeaningOpen(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {!!shortText && <Text style={styles.meaningShort}>{shortText}</Text>}

              <Text style={styles.meaningLong}>
                {longText ? longText : "(Noch kein Deutungstext hinterlegt.)"}
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable onPress={() => setMeaningOpen(false)} style={styles.footerBtn}>
                <Text style={styles.footerBtnText}>Schließen</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  image: {
    width: "100%",
    height: "120%",
    marginTop: IMAGE_TOP_PULL,
  },

  titleWrap: {
    paddingTop: 0,
    paddingBottom: 6,
    alignItems: "center",
  },
  cardTitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  buttonRow: {
    
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 18,
  },

  button: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.58)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    maxHeight: "82%",
    backgroundColor: "rgba(20,20,24,0.98)",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },
  modalTitle: {
    flex: 1,
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 12,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  closeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "700",
  },

  modalScroll: { flexGrow: 0 },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 18,
  },
  meaningShort: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginBottom: 10,
  },
  meaningLong: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    lineHeight: 22,
  },

  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",
  },
  footerBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  footerBtnText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 15,
    fontWeight: "600",
  },
});
