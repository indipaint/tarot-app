import { db } from "../src/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
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

export default function CommunityScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameSet, setNicknameSet] = useState(false);
  const [uid] = useState<string>(Math.random().toString(36).slice(2));
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!nicknameSet) return;
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap: any) => {
      setMessages(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsub;
  }, [nicknameSet]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: text.trim(),
      nickname,
      uid,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  if (!nicknameSet) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.nickTitle}>{i18n.t("community.title")}</Text>
          <Text style={styles.nickSubtitle}>{i18n.t("community.subtitle")}</Text>
          <TextInput
            style={styles.nickInput}
            placeholder={i18n.t("community.placeholder")}
            placeholderTextColor="#aaa"
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
          />
          <Pressable
            style={styles.nickBtn}
            onPress={() => {
              if (nickname.trim().length > 1) setNicknameSet(true);
            }}
          >
            <Text style={styles.nickBtnText}>{i18n.t("community.btn")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>🌍 {nickname}</Text>
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={{ padding: 16, gap: 10 }}
        >
          {messages.map((msg: any) => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.uid === uid ? styles.bubbleOwn : styles.bubbleOther,
              ]}
            >
              <Text style={styles.bubbleNick}>{msg.nickname}</Text>
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={i18n.t("community.message_placeholder")}
            placeholderTextColor="#888"
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendBtnText}>↗</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nickSafe: {
    flex: 1,
    backgroundColor: "#0a182e",
  },
  nickContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  nickTitle: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 2,
  },
  nickSubtitle: {
    color: "#fcfbfb",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  nickInput: {
    width: "85%",
    backgroundColor: "#0435f8",
    color: "#fff",
    borderRadius: 12,
    padding: 8,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#f2f98c",
  },
  nickBtn: {
    backgroundColor: "#0a35f8",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderColor: "#f6ee02",
    marginTop: 10,
  },
  nickBtnText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 1,
  },
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  flex: { flex: 1 },
  header: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 12,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#1b1b1b",
  },
  messages: { flex: 1 },
  bubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  bubbleOwn: {
    alignSelf: "flex-end",
    backgroundColor: "#1e1e2e",
    borderWidth: 1,
    borderColor: "#444",
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  bubbleNick: {
    color: "#666",
    fontSize: 10,
    letterSpacing: 1,
  },
  bubbleText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#444",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#0a35f8",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#f6ee02",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  sendBtnText: {
    color: "#fff",
    fontSize: 18,
  },
});