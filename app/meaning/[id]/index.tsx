import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import i18n, { getLocale, subscribeLocale } from "../../../src/i18n";

function getMeaningsModule(locale: string): any {
  const lang = String(locale || "de").split("-")[0];

  if (lang === "fr") {
    // FR
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../../../src/data/meanings_fr");
    return mod?.default ?? mod?.MEANINGS_FR ?? mod;
  }

  if (lang === "en") {
    // EN
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../../../src/data/meanings_en");
    return mod?.default ?? mod?.MEANINGS_EN ?? mod;
  }

  // DE fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../../../src/data/meanings");
  return mod?.default ?? mod?.MEANINGS ?? mod;
}

function getMeaningByIdLocal(id: string | number, locale: string) {
  const list = getMeaningsModule(locale);
  const arr = Array.isArray(list) ? list : [];
  return arr.find((m) => String(m?.id) === String(id));
}

export default function MeaningByIdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [locale, setLocaleState] = useState(getLocale());
  useEffect(() => {
    return subscribeLocale((lang: string) => setLocaleState(lang));
  }, []);

  const idParam = String(params?.id ?? "");

  const meaning = useMemo(() => getMeaningByIdLocal(idParam, locale), [idParam, locale]);

  const text =
    meaning?.general ??
    meaning?.text ??
    "Keine Deutung gefunden. Prüfe meanings.ts / meanings_en.ts / meanings_fr.ts und die ID.";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 110 + insets.bottom + 56 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {meaning?.title ? <Text style={styles.title}>{meaning.title}</Text> : null}
          <Text style={styles.body}>{text}</Text>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(0, insets.bottom - 40) }]}>
          <Pressable
            style={[styles.bottomBtn, { backgroundColor: "#eedecc" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.bottomBtnText, { color: "#777" }]} numberOfLines={1}>
              {i18n.t("buttons.back")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#9dcdfc" },
  container: { flex: 1, backgroundColor: "#9dcdfc" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, flexGrow: 1 },

  title: {
    color: "#201a01",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  body: { color: "#201a01", fontSize: 19, lineHeight: 24 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#9dcdfc",
    paddingTop: 10,
    alignItems: "center",
  },
  bottomBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#eedecc",
  },
  bottomBtnText: { color: "#777", fontSize: 10, letterSpacing: 1 },
});