




import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ===== Kartenbilder (exakt wie bei dir) =====
const CARD_IMAGES: Record<number, any> = {
  0: require("../../assets/images/cards/00_der_narr.jpg"),
  1: require("../../assets/images/cards/01_der_magier.jpg"),
  2: require("../../assets/images/cards/02_die_hohepriesterin.jpg"),
  3: require("../../assets/images/cards/03_die_herrscherin.jpg"),
  4: require("../../assets/images/cards/04_der_kaiser.jpg"),
  5: require("../../assets/images/cards/05_der_hohepriester.jpg"),
  6: require("../../assets/images/cards/06_die_liebenden.jpg"),
  7: require("../../assets/images/cards/07_der_wagen.jpg"),
  8: require("../../assets/images/cards/08_die_kraft.jpg"),
  9: require("../../assets/images/cards/09_der_eremit.jpg"),
  10: require("../../assets/images/cards/10_das_rad_des_schicksals.jpg"),
  11: require("../../assets/images/cards/11_die_gerechtigkeit.jpg"),
  12: require("../../assets/images/cards/12_der_gehaengte.jpg"),
  13: require("../../assets/images/cards/13_der_tod.jpg"),
  14: require("../../assets/images/cards/14_die_maessigkeit.jpg"),
  15: require("../../assets/images/cards/15_der_teufel.jpg"),
  16: require("../../assets/images/cards/16_der_turm.jpg"),
  17: require("../../assets/images/cards/17_der_stern.jpg"),
  18: require("../../assets/images/cards/18_der_mond.jpg"),
  19: require("../../assets/images/cards/19_die_sonne.jpg"),
  20: require("../../assets/images/cards/20_das_gericht.jpg"),
  21: require("../../assets/images/cards/21_die_welt.jpg"),
};

const CARD_META: Record<number, { name: string; roman: string }> = {
  0: { name: "Der Narr", roman: "0" },
  1: { name: "Der Magier", roman: "I" },
  2: { name: "Die Hohepriesterin", roman: "II" },
  3: { name: "Die Kaiserin", roman: "III" },
  4: { name: "Der Kaiser", roman: "IV" },
  5: { name: "Der Hohepriester", roman: "V" },
  6: { name: "Die Liebenden", roman: "VI" },
  7: { name: "Der Wagen", roman: "VII" },
  8: { name: "Die Kraft", roman: "VIII" },
  9: { name: "Der Eremit", roman: "IX" },
  10: { name: "Das Rad Des Schicksals", roman: "X" },
  11: { name: "Die Gerechtigkeit", roman: "XI" },
  12: { name: "Der Gehängte", roman: "XII" },
  13: { name: "Der Tod", roman: "XIII" },
  14: { name: "Die Mäßigkeit", roman: "XIV" },
  15: { name: "Der Teufel", roman: "XV" },
  16: { name: "Der Turm", roman: "XVI" },
  17: { name: "Der Stern", roman: "XVII" },
  18: { name: "Der Mond", roman: "XVIII" },
  19: { name: "Die Sonne", roman: "XIX" },
  20: { name: "Das Gericht", roman: "XX" },
  21: { name: "Die Welt", roman: "XXI" },
};

const CARD_COUNT = 22;

// ===== Platzhalter für Deutung (morgen ersetzen wir das sauber) =====
const CARD_MEANING: Record<number, string> = {
  0: "Platzhalter – Deutung folgt.",
};

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Index() {
  const [cardNr, setCardNr] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const imageSource = useMemo(() => CARD_IMAGES[cardNr], [cardNr]);
  const meta = useMemo(() => CARD_META[cardNr], [cardNr]);

  const next = () => setCardNr((n) => (n + 1) % CARD_COUNT);
  const prev = () => setCardNr((n) => (n - 1 + CARD_COUNT) % CARD_COUNT);
  const draw = () => setCardNr(randInt(CARD_COUNT));

  const topOffset =
    (Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0) + 2;

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {showMeaning ? (
        // ===== DEUTUNGSSEITE =====
        <View style={[styles.meaningWrap, { paddingTop: topOffset }]}>
          <Pressable style={styles.backBtn} onPress={() => setShowMeaning(false)}>
            <Text style={styles.backText}>← Zurück</Text>
          </Pressable>

          <Text style={styles.meaningTitle}>
            {meta.roman} · {meta.name}
          </Text>

          <Text style={styles.meaningText}>
            {CARD_MEANING[cardNr] ?? "Deutung folgt."}
          </Text>
        </View>
      ) : (
        // ===== KARTENANSICHT =====
        <>
          <View style={[styles.imageArea, { paddingTop: topOffset }]}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.cardLabel}>
            {meta.roman} · {meta.name}
          </Text>

          <View style={styles.controls}>
            <Pressable style={styles.btn} onPress={prev}>
              <Text style={styles.btnText}>◀︎</Text>
            </Pressable>

            <Pressable style={styles.btn} onPress={draw}>
              <Text style={styles.btnText}>Neue</Text>
            </Pressable>

            <Pressable style={styles.btn} onPress={next}>
              <Text style={styles.btnText}>▶︎</Text>
            </Pressable>

            {/* ===== NEU: Deutungs-Button ===== */}
            <Pressable style={[styles.btn, styles.btnWide]} onPress={() => setShowMeaning(true)}>
              <Text style={styles.btnText}>Deutung</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },

  imageArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  image: { width: "100%", height: "100%" },

  cardLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    letterSpacing: 0.4,
    textAlign: "center",
    marginBottom: 6,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#0b0b0f",
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 4,
  },

  btnWide: { minWidth: 90 },

  btnText: { color: "white", fontSize: 13, fontWeight: "700" },

  // ===== Deutungsseite =====
  meaningWrap: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#0b0b0f",
  },

  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
  },

  backText: { color: "white", fontSize: 13, fontWeight: "700" },

  meaningTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  meaningText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
});

