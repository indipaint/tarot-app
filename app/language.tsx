import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setLocale } from "../src/i18n";
const FORCE_LANGUAGE_SCREEN = true;

export default function LanguageGate() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const go = (lang: string) => {
    setLocale(lang);

    if (lang === "de") {
      router.replace("/intro");
      return;
    }

    // EN Platzhalter
    router.replace("/modal");
  };

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.removeItem("app_lang");
        const saved = await AsyncStorage.getItem("app_lang");
if (!FORCE_LANGUAGE_SCREEN && (saved === "de" || saved === "en")) {
  go(saved);
  return;
}
      } catch (e) {
        console.log("LANG CHECK ERROR:", e);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const choose = async (lang: "de" | "en") => {
    setLocale(lang);
    await AsyncStorage.setItem("app_lang", lang);
    go(lang);
  };

  // ✅ Sichtbarer Loading Screen
  if (checking) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.debug}>LANGUAGE SCREEN LOADING</Text>
      </View>
    );
  }

  // ✅ Normaler Screen
  return (
    <View style={styles.wrap}>
      <Text style={styles.debug}>LANGUAGE SCREEN ACTIVE</Text>

      <Text style={styles.title}>Sprache wählen</Text>

      <Pressable style={styles.btn} onPress={() => choose("de")}>
        <Text style={styles.btnText}>DE</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => choose("en")}>
        <Text style={styles.btnText}>EN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },

  // nur Debug sichtbar
  debug: {
    color: "red",
    fontSize: 22,
    marginBottom: 20,
  },

  title: {
    color: "#bbb",
    fontSize: 18,
    letterSpacing: 1,
  },

  btn: {
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  btnText: {
    color: "#ddd",
    fontSize: 16,
    letterSpacing: 2,
  },
});