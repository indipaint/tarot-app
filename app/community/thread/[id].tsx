import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { db } from "../../../src/firebase";

type ThreadMessage = {
  id: string;
  text?: string;
  senderUid?: string;
  senderName?: string;
};

export default function PrivateThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const threadId = String(params.id || "");

  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [peerUid, setPeerUid] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    (async () => {
      const accepted = await AsyncStorage.getItem("community_privacy_accepted");
      if (accepted !== "1") {
        router.replace("/community" as any);
        return;
      }
      const storedUid = (await AsyncStorage.getItem("community_uid")) || "";
      const storedNickname = (await AsyncStorage.getItem("community_nickname")) || "User";
      setUid(storedUid);
      setNickname(storedNickname);
    })();
  }, []);

  useEffect(() => {
    if (!threadId || !uid) return;
    (async () => {
      const threadSnap = await getDoc(doc(db, "threads", threadId));
      const data = threadSnap.data() as { userA?: string; userB?: string } | undefined;
      const canAccess = !!data && (data.userA === uid || data.userB === uid);
      setAllowed(canAccess);
      if (canAccess && data) {
        const other = data.userA === uid ? data.userB || "" : data.userA || "";
        setPeerUid(other);
        const blockedRaw = await AsyncStorage.getItem("blocked_uids");
        const blockedList: string[] = blockedRaw ? JSON.parse(blockedRaw) : [];
        setBlocked(!!other && blockedList.includes(other));
      }
    })();
  }, [threadId, uid]);

  useEffect(() => {
    if (!threadId || !allowed) return;
    const q = query(
      collection(db, "threads", threadId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ThreadMessage, "id">),
        }))
      );
    });
    return unsub;
  }, [threadId, allowed]);

  const send = async () => {
    if (!text.trim() || !threadId || !uid || !allowed || blocked) return;
    await addDoc(collection(db, "threads", threadId, "messages"), {
      text: text.trim(),
      senderUid: uid,
      senderName: nickname,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const blockUser = async () => {
    if (!peerUid) return;
    const blockedRaw = await AsyncStorage.getItem("blocked_uids");
    const blockedList: string[] = blockedRaw ? JSON.parse(blockedRaw) : [];
    if (!blockedList.includes(peerUid)) {
      blockedList.push(peerUid);
      await AsyncStorage.setItem("blocked_uids", JSON.stringify(blockedList));
    }
    setBlocked(true);
    setMenuOpen(false);
  };

  const unblockUser = async () => {
    if (!peerUid) return;
    const blockedRaw = await AsyncStorage.getItem("blocked_uids");
    const blockedList: string[] = blockedRaw ? JSON.parse(blockedRaw) : [];
    const nextList = blockedList.filter((x) => x !== peerUid);
    await AsyncStorage.setItem("blocked_uids", JSON.stringify(nextList));
    setBlocked(false);
    setMenuOpen(false);
  };

  const reportUser = async () => {
    if (!peerUid || !uid || !threadId) return;
    await addDoc(collection(db, "reports"), {
      type: "private_thread_user_report",
      reporterUid: uid,
      reportedUid: peerUid,
      threadId,
      createdAt: serverTimestamp(),
    });
    setMenuOpen(false);
    Alert.alert("Danke", "Meldung wurde gespeichert.");
  };

  const deleteOwnMessage = (messageId: string) => {
    Alert.alert("Nachricht löschen?", "Diese Nachricht wird komplett entfernt.", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "threads", threadId, "messages", messageId));
        },
      },
    ]);
  };

  if (!allowed) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.center}>
          <Text style={styles.title}>Privater Bereich</Text>
          <Text style={styles.info}>Du hast auf diesen Thread keinen Zugriff.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Zurück</Text>
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
        <View style={styles.header}>
          <Pressable style={styles.backBtnInline} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Zurück</Text>
          </Pressable>
          <Text style={styles.title}>Privater Chat</Text>
          <Pressable style={styles.menuBtn} onPress={() => setMenuOpen((prev) => !prev)}>
            <Text style={styles.menuBtnText}>⋮</Text>
          </Pressable>
        </View>
        {menuOpen ? (
          <View style={styles.menuPanel}>
            <Pressable style={styles.menuItem} onPress={reportUser}>
              <Text style={styles.menuItemText}>Melden</Text>
            </Pressable>
            {blocked ? (
              <Pressable style={styles.menuItemLast} onPress={unblockUser}>
                <Text style={styles.menuItemText}>Blockierung aufheben</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.menuItemLast} onPress={blockUser}>
                <Text style={styles.menuItemText}>Blockieren</Text>
              </Pressable>
            )}
          </View>
        ) : null}

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {messages.map((msg) => {
            const isOwn = msg.senderUid === uid;
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isOwn ? styles.msgRowOwn : styles.msgRowOther]}
              >
                <View style={[styles.msgBubble, isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther]}>
                  <Text style={styles.msgName}>{msg.senderName || "User"}</Text>
                  <Text style={styles.msgText}>{msg.text || ""}</Text>
                  {isOwn ? (
                    <Pressable onPress={() => deleteOwnMessage(msg.id)} style={styles.deleteOwnBtn}>
                      <Text style={styles.deleteOwnBtnText}>Löschen</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {blocked ? (
          <View style={styles.blockInfoWrap}>
            <Text style={styles.blockInfoText}>
              Du hast diesen Nutzer blockiert. Senden ist deaktiviert.
            </Text>
            <Pressable style={styles.unblockBtn} onPress={unblockUser}>
              <Text style={styles.unblockBtnText}>Blockierung aufheben</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Privat antworten..."
              placeholderTextColor="#888"
              multiline
            />
            <Pressable style={styles.sendBtn} onPress={send}>
              <Text style={styles.sendBtnText}>➜</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: { color: "#fff", fontSize: 14, letterSpacing: 1 },
  menuBtn: { width: 40, alignItems: "center", paddingVertical: 2 },
  menuBtnText: { color: "#aaa", fontSize: 20, lineHeight: 20 },
  menuPanel: {
    alignSelf: "flex-end",
    marginTop: 6,
    marginRight: 12,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" },
  menuItemLast: { paddingVertical: 10, paddingHorizontal: 14 },
  menuItemText: { color: "#ddd", fontSize: 12 },
  info: { color: "#aaa", fontSize: 12 },
  backBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backBtnInline: { paddingVertical: 4, paddingRight: 12 },
  backBtnText: { color: "#aaa", fontSize: 11 },
  list: { flex: 1 },
  listContent: { padding: 12, gap: 8 },
  msgRow: { width: "100%", flexDirection: "row" },
  msgRowOwn: { justifyContent: "flex-end" },
  msgRowOther: { justifyContent: "flex-start" },
  msgBubble: { width: "82%", borderRadius: 10, borderWidth: 1, padding: 10, gap: 4 },
  msgBubbleOwn: { backgroundColor: "#152136", borderColor: "#3b4b66" },
  msgBubbleOther: { backgroundColor: "#111", borderColor: "#303030" },
  msgName: { color: "#9eadcf", fontSize: 10 },
  msgText: { color: "#ddd", fontSize: 13, lineHeight: 18 },
  deleteOwnBtn: { marginTop: 6, alignSelf: "flex-end" },
  deleteOwnBtnText: { color: "#c58b8b", fontSize: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    padding: 10,
    maxHeight: 120,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f6ee02",
    backgroundColor: "#174ead",
  },
  sendBtnText: { color: "#fff", fontSize: 14, marginTop: -5 },
  blockInfoWrap: {
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    padding: 12,
    gap: 8,
  },
  blockInfoText: { color: "#b0b0b0", fontSize: 12 },
  unblockBtn: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  unblockBtnText: { color: "#ddd", fontSize: 12 },
});
