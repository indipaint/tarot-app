import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setLocale } from "../src/i18n";

const FORCE_LANGUAGE_SCREEN = false;

export default function LanguageGate() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("app_lang");
        
        console.log("--- ANDROID SINGLE FLAG CHECK --- Gefundene Sprache:", saved);

        if (
          !FORCE_LANGUAGE_SCREEN &&
          (saved === "de" || saved === "en" || saved === "fr" || saved === "es" || saved === "pt")
        ) {
          setLocale(saved);
          // RADIKALE WEICHE: Sprache existiert -> User war schon mal hier -> DIREKT HAUPTSEITE!
          router.replace("/");
          return;
        }
      } catch (e) {
        console.log("LANG CHECK ERROR:", e);
      } finally {
        // Sicherstellen, dass der Ladebildschirm erst nach dem Check verschwindet
        setChecking(false);
      }
    })();
  }, []);

  const choose = async (lang: "de" | "en" | "fr" | "es" | "pt") => {
    try {
      setLocale(lang);
      await AsyncStorage.setItem("app_lang", lang);
      
      // Erster Start überhaupt: Sprache gewählt -> Ab ins Intro-Video
      router.replace("/intro");
    } catch (error) {
      console.log("CHOOSE ERROR:", error);
    }
  };

  // ✅ Unsichtbarer Loading Screen, kein Flackern mehr
  if (checking) {
    return <View style={styles.wrap} />;
  }

  // ✅ Normaler Screen
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Endyia Tarot</Text>

      <Pressable style={styles.btn} onPress={() => choose("en")}>
        <Text style={styles.btnText}>🇬🇧  english</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => choose("fr")}>
        <Text style={styles.btnText}>🇫🇷  français</Text>
      </Pressable>
      
      <Pressable style={styles.btn} onPress={() => choose("es")}>
        <Text style={styles.btnText}>🇪🇸  español</Text>
      </Pressable>
      
      <Pressable style={styles.btn} onPress={() => choose("pt")}>
        <Text style={styles.btnText}>🇵🇹  português</Text>
      </Pressable>
      
      <Pressable style={styles.btn} onPress={() => choose("de")}>
        <Text style={styles.btnText}>🇩🇪  deutsch</Text>
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
  title: {
    color: "#bbb",
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 20,
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