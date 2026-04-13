import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
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
import { db } from "../src/firebase";
import i18n from "../src/i18n";

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

export default function CommunityScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameSet, setNicknameSet] = useState(false);
  const [uid, setUid] = useState<string>("");
  const scrollRef = useRef<ScrollView>(null);

  const cards = useMemo(() => getCards(), []);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("community_uid");
      if (stored) {
        setUid(stored);
      } else {
        const newUid = Math.random().toString(36).slice(2);
        await AsyncStorage.setItem("community_uid", newUid);
        setUid(newUid);
      }
    })();
  }, []);

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
    if (!text.trim() || !uid) return;

    await addDoc(collection(db, "messages"), {
      text: text.trim(),
      nickname: nickname.trim(),
      uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  const deleteMessage = (msgId: string) => {
    Alert.alert("Löschen?", "Nachricht wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: () => deleteDoc(doc(db, "messages", msgId)),
      },
    ]);
  };

  const getCardImage = (cardId: string) => {
    const card = cards.find((c: any) => String(c?.id) === String(cardId));
    return card?.image ?? null;
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
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg: any) => {
            const isOwn = msg.uid === uid;
            const canDelete =
              msg.uid === uid || msg.uid === "shared" || msg.uid === "journal_share";

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isOwn ? styles.messageRowOwn : styles.messageRowOther,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isOwn ? styles.bubbleOwn : styles.bubbleOther,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleNick,
                      isOwn ? styles.bubbleNickOwn : styles.bubbleNickOther,
                    ]}
                  >
                    {msg.nickname}
                  </Text>

                  {msg.isCardShare && msg.cardId ? (
                    <View style={styles.cardShare}>
                      {getCardImage(msg.cardId) ? (
                        <Image
                          source={getCardImage(msg.cardId)}
                          style={styles.cardImage}
                          resizeMode="contain"
                        />
                      ) : null}
                      <Text style={styles.bubbleText}>{msg.text}</Text>
                    </View>
                  ) : (
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  )}

                  {canDelete ? (
                    <Pressable
                      style={[
                        styles.deleteBtn,
                        isOwn ? styles.deleteBtnOwn : styles.deleteBtnOther,
                      ]}
                      onPress={() => deleteMessage(msg.id)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️ Löschen</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })}
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
            <Text style={styles.sendBtnText}>➜</Text>
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
  safe: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  flex: {
    flex: 1,
  },
  header: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 12,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#1b1b1b",
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 10,
    width: "100%",
  },
  messageRow: {
    width: "100%",
    flexDirection: "row",
  },
  messageRowOwn: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  bubbleOwn: {
    backgroundColor: "#41568a",
    borderWidth: 1,
    borderColor: "#444",
  },
  bubbleOther: {
    backgroundColor: "#0c204a",
    borderWidth: 1,
    borderColor: "#8a8888",
  },
  bubbleNick: {
    fontSize: 10,
    letterSpacing: 1,
  },
  bubbleNickOwn: {
    color: "#cfd7ff",
    textAlign: "right",
  },
  bubbleNickOther: {
    color: "#aeb8d8",
    textAlign: "left",
  },
  bubbleText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
  cardShare: {
    gap: 8,
  },
  cardImage: {
    width: 120,
    height: 200,
    borderRadius: 8,
  },
  deleteBtn: {
    marginTop: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  deleteBtnOwn: {
    borderColor: "#622",
    alignSelf: "flex-end",
  },
  deleteBtnOther: {
    borderColor: "#622",
    alignSelf: "flex-start",
  },
  deleteBtnText: {
    color: "#944",
    fontSize: 11,
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
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#adacac",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#174ead",
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f6ee02",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
  },
  sendBtnText: {
    color: "#fefcfc",
    fontSize: 15,
    marginTop: -7,
  },
});