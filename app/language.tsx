import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setLocale } from "../src/i18n";

export default function LanguageGate() {
  const router = useRouter();

  const choose = (lang: "de" | "en") => {
    setLocale(lang);

    if (lang === "de") {
      router.replace("/intro");
      return;
    }

    // EN Platzhalter
    router.replace("/modal");
  };

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