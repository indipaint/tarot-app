import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { ensureCommunityAuth } from "../../../src/ensureCommunityAuth";
import { db } from "../../../src/firebase";
import { purgeCommunityThread } from "../../../src/purgeCommunityThread";
import i18n, { getLocale, subscribeLocale } from "../../../src/i18n";
import { sendPushToUser } from "../../../src/pushNotifications";

type ThreadMessage = {
  id: string;
  text?: string;
  senderUid?: string;
  senderName?: string;
};

const SUPPORTED_LANGS = new Set(["de", "en", "fr", "es", "pt"]);
const normalizeLang = (value?: string) => {
  const candidate = String(value || "").toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.has(candidate) ? candidate : "de";
};
const LANGUAGE_FOR_PROVIDER: Record<string, string> = {
  de: "de",
  en: "en",
  fr: "fr",
  es: "es",
  pt: "pt",
};

export default function PrivateThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const threadId = String(params.id || "");
  const localeCode = normalizeLang(getLocale() || i18n.locale);
  const privacyConsentKey = `community_privacy_accepted_v2_${localeCode}`;
  const communityAcceptedTermsKey = "community_accepted_terms";

  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [peerUid, setPeerUid] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [translatedByMsgId, setTranslatedByMsgId] = useState<Record<string, string>>({});
  const [showOriginalByMsgId, setShowOriginalByMsgId] = useState<Record<string, boolean>>({});
  const [isTranslatingByMsgId, setIsTranslatingByMsgId] = useState<Record<string, boolean>>({});
  const [preferredLang, setPreferredLang] = useState(() => normalizeLang(getLocale()));
  const listRef = useRef<ScrollView | null>(null);
  const didInitialScrollRef = useRef(false);
  const wasAtBottomRef = useRef(true);
  const visibleCountRef = useRef(0);

  const clearUnreadCount = async () => {
    if (!uid) return;
    try {
      await updateDoc(doc(db, "community_users", uid), {
        unreadCount: 0,
        updatedAt: serverTimestamp(),
      });
    } catch {
      await setDoc(
        doc(db, "community_users", uid),
        { uid, unreadCount: 0, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch(() => {});
    }
  };

  const visibleMessages = useMemo(() => {
    if (!blocked || !peerUid) return messages;
    return messages.filter((m) => m.senderUid !== peerUid);
  }, [blocked, peerUid, messages]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("app_lang");
      if (saved) setPreferredLang(normalizeLang(saved));
    })();
    const unsubscribe = subscribeLocale((lang) => {
      setPreferredLang(normalizeLang(lang));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      const [acceptedV2, acceptedLegacy, termsAccepted] = await Promise.all([
        AsyncStorage.getItem(privacyConsentKey),
        AsyncStorage.getItem("community_privacy_accepted"),
        AsyncStorage.getItem(communityAcceptedTermsKey),
      ]);
      const accepted = acceptedV2 === "1" || acceptedLegacy === "1" || termsAccepted === "1";
      if (!accepted) {
        router.replace("/community" as any);
        return;
      }
      if (accepted && termsAccepted !== "1") {
        AsyncStorage.setItem(communityAcceptedTermsKey, "1").catch(() => {});
      }
      const storedUid = await ensureCommunityAuth();
      const storedNickname =
        (await AsyncStorage.getItem("community_nickname")) || i18n.t("thread.fallback_user");
      setUid(storedUid);
      setNickname(storedNickname);
    })();
  }, [privacyConsentKey]);

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
        let localList: string[] = [];
        try {
          const blockedRaw = await AsyncStorage.getItem("blocked_uids");
          localList = blockedRaw ? JSON.parse(blockedRaw) : [];
          if (!Array.isArray(localList)) localList = [];
        } catch {
          localList = [];
        }
        let remoteList: string[] = [];
        let profileReadOk = false;
        try {
          const meSnap = await getDoc(doc(db, "community_users", uid));
          profileReadOk = true;
          const raw = meSnap.data()?.blockedUids;
          if (Array.isArray(raw)) {
            remoteList = raw.filter((x: unknown) => typeof x === "string") as string[];
          }
          if (
            other &&
            localList.includes(other) &&
            !remoteList.includes(other)
          ) {
            try {
              await setDoc(
                doc(db, "community_users", uid),
                { uid, blockedUids: arrayUnion(other), updatedAt: serverTimestamp() },
                { merge: true }
              );
              remoteList = [...remoteList, other];
            } catch {
              // Write denied: UI still uses local block; sender check needs cloud list.
            }
          }
        } catch {
          // Firestore rules may omit read; local list still applies.
        }
        if (!profileReadOk) {
          remoteList = [];
        }
        const merged = new Set([...localList, ...remoteList]);
        setBlocked(!!other && merged.has(other));
      }
    })();
  }, [threadId, uid]);

  useEffect(() => {
    // Beim Öffnen eines Threads einmal unten starten (neueste Nachricht sichtbar).
    didInitialScrollRef.current = false;
    wasAtBottomRef.current = true;
    visibleCountRef.current = 0;
  }, [threadId]);

  useEffect(() => {
    if (!threadId || !allowed) return;
    const markSeenFromThread = async (fallbackMs: number) => {
      try {
        const threadSnap = await getDoc(doc(db, "threads", threadId));
        const threadLastMs = Number((threadSnap.data() as any)?.lastMessageAt?.toMillis?.() || 0);
        const seenMs = threadLastMs || fallbackMs || Date.now();
        await AsyncStorage.setItem(`thread_last_seen_${threadId}`, String(seenMs));
      } catch {
        AsyncStorage.setItem(`thread_last_seen_${threadId}`, String(fallbackMs || Date.now())).catch(
          () => {}
        );
      }
    };

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
      const last = snap.docs[snap.docs.length - 1];
      const fallbackMs = Number((last?.data() as any)?.createdAt?.toMillis?.() || Date.now());
      markSeenFromThread(fallbackMs).catch(() => {});
      clearUnreadCount().catch(() => {});
    });
    return unsub;
  }, [threadId, allowed, uid]);

  // Nur lesen, wenn Thread-ID gültig und Zugriff bestätigt — sonst unreadCount fälschlich auf 0 (z. B. kurz threadId leer).
  useEffect(() => {
    if (!uid || !threadId || !allowed) return;
    clearUnreadCount().catch(() => {});
  }, [uid, threadId, allowed]);

  const translateMessage = async (msg: ThreadMessage) => {
    if (!msg.id || !msg.text || !msg.text.trim()) return;
    if (translatedByMsgId[msg.id]) {
      setShowOriginalByMsgId((prev) => ({ ...prev, [msg.id]: false }));
      return;
    }

    const targetLang = normalizeLang(preferredLang || getLocale() || i18n.locale);
    const providerTarget = LANGUAGE_FOR_PROVIDER[targetLang] || "de";
    setIsTranslatingByMsgId((prev) => ({ ...prev, [msg.id]: true }));
    try {
      let translated = "";
      try {
        const res = await fetch("https://libretranslate.de/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: msg.text,
            source: "auto",
            target: providerTarget,
            format: "text",
          }),
        });
        const data = await res.json();
        translated = String(data?.translatedText || "").trim();
      } catch {
        // fallback handled below
      }

      if (!translated) {
        const fallbackUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
          providerTarget
        )}&dt=t&q=${encodeURIComponent(msg.text)}`;
        const fallbackRes = await fetch(fallbackUrl);
        const fallbackData = await fallbackRes.json();
        const chunks = Array.isArray(fallbackData?.[0]) ? fallbackData[0] : [];
        translated = chunks
          .map((chunk: any) => String(chunk?.[0] || ""))
          .join("")
          .trim();
      }

      if (translated) {
        setTranslatedByMsgId((prev) => ({ ...prev, [msg.id]: translated }));
        setShowOriginalByMsgId((prev) => ({ ...prev, [msg.id]: false }));
      } else {
        throw new Error("translation_empty");
      }
    } catch {
      Alert.alert(i18n.t("thread.translate_error_title"), i18n.t("thread.translate_error"));
    } finally {
      setIsTranslatingByMsgId((prev) => ({ ...prev, [msg.id]: false }));
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    if (!threadId) {
      Alert.alert("Error", "Thread id is missing.");
      return;
    }
    if (!uid) {
      Alert.alert("Error", "Not signed in yet. Please wait a moment.");
      return;
    }
    if (!allowed) {
      Alert.alert("Error", "No access to this thread.");
      return;
    }
    if (blocked) {
      Alert.alert("Info", i18n.t("thread.blocked_info"));
      return;
    }
    let suppressDeliveryToPeer = false;
    if (peerUid) {
      try {
        const peerSnap = await getDoc(doc(db, "community_users", peerUid));
        const peerBlocks = peerSnap.data()?.blockedUids;
        suppressDeliveryToPeer = Array.isArray(peerBlocks) && peerBlocks.includes(uid);
      } catch {
        suppressDeliveryToPeer = false;
      }
    }
    const messageText = text.trim();
    try {
      await addDoc(collection(db, "threads", threadId, "messages"), {
        text: messageText,
        senderUid: uid,
        senderName: nickname,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "threads", threadId), {
        lastMessageAt: serverTimestamp(),
        lastMessageSenderUid: uid,
      }).catch(() => {});
      setText("");
      // Wenn der Empfänger uns blockiert hat: Nachricht bleibt in Firebase (Absender sieht sie normal),
      // aber kein Push und kein unreadCount — Empfänger-UI blendet sie ohnehin aus.
      if (peerUid && !suppressDeliveryToPeer) {
        void setDoc(
          doc(db, "community_users", peerUid),
          { uid: peerUid, unreadCount: increment(1), updatedAt: serverTimestamp() },
          { merge: true }
        ).catch(() => {});
        void sendPushToUser(peerUid, {
          title: nickname || "New message",
          body: messageText,
          data: { threadId, kind: "community_thread" },
          badge: 1,
        }).catch(() => {});
      }
    } catch (error: any) {
      const message =
        typeof error?.message === "string" && error.message.trim()
          ? error.message
          : "Message could not be sent.";
      Alert.alert("Error", message);
    }
  };

  const blockUser = async () => {
    if (!peerUid || !uid) return;
    const blockedRaw = await AsyncStorage.getItem("blocked_uids");
    const blockedList: string[] = blockedRaw ? JSON.parse(blockedRaw) : [];
    if (!blockedList.includes(peerUid)) {
      blockedList.push(peerUid);
      await AsyncStorage.setItem("blocked_uids", JSON.stringify(blockedList));
    }
    try {
      await setDoc(
        doc(db, "community_users", uid),
        { uid, blockedUids: arrayUnion(peerUid), updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (e: any) {
      const code = String(e?.code || "");
      if (code.includes("permission")) {
        Alert.alert(
          i18n.t("thread.block_sync_warning_title"),
          i18n.t("thread.block_sync_warning_body")
        );
      }
    }
    setBlocked(true);
    setMenuOpen(false);
  };

  const unblockUser = async () => {
    if (!peerUid || !uid) return;
    const blockedRaw = await AsyncStorage.getItem("blocked_uids");
    const blockedList: string[] = blockedRaw ? JSON.parse(blockedRaw) : [];
    const nextList = blockedList.filter((x) => x !== peerUid);
    await AsyncStorage.setItem("blocked_uids", JSON.stringify(nextList));
    try {
      await setDoc(
        doc(db, "community_users", uid),
        { uid, blockedUids: arrayRemove(peerUid), updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch {
      // Local unblock still applies for this device.
    }
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
    Alert.alert(i18n.t("thread.report_success_title"), i18n.t("thread.report_success_body"));
  };

  const deleteOwnMessage = (messageId: string) => {
    Alert.alert(i18n.t("thread.delete_title"), i18n.t("thread.delete_body"), [
      { text: i18n.t("buttons.cancel"), style: "cancel" },
      {
        text: i18n.t("buttons.delete"),
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "threads", threadId, "messages", messageId));
        },
      },
    ]);
  };

  const deleteWholeChat = () => {
    Alert.alert(i18n.t("thread.delete_chat_title"), i18n.t("thread.delete_chat_body"), [
      { text: i18n.t("buttons.cancel"), style: "cancel" },
      {
        text: i18n.t("buttons.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await purgeCommunityThread(threadId);
            router.replace("/community" as any);
          } catch (e: any) {
            const code = String(e?.code || "");
            const msg = typeof e?.message === "string" && e.message.trim() ? e.message.trim() : code || "unknown";
            Alert.alert(i18n.t("thread.delete_chat_error_title"), msg);
          }
        },
      },
    ]);
  };

  if (!allowed) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.center}>
          <Text style={styles.title}>{i18n.t("thread.private_area_title")}</Text>
          <Text style={styles.info}>{i18n.t("thread.no_access")}</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
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
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
          <Text style={styles.title}>{i18n.t("thread.private_chat_title")}</Text>
          <Pressable style={styles.menuBtn} onPress={() => setMenuOpen((prev) => !prev)}>
            <Text style={styles.menuBtnText}>⋮</Text>
          </Pressable>
        </View>
        {menuOpen ? (
          <View style={styles.menuPanel}>
            <Pressable style={styles.menuItem} onPress={reportUser}>
              <Text style={styles.menuItemText}>{i18n.t("thread.report")}</Text>
            </Pressable>
            {blocked ? (
              <Pressable style={styles.menuItemLast} onPress={unblockUser}>
                <Text style={styles.menuItemText}>{i18n.t("thread.unblock")}</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.menuItem} onPress={blockUser}>
                <Text style={styles.menuItemText}>{i18n.t("thread.block")}</Text>
              </Pressable>
            )}
            <Pressable style={styles.menuItemLast} onPress={deleteWholeChat}>
              <Text style={styles.menuItemDangerText}>{i18n.t("thread.delete_chat")}</Text>
            </Pressable>
          </View>
        ) : null}

        <ScrollView
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            const vh = e.nativeEvent.layoutMeasurement.height;
            const ch = e.nativeEvent.contentSize.height;
            const distanceToBottom = ch - (y + vh);
            wasAtBottomRef.current = distanceToBottom <= 28;
          }}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
            const hasMessages = visibleMessages.length > 0;
            const prevCount = visibleCountRef.current;
            const hasNewMessage = visibleMessages.length > prevCount;
            visibleCountRef.current = visibleMessages.length;

            if (!hasMessages) return;

            if (!didInitialScrollRef.current) {
              didInitialScrollRef.current = true;
              requestAnimationFrame(() => {
                listRef.current?.scrollToEnd({ animated: false });
              });
              return;
            }

            if (hasNewMessage && wasAtBottomRef.current) {
              requestAnimationFrame(() => {
                listRef.current?.scrollToEnd({ animated: true });
              });
            }
          }}
        >
          {visibleMessages.map((msg) => {
            const isOwn = msg.senderUid === uid;
            const translated = translatedByMsgId[msg.id];
            const showOriginal = !!showOriginalByMsgId[msg.id];
            const displayText = translated && !showOriginal ? translated : msg.text || "";
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isOwn ? styles.msgRowOwn : styles.msgRowOther]}
              >
                <View style={[styles.msgBubble, isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther]}>
                  <Text style={styles.msgName}>{msg.senderName || i18n.t("thread.fallback_user")}</Text>
                  <Text selectable style={styles.msgText}>
                    {displayText}
                  </Text>
                  <View style={styles.msgActionsRow}>
                    <Pressable
                      style={styles.msgActionBtn}
                      onPress={() => translateMessage(msg)}
                      disabled={!!isTranslatingByMsgId[msg.id]}
                    >
                      <Text style={styles.msgActionText}>
                        {isTranslatingByMsgId[msg.id]
                          ? i18n.t("thread.translating")
                          : i18n.t("thread.translate")}
                      </Text>
                    </Pressable>
                    {translated ? (
                      <Pressable
                        style={styles.msgActionBtn}
                        onPress={() =>
                          setShowOriginalByMsgId((prev) => ({ ...prev, [msg.id]: true }))
                        }
                      >
                        <Text style={styles.msgActionText}>{i18n.t("thread.show_original")}</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  {translated && !showOriginal ? (
                    <Text selectable style={styles.msgOriginal}>
                      {i18n.t("thread.original_prefix")} {msg.text || ""}
                    </Text>
                  ) : null}
                  {isOwn ? (
                    <Pressable onPress={() => deleteOwnMessage(msg.id)} style={styles.deleteOwnBtn}>
                      <Text style={styles.deleteOwnBtnText}>{i18n.t("buttons.delete")}</Text>
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
              {i18n.t("thread.blocked_info")}
            </Text>
            <Pressable style={styles.unblockBtn} onPress={unblockUser}>
              <Text style={styles.unblockBtnText}>{i18n.t("thread.unblock")}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder={i18n.t("thread.input_placeholder")}
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
  menuItemDangerText: { color: "#d18080", fontSize: 12 },
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
  msgOriginal: { color: "#8f8f8f", fontSize: 10, lineHeight: 14, marginTop: 4, fontStyle: "italic" },
  msgActionsRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  msgActionBtn: {
    borderWidth: 1,
    borderColor: "#3b3b3b",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  msgActionText: { color: "#9fb0cc", fontSize: 10 },
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
