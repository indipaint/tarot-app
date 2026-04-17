import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
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
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [zoomValue] = useState(() => new Animated.Value(1));
  const [pinchValue] = useState(() => new Animated.Value(1));
  const [panX] = useState(() => new Animated.Value(0));
  const [panY] = useState(() => new Animated.Value(0));
  const [panEnabled, setPanEnabled] = useState(false);
  const lastZoomRef = React.useRef(1);
  const lastPanXRef = React.useRef(0);
  const lastPanYRef = React.useRef(0);

  const clampZoom = (value: number) => Math.max(0.9, Math.min(1.6, value));
  const scale = Animated.multiply(zoomValue, pinchValue);
  const onPinchGesture = Animated.event([{ nativeEvent: { scale: pinchValue } }], {
    useNativeDriver: true,
  });
  const onPanGesture = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY } }],
    { useNativeDriver: true }
  );
  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const next = clampZoom(lastZoomRef.current * Number(event.nativeEvent.scale || 1));
      lastZoomRef.current = next;
      zoomValue.setValue(next);
      pinchValue.setValue(1);
      setPanEnabled(next > 1.01);
      if (next <= 1) {
        lastPanXRef.current = 0;
        lastPanYRef.current = 0;
        panX.setOffset(0);
        panY.setOffset(0);
        panX.setValue(0);
        panY.setValue(0);
      }
    }
  };
  const onPanStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (lastZoomRef.current <= 1) {
        lastPanXRef.current = 0;
        lastPanYRef.current = 0;
      } else {
        lastPanXRef.current += Number(event.nativeEvent.translationX || 0);
        lastPanYRef.current += Number(event.nativeEvent.translationY || 0);
      }
      panX.setOffset(lastPanXRef.current);
      panY.setOffset(lastPanYRef.current);
      panX.setValue(0);
      panY.setValue(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem("journal_entries");
        setEntries(raw ? JSON.parse(raw) : []);
        setLoading(false);
      })();
    }, [])
  );

  const deleteEntry = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(updated));
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      i18n.t("buttons.confirm_delete"),
      i18n.t("buttons.confirm_delete"),
      [
        { text: i18n.t("buttons.cancel"), style: "cancel" },
        { text: i18n.t("buttons.delete"), style: "destructive", onPress: () => deleteEntry(id) },
      ]
    );
  };

  const saveEdit = async (id: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, note: editText } : e
    );
    setEntries(updated);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(updated));
    setEditingId(null);
    setEditText("");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.header}>✍️ {i18n.t("buttons.journal")}</Text>

        <PanGestureHandler
          enabled={panEnabled}
          minPointers={1}
          maxPointers={1}
          onGestureEvent={onPanGesture}
          onHandlerStateChange={onPanStateChange}
        >
          <Animated.View style={styles.zoomWrap}>
            <PinchGestureHandler
              minPointers={2}
              onGestureEvent={onPinchGesture}
              onHandlerStateChange={onPinchStateChange}
            >
              <Animated.View
                style={[
                  styles.zoomWrap,
                  { transform: [{ translateX: panX }, { translateY: panY }, { scale }] },
                ]}
              >
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: 80 + insets.bottom },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {loading ? (
                    <Text style={styles.empty}>{i18n.t("journal_screen.empty")}</Text>
                  ) : entries.length === 0 ? (
                    <Text style={styles.empty}>{i18n.t("journal_screen.empty")}</Text>
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

                        {editingId === entry.id ? (
                          <View style={styles.editWrap}>
                            <TextInput
                              style={styles.editInput}
                              value={editText}
                              onChangeText={setEditText}
                              multiline
                              autoFocus
                              textAlignVertical="top"
                            />
                            <View style={styles.editBtnRow}>
                              <Pressable
                                style={styles.cardBtn}
                                onPress={() => saveEdit(entry.id)}
                              >
                                <Text style={styles.cardBtnText}>💾 {i18n.t("buttons.save")}</Text>
                              </Pressable>
                              <Pressable
                                style={styles.cardBtn}
                                onPress={() => { setEditingId(null); setEditText(""); }}
                              >
                                <Text style={styles.cardBtnText}>✕ {i18n.t("buttons.cancel")}</Text>
                              </Pressable>
                            </View>
                          </View>
                        ) : (
                          <Text style={styles.cardNote}>{entry.note}</Text>
                        )}

                        <View style={styles.cardActions}>
                          <Pressable
                            style={styles.cardBtn}
                            onPress={() => router.push({ pathname: "/live-chat", params: { entryId: entry.id } } as any)}
                          >
                            <Text style={styles.cardBtnText}>💬 Live Chat</Text>
                          </Pressable>
                          <Pressable
                            style={styles.cardBtn}
                            onPress={() => router.push(`/card/${entry.cardId}` as any)}
                          >
                            <Text style={styles.cardBtnText}>🃏 {i18n.t("buttons.view_card")}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.cardBtn}
                            onPress={() => {
                              setEditingId(entry.id);
                              setEditText(entry.note);
                            }}
                          >
                            <Text style={styles.cardBtnText}>✏️ {i18n.t("buttons.edit")}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.cardBtn}
                            onPress={() => Share.share({
                              message: `🃏 ${entry.cardTitle}\n\n${entry.question}\n\n${entry.note}`,
                            })}
                          >
                            <Text style={styles.cardBtnText}>↗️ {i18n.t("buttons.share")}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.deleteBtn}
                            onPress={() => confirmDelete(entry.id)}
                          >
                            <Text style={styles.deleteBtnText}>🗑️ {i18n.t("buttons.delete")}</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(0, insets.bottom - 40) }]}>
          <Pressable style={styles.bottomBtn} onPress={() => router.back()}>
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
    color: "#fff", fontSize: 24, textAlign: "center",
    paddingVertical: 16, letterSpacing: 1,
  },
  scroll: { flex: 1 },
  zoomWrap: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  empty: { color: "#555", textAlign: "center", marginTop: 60, fontSize: 15 },
  card: {
    backgroundColor: "#1a1a1a", borderRadius: 12,
    padding: 16, gap: 6, borderWidth: 1, borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 4,
  },
  cardTitle: { color: "#aaa", fontSize: 16, fontWeight: "600", letterSpacing: 1 },
  cardDate: { color: "#777", fontSize: 13 },
  cardQuestion: { color: "#999", fontSize: 14, fontStyle: "italic", marginBottom: 4 },
  cardNote: { color: "#ddd", fontSize: 17, lineHeight: 24 },
  editWrap: { gap: 8 },
  editInput: {
    backgroundColor: "#222", color: "#fff", borderRadius: 8,
    padding: 10, fontSize: 14, borderWidth: 1, borderColor: "#444",
    minHeight: 80, textAlignVertical: "top",
  },
  editBtnRow: { flexDirection: "row", gap: 8 },
  cardActions: { flexDirection: "column", gap: 8, marginTop: 8 },
  cardBtn: {
    borderWidth: 1, borderColor: "#444", borderRadius: 6,
    paddingVertical: 8, paddingHorizontal: 12, alignSelf: "flex-start",
  },
  cardBtnText: { color: "#9a9a9a", fontSize: 14 },
  deleteBtn: {
    borderWidth: 1, borderColor: "#622", borderRadius: 6,
    paddingVertical: 8, paddingHorizontal: 12, alignSelf: "flex-start",
  },
  deleteBtnText: { color: "#b36b6b", fontSize: 14 },
  bottomBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: "#0a0a0a", paddingTop: 10, alignItems: "center",
  },
  bottomBtn: {
    borderWidth: 1, borderColor: "#333", borderRadius: 3,
    paddingVertical: 2, paddingHorizontal: 10, backgroundColor: "#1a1a1a",
  },
  bottomBtnText: { color: "#777", fontSize: 10, letterSpacing: 1 },
});