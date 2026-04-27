import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../../src/i18n";

// Karten laden (robust)
function getCards(): any[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

function normalizeId(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default function CardById() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  // ✅ id immer als STRING normalisieren
  const idStr = normalizeId(params.id);

  // ✅ EINMAL in number umwandeln
  const idNum = Number(idStr); // kann NaN sein, ist ok

  const cards = useMemo(() => getCards(), []);

  // ✅ NUR number mit number vergleichen
  const card = useMemo(() => {
    if (Number.isFinite(idNum)) {
      // primär: per card.id
      const byId = cards.find((c) => Number(c?.id) === idNum);
      if (byId) return byId;

      // fallback: als Index
      return cards[idNum] ?? null;
    }

    // fallback: string match
    return cards.find((c) => String(c?.id) === idStr) ?? null;
  }, [cards, idNum, idStr]);

  if (!card) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
          <Text style={styles.err}>Card not found (id: {idStr})</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
            <Text style={styles.btnText}>{i18n.t("buttons.back")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const safeId = String(card?.id ?? idStr); // für Routes immer string
  const name = i18n.t(`cards.${safeId}`, {
    defaultValue: card?.name ?? card?.title ?? "Card",
  });
  const image = card?.image;
  const [zoomValue] = useState(() => new Animated.Value(1));
  const [pinchValue] = useState(() => new Animated.Value(1));
  const [panX] = useState(() => new Animated.Value(0));
  const [panY] = useState(() => new Animated.Value(0));
  const [panEnabled, setPanEnabled] = useState(false);
  const lastZoomRef = React.useRef(1);
  const lastPanXRef = React.useRef(0);
  const lastPanYRef = React.useRef(0);

  const clampZoom = (value: number) => Math.max(1, Math.min(3.8, value));
  const scale = Animated.multiply(zoomValue, pinchValue);
  const onPinchGesture = Animated.event([{ nativeEvent: { scale: pinchValue } }], {
    useNativeDriver: true,
  });
  const onPanGesture = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY } }],
    { useNativeDriver: true }
  );
  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const next = clampZoom(lastZoomRef.current * Number(event.nativeEvent.scale || 1));
      lastZoomRef.current = next;
      zoomValue.setValue(next);
      pinchValue.setValue(1);
      setPanEnabled(next > 1.01);
      if (next <= 1) {
        lastPanXRef.current = 0;
        lastPanYRef.current = 0;
        panX.setOffset(0);
        panY.setOffset(0);
        panX.setValue(0);
        panY.setValue(0);
      }
    }
  };
  const onPanStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (lastZoomRef.current <= 1) {
        lastPanXRef.current = 0;
        lastPanYRef.current = 0;
      } else {
        lastPanXRef.current += Number(event.nativeEvent.translationX || 0);
        lastPanYRef.current += Number(event.nativeEvent.translationY || 0);
      }
      panX.setOffset(lastPanXRef.current);
      panY.setOffset(lastPanYRef.current);
      panX.setValue(0);
      panY.setValue(0);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {image ? (
          <PanGestureHandler
            enabled={panEnabled}
            minPointers={1}
            maxPointers={1}
            onGestureEvent={onPanGesture}
            onHandlerStateChange={onPanStateChange}
          >
            <Animated.View style={styles.imageWrap}>
              <PinchGestureHandler
                minPointers={2}
                onGestureEvent={onPinchGesture}
                onHandlerStateChange={onPinchStateChange}
              >
                <Animated.View
                  style={[
                    styles.imageWrap,
                    { transform: [{ translateX: panX }, { translateY: panY }, { scale }] },
                  ]}
                >
                  <Animated.Image source={image} style={styles.image} resizeMode="contain" />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        ) : (
          <Text style={styles.err}>No image</Text>
        )}

        <Text style={styles.title}>{name}</Text>

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={() => router.back()}>
            <Text style={styles.btnText}>{i18n.t("buttons.back")}</Text>
          </Pressable>

          <Pressable
            style={styles.btn}
            onPress={() => router.push(`/meaning/${safeId}` as any)}
          >
            <Text style={styles.btnText}>{i18n.t("buttons.meaning")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, padding: 0, alignItems: "center", justifyContent: "flex-start" },
  imageWrap: { width: "100%", flex: 1 },
  image: { width: "100%", flex: 1 },
  title: { color: "#888", marginTop: 10, fontSize: 16, letterSpacing: 1 },
  row: {
    marginTop: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
     paddingBottom: 88
     ,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  btnText: { color: "#888", fontSize: 13, letterSpacing: 1 },
  err: { color: "#fff", marginTop: 40 },
});
