import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <Text style={styles.err}>Karte nicht gefunden (id: {idStr})</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const name = card?.name ?? card?.title ?? "Unbenannt";
  const image = card?.image;
  const safeId = String(card?.id ?? idStr); // für Routes immer string

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.err}>Kein Bild</Text>
        )}

        <Text style={styles.title}>{name}</Text>

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={() => router.back()}>
            <Text style={styles.btnText}>Zurück</Text>
          </Pressable>

          <Pressable
            style={styles.btn}
            onPress={() => router.push(`/meaning/${safeId}` as any)}
          >
            <Text style={styles.btnText}>Deutung</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, padding: 0, alignItems: "center", justifyContent: "flex-start" },
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
