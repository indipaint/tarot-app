import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import i18n, { getLocale, subscribeLocale } from "../../../src/i18n";


function getMeaningsModule(locale: string): any {
  const lang = locale.split("-")[0];

  if (lang === "en") {
    const mod = require("../../../src/data/meanings_en");
    return mod?.default ?? mod?.MEANINGS_EN ?? mod;
  }

  const mod = require("../../../src/data/meanings");
  return mod?.default ?? mod?.MEANINGS ?? mod;
}

function getMeaningByIdLocal(id: string | number) {
  const locale = (i18n as any).language ?? (i18n as any).locale ?? "de";
const list = getMeaningsModule(locale);
  const key = String(id).replace(/^0+/, "");
  const arr = Array.isArray(list) ? list : [];
  return arr.find((m) => m && m.id && String(m.id).replace(/^0+/, "") === key);
}

export default function MeaningByIdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // ✅ Locale-State für Re-render bei Sprachwechsel
  const [locale, setLocaleState] = useState(getLocale());
  useEffect(() => {
    return subscribeLocale((lang: string) => setLocaleState(lang));
  }, []);

  const idParam = (params?.id ?? "") as string;
  const meaning = useMemo(() => getMeaningByIdLocal(idParam), [idParam]);

  
  const text =
    meaning?.general ??
    meaning?.text ??
    "Keine Deutung gefunden. Prüfe meanings.ts und die ID.";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
       

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
          <Pressable
            style={[styles.bottomBtn, { backgroundColor: "#eedecc" }]}
            onPress={() => router.back()}
          >
            {/* ✅ Zurück-Button übersetzt */}
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
  container: { flex: 1, backgroundColor: "9dcdfc" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "9dcdfc",
  },
  headerTitleWrap: { flex: 1, alignItems: "flex-end" },
  headerTitle: {
    textAlign: "right",
    color: "9dcdfc",
    fontSize: 9,
    letterSpacing: 1,
    paddingRight: 14,
    marginTop: -29,
  },
  headerRightSpacer: { minWidth: 86 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, flexGrow: 1 },
  body: { color: "#201a01", fontSize: 19, lineHeight: 24 },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "9dcdfc",
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
