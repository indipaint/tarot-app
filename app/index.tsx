import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
function toRoman(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
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
  PanResponder,
  Pressable,
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
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ---- Gesten ---- */
const EDGE_WIDTH = 48;
const SWIPE_DISTANCE = Math.min(110, SCREEN_W * 0.22);
const SWIPE_VELOCITY = 0.35;

/* ---- Layout Tuning (nur hier drehen) ---- */
// 1) Kamera raus: garantiert Platz oben (Punch-hole ist NICHT immer safe-area!)
const MIN_TOP_SAFE = 105; // <<< wenn Kamera noch im Bild: 72 / 80
const EXTRA_GAP = 6;     // "knapp darunter"

// 2) Titel näher ans Bild:
const TITLE_PULL_UP = 8; // <<< größer = Titel höher / näher ans Bild (z.B. 10..24)

// 3) Bildbereich (höher = Titel automatisch höher)
const IMAGE_AREA_FRACTION = 0.74;

// Bild nach oben ziehen (im Bildbereich)
const IMAGE_TOP_PULL = -90;

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const list = useMemo<Card[]>(() => {
    return Array.isArray(cardsData) ? (cardsData as Card[]) : [];
  }, []);

  const [index, setIndex] = useState(0);
  const [pile, setPile] = useState<number[]>([]);
const [pilePos, setPilePos] = useState(0);
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
  setPilePos(pilePos + 1);
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

  // Top-Safe: Punch-hole zuverlässig rausnehmen
  const topSafe = Math.max(MIN_TOP_SAFE, Math.round(insets.top) + EXTRA_GAP);

  const imageAreaHeight = Math.round(SCREEN_H * IMAGE_AREA_FRACTION);

  const num = Number(current.id);
const idText = num === 1 ? "0" : toRoman(num - 1);
  const title = `${idText} – ${current.name}`;

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <Animated.View
        style={[styles.flex, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Bildbereich: oben abgesichert gegen Kamera */}
        <View style={[styles.imageArea, { height: imageAreaHeight, paddingTop: topSafe }]}>
          <Image source={current.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Titel: extrem nah unter dem Bild */}
        <View style={[styles.titleWrap, { marginTop: -TITLE_PULL_UP }]}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        {/* Unten: Button + Counter */}
        <View style={styles.buttonRow}>
<View style={styles.buttonRow}>
  <Pressable
    onPress={() => router.push(`/card/${String(current.id)}`)}
    style={styles.button}
  >
    <Text style={styles.buttonText}>Deutung</Text>
  </Pressable>

  <Pressable style={styles.button} onPress={drawNext}>
    <Text style={styles.buttonText}>zieh</Text>
  </Pressable>
</View>




        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create(
  {buttonRow: {
  flexDirection: "row",
  justifyContent: "space-evenly",
  marginTop: 18,
},

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

  infoArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 18,
    paddingBottom: 18,
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


});
