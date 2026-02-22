import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setLocale } from "../src/i18n";

export default function LanguageGate() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const go = (lang: "de" | "en") => {
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
        const saved = await AsyncStorage.getItem("app_lang");
        if (saved === "de" || saved === "en") {
          go(saved);
          return;
        }
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

  if (checking) {
    return <View style={styles.wrap} />;
  }

  return (
    <View style={styles.wrap}>
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
  title: { color: "#bbb", fontSize: 18, letterSpacing: 1 },
  btn: {
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  btnText: { color: "#ddd", fontSize: 16, letterSpacing: 2 },
});