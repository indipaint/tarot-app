import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../src/i18n";

type JournalEntry = {
  id: string;
  cardTitle: string;
  question: string;
  note: string;
  lang: string;
};

type CoachMessage = {
  role: "user" | "assistant";
  text: string;
};

const API_URL = process.env.EXPO_PUBLIC_COACH_API_URL || "";
const chatHistoryKeyForEntry = (entryId: string) => `live_chat_history_${entryId}`;

export default function LiveChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entryId?: string }>();
  const entryId = String(params.entryId || "");
  const listRef = React.useRef<ScrollView | null>(null);

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("journal_entries");
        const parsed: JournalEntry[] = raw ? JSON.parse(raw) : [];
        const found = parsed.find((x) => x.id === entryId) || null;
        setEntry(found);
      } finally {
        setLoading(false);
      }
    })();
  }, [entryId]);

  useEffect(() => {
    if (!entryId) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(chatHistoryKeyForEntry(entryId));
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return;
        const normalized: CoachMessage[] = parsed
          .map((m: any) => ({
            role: (m?.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
            text: String(m?.text || "").trim(),
          }))
          .filter((m) => !!m.text)
          .slice(-50);
        setMessages(normalized);
      } catch {
        // ignore invalid persisted history
      }
    })();
  }, [entryId]);

  useEffect(() => {
    if (!entryId) return;
    AsyncStorage.setItem(chatHistoryKeyForEntry(entryId), JSON.stringify(messages)).catch(() => {});
  }, [entryId, messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    };
    const showSub = Keyboard.addListener("keyboardDidShow", scrollToBottom);
    return () => {
      showSub.remove();
    };
  }, []);

  const send = async () => {
    const userText = text.trim();
    if (!userText || sending) return;
    if (!entry) {
      Alert.alert("Info", "Kein Tagebuch-Eintrag gefunden.");
      return;
    }
    if (!API_URL) {
      Alert.alert(
        "Live Chat nicht konfiguriert",
        "Setze EXPO_PUBLIC_COACH_API_URL auf deinen sicheren Backend-Endpoint."
      );
      return;
    }

    const nextHistory: CoachMessage[] = [...messages, { role: "user", text: userText }];
    setMessages(nextHistory);
    setText("");
    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: i18n.locale,
          entry: {
            id: entry.id,
            cardTitle: entry.cardTitle,
            question: entry.question,
            note: entry.note,
          },
          history: nextHistory.slice(-12),
          message: userText,
        }),
      });
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = await res.json();
      const reply = String(data?.reply || "").trim();
      if (!reply) throw new Error("empty_reply");
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      Alert.alert("Fehler", "Coach-Antwort konnte nicht geladen werden.");
    } finally {
      setSending(false);
    }
  };
  const showSendButton = sending || text.trim().length > 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <Text style={styles.title}>Live Chat</Text>
          <Text style={styles.info}>Eintrag wurde nicht gefunden.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        <View style={styles.header}>
          <Pressable style={styles.backInline} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
          <Text style={styles.title}>Live Chat</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        <ScrollView
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.length === 0 ? (
            <Text style={styles.empty}>Starte den Chat mit einer Frage zu deinem Eintrag.</Text>
          ) : (
            messages.map((m, idx) => (
              <View key={`${m.role}-${idx}`} style={[styles.bubble, m.role === "user" ? styles.userBubble : styles.aiBubble]}>
                <Text selectable style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { height: inputHeight }]}
            value={text}
            onChangeText={setText}
            placeholder="Nachricht an den Coach..."
            placeholderTextColor="#888"
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType={Platform.OS === "android" ? "visible-password" : "default"}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={send}
            onContentSizeChange={(event) => {
              const next = Math.max(40, Math.min(340, Math.ceil(event.nativeEvent.contentSize.height) + 10));
              setInputHeight(next);
            }}
          />
          {showSendButton ? (
            <Pressable
              style={[styles.sendBtn, sending ? styles.sendBtnDisabled : null]}
              onPress={send}
              disabled={sending}
              accessibilityLabel="Send"
            >
              {sending ? (
                <Text style={styles.sendText}>...</Text>
              ) : (
                <MaterialCommunityIcons name="send" size={18} color="#fff" />
              )}
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#232323",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: { color: "#ddd", fontSize: 14 },
  info: { color: "#999", fontSize: 12, textAlign: "center" },
  backBtn: { borderWidth: 1, borderColor: "#444", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  backBtnText: { color: "#aaa", fontSize: 11 },
  backInline: { paddingVertical: 4, paddingRight: 10 },
  rightPlaceholder: { width: 42 },
  list: { flex: 1 },
  listContent: { padding: 12, gap: 8 },
  empty: { color: "#666", fontSize: 12, textAlign: "center", marginTop: 24 },
  bubble: { borderWidth: 1, borderRadius: 10, padding: 10, maxWidth: "88%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#17305c", borderColor: "#3e5c94" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#141414", borderColor: "#353535" },
  bubbleText: { color: "#e0e0e0", fontSize: 13, lineHeight: 19 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    padding: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    lineHeight: 16,
    textAlignVertical: "center",
    minHeight: 40,
    maxHeight: 340,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#486fb7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b3b72",
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendText: { color: "#fff", fontSize: 12 },
});
