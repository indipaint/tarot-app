import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../src/i18n";

type JournalEntry = {
  id: string;
  date: string;
  time: string;
  cardId: string;
  cardTitle: string;
  lang: string;
  question: string;
  note: string;
};

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem("journal_entries");
        setEntries(raw ? JSON.parse(raw) : []);
      })();
    }, [])
  );

  const deleteEntry = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.header}>✍️ {i18n.t("buttons.journal")}</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 80 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {entries.length === 0 ? (
            <Text style={styles.empty}>Noch keine Einträge.</Text>
          ) : (
            entries.map((entry) => (
              <View key={entry.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{entry.cardTitle}</Text>
                  <Text style={styles.cardDate}>{entry.date} · {entry.time}</Text>
                </View>
                {entry.question ? (
                  <Text style={styles.cardQuestion}>{entry.question}</Text>
                ) : null}
                <Text style={styles.cardNote}>{entry.note}</Text>
                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.cardBtn}
                    onPress={() => router.push(`/card/${entry.cardId}` as any)}
                  >
                    <Text style={styles.cardBtnText}>🃏 Karte ansehen</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => deleteEntry(entry.id)}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(0, insets.bottom - 40) }]}>
          <Pressable
            style={styles.bottomBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.bottomBtnText}>{i18n.t("buttons.back")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 16,
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  empty: {
    color: "#555",
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardDate: {
    color: "#555",
    fontSize: 11,
  },
  cardQuestion: {
    color: "#888",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  cardNote: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardBtn: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  cardBtnText: {
    color: "#777",
    fontSize: 11,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    color: "#555",
    fontSize: 12,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0a0a0a",
    paddingTop: 10,
    alignItems: "center",
  },
  bottomBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#1a1a1a",
  },
  bottomBtnText: { color: "#777", fontSize: 10, letterSpacing: 1 },
});