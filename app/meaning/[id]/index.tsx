import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Bedeutungen (robust: default oder named export)
function getMeaningsModule(): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../../../src/data/meanings");
  return mod?.default ?? mod?.MEANINGS ?? mod;
}

function getMeaningByIdLocal(id: string | number) {
  const list = getMeaningsModule();
  const key = String(id).replace(/^0+/, "");
  const arr = Array.isArray(list) ? list : [];
  return arr.find((m) => String(m.id).replace(/^0+/, "") === key);
}

export default function MeaningByIdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const idParam = (params?.id ?? "") as string;
  const meaning = useMemo(() => getMeaningByIdLocal(idParam), [idParam]);

  const title =
    meaning?.title ??
    meaning?.name ??
    (meaning?.id ? `Deutung ${meaning.id}` : "Deutung");

  const text =
    meaning?.general ??
    meaning?.text ??
    "Keine Deutung gefunden. Prüfe meanings.ts und die ID.";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText} numberOfLines={1}>
              Zurück
            </Text>
          </Pressable>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>

          {/* Spacer für symmetrisches Centering */}
          <View style={styles.headerRightSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 110 + insets.bottom + 56 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.body}>{text}</Text>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom - 40 }]}>
          <Pressable style={styles.bottomBtn} onPress={() => router.back()}>
            <Text
              style={[styles.bottomBtnText, { color: "#777" }]}
              numberOfLines={1}
            >
              Zurück
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    backgroundColor: "#000",
  },

  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    backgroundColor: "#000",
    minWidth: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "#888",
    fontSize: 13,
    letterSpacing: 1,
    flexShrink: 0,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#aaa",   // <<< gültige Farbe
    fontSize: 14,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },

  headerRightSpacer: {
    minWidth: 86,
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  body: {
    color: "#ddd",
    fontSize: 16,
    lineHeight: 24,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#111",
    backgroundColor: "#000",
    paddingTop: 10,
    alignItems: "center",
  },

  bottomBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#000",
  },

  bottomBtnText: {
    color: "#aaa", // Basis, wird inline zu #777 überschrieben
    fontSize: 14,
    letterSpacing: 1,
  },
});
