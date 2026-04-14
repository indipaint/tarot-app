import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
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
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "../src/legal";

type PostType = "card" | "journal";
type CommunityPost = {
  id: string;
  authorUid?: string;
  authorName?: string;
  type?: PostType;
  cardId?: string;
  question?: string;
  journalText?: string;
};

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

export default function CommunityScreen() {
  const router = useRouter();
  const cards = useMemo(() => getCards(), []);

  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameSet, setNicknameSet] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [thoughtDrafts, setThoughtDrafts] = useState<Record<string, string>>({});
  const [bootReady, setBootReady] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const storedUid = await AsyncStorage.getItem("community_uid");
      if (storedUid) {
        setUid(storedUid);
      } else {
        const newUid = Math.random().toString(36).slice(2);
        await AsyncStorage.setItem("community_uid", newUid);
        setUid(newUid);
      }

      const privacy = await AsyncStorage.getItem("community_privacy_accepted");
      setPrivacyAccepted(privacy === "1");

      const storedNickname = await AsyncStorage.getItem("community_nickname");
      if (storedNickname && storedNickname.trim().length > 1) {
        setNickname(storedNickname.trim());
        setNicknameSet(true);
      }
      setBootReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!nicknameSet) return;
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const nextPosts = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CommunityPost, "id">),
      }));
      setPosts(nextPosts);
    });
    return unsub;
  }, [nicknameSet]);

  const getCardImage = (inputCardId?: string) => {
    if (!inputCardId) return null;
    const card = cards.find((c: any) => String(c?.id) === String(inputCardId));
    return card?.image ?? null;
  };

  const deletePost = (postId: string) => {
    Alert.alert(i18n.t("community.delete_title"), i18n.t("community.delete_post_confirm"), [
      { text: i18n.t("buttons.cancel"), style: "cancel" },
      {
        text: i18n.t("buttons.delete"),
        style: "destructive",
        onPress: () => deleteDoc(doc(db, "posts", postId)),
      },
    ]);
  };

  const openPrivateThread = async (post: CommunityPost) => {
    if (!uid || !post.authorUid || post.authorUid === uid || !post.id) return;

    const [userA, userB] = [uid, post.authorUid].sort();
    const existingQ = query(
      collection(db, "threads"),
      where("userA", "==", userA),
      where("userB", "==", userB),
      where("basedOnPostId", "==", post.id),
      limit(1)
    );
    const existing = await getDocs(existingQ);

    if (!existing.empty) {
      router.push(`/community/thread/${existing.docs[0].id}` as any);
      return;
    }

    const created = await addDoc(collection(db, "threads"), {
      userA,
      userB,
      basedOnPostId: post.id,
      createdAt: serverTimestamp(),
    });
    router.push(`/community/thread/${created.id}` as any);
  };

  const startPrivateWithMessage = async (post: CommunityPost) => {
    if (!uid || !post.authorUid || post.authorUid === uid || !post.id) return;
    const draft = (replyDrafts[post.id] || "").trim();
    if (!draft) return;

    const [userA, userB] = [uid, post.authorUid].sort();
    const existingQ = query(
      collection(db, "threads"),
      where("userA", "==", userA),
      where("userB", "==", userB),
      where("basedOnPostId", "==", post.id),
      limit(1)
    );
    const existing = await getDocs(existingQ);

    let threadId = "";
    if (!existing.empty) {
      threadId = existing.docs[0].id;
    } else {
      const created = await addDoc(collection(db, "threads"), {
        userA,
        userB,
        basedOnPostId: post.id,
        createdAt: serverTimestamp(),
      });
      threadId = created.id;
    }

    await addDoc(collection(db, "threads", threadId, "messages"), {
      text: draft,
      senderUid: uid,
      senderName: nickname,
      createdAt: serverTimestamp(),
    });

    setReplyDrafts((prev) => ({ ...prev, [post.id!]: "" }));
    router.push(`/community/thread/${threadId}` as any);
  };

  const saveOwnThoughts = async (post: CommunityPost) => {
    if (!post.id) return;
    const text = (thoughtDrafts[post.id] ?? post.journalText ?? "").trim();
    await updateDoc(doc(db, "posts", post.id), { journalText: text });
    setThoughtDrafts((prev) => {
      const next = { ...prev };
      delete next[post.id];
      return next;
    });
  };

  const openLegalUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const acceptPrivacy = async () => {
    if (!consentChecked) {
      Alert.alert("", i18n.t("community.privacy_need_checkbox"));
      return;
    }
    await AsyncStorage.setItem("community_privacy_accepted", "1");
    setPrivacyAccepted(true);
  };

  if (!bootReady) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.bootText}>…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!privacyAccepted) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.privacyScroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.privacyTitle}>{i18n.t("community.privacy_title")}</Text>
          <Text style={styles.privacyBody}>{i18n.t("community.privacy_intro")}</Text>
          <Text style={styles.privacySafetyNote}>
            Sicherheitsfunktionen: Blockieren und Melden sind im privaten Chat verfuegbar (oben rechts ueber ⋮).
          </Text>
          <Pressable style={styles.privacyLinkBtn} onPress={() => openLegalUrl(PRIVACY_POLICY_URL)}>
            <Text style={styles.privacyLinkText}>{i18n.t("community.privacy_link_privacy")}</Text>
          </Pressable>
          <Pressable style={styles.privacyLinkBtn} onPress={() => openLegalUrl(TERMS_OF_USE_URL)}>
            <Text style={styles.privacyLinkText}>{i18n.t("community.privacy_link_terms")}</Text>
          </Pressable>
          <Pressable
            style={styles.privacyCheckRow}
            onPress={() => setConsentChecked((c) => !c)}
          >
            <Text style={styles.privacyCheckBox}>{consentChecked ? "☑" : "☐"}</Text>
            <Text style={styles.privacyCheckLabel}>{i18n.t("community.privacy_checkbox")}</Text>
          </Pressable>
          <Pressable style={styles.nickBtn} onPress={acceptPrivacy}>
            <Text style={styles.nickBtnText}>{i18n.t("community.privacy_accept_btn")}</Text>
          </Pressable>
          <Pressable style={styles.backBtnNick} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            onPress={async () => {
              if (nickname.trim().length > 1) {
                await AsyncStorage.setItem("community_nickname", nickname.trim());
                setNicknameSet(true);
              }
            }}
          >
            <Text style={styles.nickBtnText}>{i18n.t("community.btn")}</Text>
          </Pressable>
          <Pressable style={styles.backBtnNick} onPress={() => router.back()}>
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
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
          <Text style={styles.header}>{i18n.t("community.center_title")}</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
          {posts.map((post) => {
            const isOwn = post.authorUid === uid;
            const image = getCardImage(post.cardId);
            return (
              <View
                key={post.id}
                style={[styles.postRow, isOwn ? styles.postRowOwn : styles.postRowOther]}
              >
                <View style={[styles.postCard, isOwn ? styles.postCardOwn : styles.postCardOther]}>
                <Text style={styles.postAuthor}>
                  {post.authorName || i18n.t("community.unknown_author")}
                </Text>
                <Text style={styles.postType}>
                  {post.type === "journal" ? "📖 Journal" : "🃏 Karte"}
                </Text>
                {image ? (
                  <Image source={image} style={styles.cardImage} resizeMode="contain" />
                ) : null}
                {post.question ? <Text style={styles.postQuestion}>{post.question}</Text> : null}
                {post.journalText ? <Text style={styles.postText}>{post.journalText}</Text> : null}

                <View style={styles.row}>
                  {isOwn ? (
                    <View style={styles.replyBox}>
                      {(() => {
                        const currentText = post.journalText || "";
                        const draftValue = thoughtDrafts[post.id];
                        const hasChanged =
                          typeof draftValue === "string" && draftValue !== currentText;
                        return (
                          <>
                      <TextInput
                        style={styles.replyInput}
                        value={draftValue ?? currentText}
                        onChangeText={(value) =>
                          setThoughtDrafts((prev) => ({ ...prev, [post.id]: value }))
                        }
                        placeholder={i18n.t("community.own_thoughts_placeholder")}
                        placeholderTextColor="#777"
                        multiline
                      />
                      {hasChanged ? (
                        <View style={styles.replyActions}>
                          <Pressable style={styles.replyBtn} onPress={() => saveOwnThoughts(post)}>
                            <Text style={styles.replyBtnText}>{i18n.t("buttons.save")}</Text>
                          </Pressable>
                        </View>
                      ) : null}
                          </>
                        );
                      })()}
                    </View>
                  ) : null}

                  {post.authorUid && post.authorUid !== uid ? (
                    <View style={styles.replyBox}>
                      <TextInput
                        style={styles.replyInput}
                        value={replyDrafts[post.id] || ""}
                        onChangeText={(value) =>
                          setReplyDrafts((prev) => ({ ...prev, [post.id]: value }))
                        }
                        placeholder={i18n.t("community.private_message_placeholder")}
                        placeholderTextColor="#777"
                        multiline
                      />
                      <View style={styles.replyActions}>
                        <Pressable
                          style={styles.replyBtn}
                          onPress={() => startPrivateWithMessage(post)}
                        >
                          <Text style={styles.replyBtnText}>{i18n.t("community.private_send")}</Text>
                        </Pressable>
                        <Pressable
                          style={styles.replyBtnGhost}
                          onPress={() => openPrivateThread(post)}
                        >
                          <Text style={styles.replyBtnText}>{i18n.t("community.private_open")}</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                  {isOwn ? (
                    <Pressable style={styles.deleteBtn} onPress={() => deletePost(post.id)}>
                      <Text style={styles.deleteBtnText}>🗑️ {i18n.t("buttons.delete")}</Text>
                    </Pressable>
                  ) : null}
                </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nickSafe: { flex: 1, backgroundColor: "#0a182e" },
  nickContainer: { flex: 1, justifyContent: "flex-start", alignItems: "center", padding: 20, gap: 20 },
  nickTitle: { color: "#fff", fontSize: 28, textAlign: "center", letterSpacing: 2, marginBottom: 2 },
  nickSubtitle: { color: "#fcfbfb", fontSize: 15, textAlign: "center", marginBottom: 10 },
  bootText: { color: "#666", fontSize: 14 },
  privacyScroll: { padding: 20, paddingBottom: 40, gap: 14 },
  privacyTitle: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 4,
  },
  privacyBody: { color: "#e8e8e8", fontSize: 14, lineHeight: 22, textAlign: "left" },
  privacySafetyNote: {
    color: "#c9d3ea",
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: "#101a2a",
    borderWidth: 1,
    borderColor: "#2c3d63",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  privacyLinkBtn: {
    alignSelf: "stretch",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6a7ab0",
    backgroundColor: "#132033",
  },
  privacyLinkText: { color: "#c7d5ff", fontSize: 13, textAlign: "center" },
  privacyCheckRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginTop: 4 },
  privacyCheckBox: { color: "#fff", fontSize: 18, lineHeight: 22 },
  privacyCheckLabel: { flex: 1, color: "#ddd", fontSize: 13, lineHeight: 20 },
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
  nickBtnText: { color: "#fff", fontSize: 16, letterSpacing: 1 },
  backBtnNick: { marginTop: 20 },
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1b1b1b",
    paddingHorizontal: 12,
  },
  backBtn: { paddingVertical: 12, paddingRight: 12 },
  backBtnText: { color: "#aaa", fontSize: 10 },
  backBtnPlaceholder: { width: 60 },
  header: { flex: 1, color: "#fff", fontSize: 12, textAlign: "center", paddingVertical: 12, letterSpacing: 1 },
  feed: { flex: 1 },
  feedContent: { padding: 14, gap: 12 },
  postRow: { width: "100%", flexDirection: "row" },
  postRowOwn: { justifyContent: "flex-end" },
  postRowOther: { justifyContent: "flex-start" },
  postCard: {
    width: "86%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  postCardOwn: { backgroundColor: "#152136", borderColor: "#3b4b66" },
  postCardOther: { backgroundColor: "#111", borderColor: "#303030" },
  postAuthor: { color: "#cfd7ff", fontSize: 11, letterSpacing: 1 },
  postType: { color: "#8fa0bf", fontSize: 10 },
  postQuestion: { color: "#dedede", fontSize: 13, lineHeight: 18 },
  postText: { color: "#c0c0c0", fontSize: 13, lineHeight: 20 },
  cardImage: { width: 100, height: 165, borderRadius: 8, marginTop: 4 },
  row: { gap: 8, marginTop: 8 },
  replyBox: { gap: 8 },
  replyInput: {
    backgroundColor: "#191919",
    color: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 44,
    textAlignVertical: "top",
  },
  replyActions: { flexDirection: "row", gap: 8 },
  replyBtn: {
    borderWidth: 1,
    borderColor: "#4d5f85",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#14233b",
  },
  replyBtnGhost: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#101010",
  },
  replyBtnText: { color: "#888", fontSize: 11 },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#622",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  deleteBtnText: { color: "#944", fontSize: 11 },
});