import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import i18n, { getLocale, subscribeLocale } from "../../../src/i18n";

// ✅ Lädt DE oder EN je nach Sprache
function getMeaningsModule(locale: string): any {
  if (locale === "en") {
    const mod = require("../../../src/data/meanings_en");
    return mod?.default ?? mod?.MEANINGS_EN ?? mod;
  }
  const mod = require("../../../src/data/meanings");
  return mod?.default ?? mod?.MEANINGS ?? mod;
}

function getMeaningByIdLocal(id: string | number, locale: string) {
  const list = getMeaningsModule(locale);
  const key = String(id).replace(/^0+/, "");
  const arr = Array.isArray(list) ? list : [];
  return arr.find((m: any) => String(m.id).replace(/^0+/, "") === key);
}

export default function MeaningByIdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [locale, setLocaleState] = useState(getLocale());
  useEffect(() => {
    return subscribeLocale((lang: string) => setLocaleState(lang));
  }, []);

  const idParam = (params?.id ?? "") as string;

  // ✅ locale als Dependency damit Re-render bei Sprachwechsel
  const meaning = useMemo(() => getMeaningByIdLocal(idParam, locale), [idParam, locale]);

  const title =
    meaning?.title ??
    meaning?.name ??
    (meaning?.id !== undefined
      ? `${locale === "en" ? "Meaning" : "Deutung"} ${meaning.id}`
      : locale === "en" ? "Meaning" : "Deutung");

  const text =
    meaning?.general ??
    meaning?.text ??
    (locale === "en" ? "No meaning found." : "Keine Deutung gefunden.");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 22,
              height: 1,
              backgroundColor: "#000",
            }}
          />
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
  safe: { flex: 1, backgroundColor: "#f4fbd1" },
  container: { flex: 1, backgroundColor: "#f4fbd1" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#f4fbd1",
  },
  headerTitleWrap: { flex: 1, alignItems: "flex-end" },
  headerTitle: {
    textAlign: "right",
    color: "#aaaaaa",
    fontSize: 14,
    letterSpacing: 1,
    paddingRight: 10,
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
    backgroundColor: "#f4fbd1",
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