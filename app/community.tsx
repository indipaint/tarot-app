import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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
import { ensureCommunityAuth } from "../src/ensureCommunityAuth";
import { db } from "../src/firebase";
import i18n, { getLocale, subscribeLocale } from "../src/i18n";
import { getLegalUrls } from "../src/legal";

type PostType = "card" | "journal";
type CommunityPost = {
  id: string;
  authorUid?: string;
  authorName?: string;
  type?: PostType;
  cardId?: string;
  question?: string;
  journalText?: string;
  lastReplyThreadId?: string;
};

const buildThreadId = (userA: string, userB: string, postId: string) =>
  `${userA}__${userB}__${postId}`;

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

export default function CommunityScreen() {
  const router = useRouter();
  const cards = useMemo(() => getCards(), []);
  const normalizeLang = (value?: string) => {
    const lang = String(value || "").toLowerCase().split("-")[0];
    return ["de", "en", "fr", "es", "pt"].includes(lang) ? lang : "de";
  };
  const [localeCode, setLocaleCode] = useState(() => normalizeLang(getLocale()));
  const privacyConsentKey = `community_privacy_accepted_v2_${localeCode}`;
  const legalUrls = getLegalUrls(localeCode);

  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameSet, setNicknameSet] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const [thoughtDrafts, setThoughtDrafts] = useState<Record<string, string>>({});
  const [bootReady, setBootReady] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [unreadByPostId, setUnreadByPostId] = useState<Record<string, number>>({});
  const [totalUnreadThreads, setTotalUnreadThreads] = useState(0);
  const [translatedPostById, setTranslatedPostById] = useState<Record<string, string>>({});
  const [translatedQuestionById, setTranslatedQuestionById] = useState<Record<string, string>>({});
  const [unreadRefreshTick, setUnreadRefreshTick] = useState(0);

  const normalizeAuthorName = (value: string) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const isOwnPost = (post: CommunityPost) => {
    const postUid = String(post.authorUid || "").trim();
    const meUid = String(uid || "").trim();
    const postName = normalizeAuthorName(String(post.authorName || ""));
    const myName = normalizeAuthorName(String(nickname || ""));
    // Prefer UID match; for legacy/migrated accounts also allow nickname match
    // so users can still manage older own posts.
    return (
      (!!postUid && !!meUid && postUid === meUid) ||
      (!!postName &&
        !!myName &&
        (postName === myName || postName.includes(myName) || myName.includes(postName)))
    );
  };

  const markPostAsReadLocal = (postId: string) => {
    setUnreadByPostId((prev) => {
      const count = prev[postId] || 0;
      if (!count) return prev;
      const next = { ...prev };
      delete next[postId];
      setTotalUnreadThreads((t) => Math.max(0, t - count));
      return next;
    });
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("app_lang");
      if (saved) setLocaleCode(normalizeLang(saved));
    })();
    const unsubscribe = subscribeLocale((lang) => {
      setLocaleCode(normalizeLang(lang));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const authUid = await ensureCommunityAuth();
        setUid(authUid);

        const [privacyV2, privacyLegacy] = await Promise.all([
          AsyncStorage.getItem(privacyConsentKey),
          AsyncStorage.getItem("community_privacy_accepted"),
        ]);
        setPrivacyAccepted(privacyV2 === "1" || privacyLegacy === "1");

        const storedNickname = await AsyncStorage.getItem("community_nickname");
        if (storedNickname && storedNickname.trim().length > 1) {
          setNickname(storedNickname.trim());
          setNicknameSet(true);
        }
      } catch {
        setBootError("community_boot_error");
      } finally {
        setBootReady(true);
      }
    })();
  }, [privacyConsentKey]);

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

  useEffect(() => {
    if (!uid || !nicknameSet) return;
    let docsA: any[] = [];
    let docsB: any[] = [];

    const recomputeUnread = async () => {
      const seen = new Set<string>();
      const merged = [...docsA, ...docsB].filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });
      if (!merged.length) {
        setUnreadByPostId({});
        setTotalUnreadThreads(0);
        return;
      }
      const keys = merged.map((d) => `thread_last_seen_${d.id}`);
      const storedSeen = await AsyncStorage.multiGet(keys);
      const seenMap: Record<string, number> = {};
      for (const [key, val] of storedSeen) {
        seenMap[key] = Number(val || 0);
      }

      const nextByPost: Record<string, number> = {};
      let total = 0;
      for (const threadDoc of merged) {
        const data = threadDoc.data() as any;
        const postId = String(data?.basedOnPostId || "");
        const lastSender = String(data?.lastMessageSenderUid || "");
        const lastMs = Number(data?.lastMessageAt?.toMillis?.() || 0);
        const seenMs = seenMap[`thread_last_seen_${threadDoc.id}`] || 0;
        if (postId && lastSender && lastSender !== uid && lastMs > seenMs) {
          nextByPost[postId] = (nextByPost[postId] || 0) + 1;
          total += 1;
        }
      }
      setUnreadByPostId(nextByPost);
      setTotalUnreadThreads(total);
    };

    const qA = query(collection(db, "threads"), where("userA", "==", uid), limit(80));
    const qB = query(collection(db, "threads"), where("userB", "==", uid), limit(80));
    const unsubA = onSnapshot(qA, (snap) => {
      docsA = snap.docs;
      recomputeUnread().catch(() => {});
    });
    const unsubB = onSnapshot(qB, (snap) => {
      docsB = snap.docs;
      recomputeUnread().catch(() => {});
    });
    return () => {
      unsubA();
      unsubB();
    };
  }, [uid, nicknameSet]);

  useFocusEffect(
    React.useCallback(() => {
      setUnreadRefreshTick((x) => x + 1);
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (!uid || !nicknameSet) return;
    const rerun = async () => {
      const qA = query(collection(db, "threads"), where("userA", "==", uid), limit(80));
      const qB = query(collection(db, "threads"), where("userB", "==", uid), limit(80));
      const [snapA, snapB] = await Promise.all([getDocs(qA), getDocs(qB)]);
      const seen = new Set<string>();
      const merged = [...snapA.docs, ...snapB.docs].filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });
      const keys = merged.map((d) => `thread_last_seen_${d.id}`);
      const storedSeen = await AsyncStorage.multiGet(keys);
      const seenMap: Record<string, number> = {};
      for (const [key, val] of storedSeen) seenMap[key] = Number(val || 0);
      const nextByPost: Record<string, number> = {};
      let total = 0;
      for (const threadDoc of merged) {
        const data = threadDoc.data() as any;
        const postId = String(data?.basedOnPostId || "");
        const lastSender = String(data?.lastMessageSenderUid || "");
        const lastMs = Number(data?.lastMessageAt?.toMillis?.() || 0);
        const seenMs = seenMap[`thread_last_seen_${threadDoc.id}`] || 0;
        if (postId && lastSender && lastSender !== uid && lastMs > seenMs) {
          nextByPost[postId] = (nextByPost[postId] || 0) + 1;
          total += 1;
        }
      }
      setUnreadByPostId(nextByPost);
      setTotalUnreadThreads(total);
    };
    rerun().catch(() => {});
  }, [unreadRefreshTick, uid, nicknameSet]);

  useEffect(() => {
    if (!uid || !posts.length) return;
    const target = localeCode;
    const toTranslateText = posts.filter(
      (p) =>
        p.authorUid &&
        p.authorUid !== uid &&
        !!p.journalText &&
        String(p.journalText).trim().length > 0 &&
        !translatedPostById[p.id]
    );
    const toTranslateQuestion = posts.filter(
      (p) =>
        p.authorUid &&
        p.authorUid !== uid &&
        !!p.question &&
        String(p.question).trim().length > 0 &&
        !translatedQuestionById[p.id]
    );
    if (!toTranslateText.length && !toTranslateQuestion.length) return;

    const run = async () => {
      const translateWithFallback = async (input: string) => {
        let translated = "";
        try {
          const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              q: input,
              source: "auto",
              target,
              format: "text",
            }),
          });
          const data = await res.json();
          translated = String(data?.translatedText || "").trim();
        } catch {}

        if (!translated) {
          const fallbackUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
            target
          )}&dt=t&q=${encodeURIComponent(input)}`;
          const fallbackRes = await fetch(fallbackUrl);
          const fallbackData = await fallbackRes.json();
          const chunks = Array.isArray(fallbackData?.[0]) ? fallbackData[0] : [];
          translated = chunks.map((chunk: any) => String(chunk?.[0] || "")).join("").trim();
        }
        return translated;
      };

      const textUpdates: Record<string, string> = {};
      for (const post of toTranslateText) {
        const text = String(post.journalText || "").trim();
        try {
          const translated = await translateWithFallback(text);
          if (translated) textUpdates[post.id] = translated;
        } catch {}
      }

      const questionUpdates: Record<string, string> = {};
      for (const post of toTranslateQuestion) {
        const text = String(post.question || "").trim();
        try {
          const translated = await translateWithFallback(text);
          if (translated) questionUpdates[post.id] = translated;
        } catch {}
      }

      if (Object.keys(textUpdates).length) {
        setTranslatedPostById((prev) => ({ ...prev, ...textUpdates }));
      }
      if (Object.keys(questionUpdates).length) {
        setTranslatedQuestionById((prev) => ({ ...prev, ...questionUpdates }));
      }
    };
    run().catch(() => {});
  }, [posts, uid, localeCode, translatedPostById, translatedQuestionById]);

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
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "posts", postId));
          } catch (err: any) {
            const code = String(err?.code || "");
            if (code.includes("permission-denied")) {
              Alert.alert(
                "Info",
                "Dieser alte Post kann serverseitig nicht geloescht werden (Legacy-Besitzrechte in Firestore)."
              );
            } else {
              Alert.alert("Error", "Post konnte nicht geloescht werden.");
            }
          }
        },
      },
    ]);
  };

  const tryDeletePost = (post: CommunityPost) => {
    deletePost(post.id);
  };

  const openPrivateThread = async (post: CommunityPost) => {
    if (!uid || !post.id) return;
    if (!post.authorUid) {
      Alert.alert("Info", i18n.t("community.private_unavailable"));
      return;
    }
    if (post.authorUid === uid) return;

    try {
      const [userA, userB] = [uid, post.authorUid].sort();
      const threadId = buildThreadId(userA, userB, post.id);
      const threadRef = doc(db, "threads", threadId);
      const existing = await getDoc(threadRef);
      if (!existing.exists()) {
        await setDoc(threadRef, {
          userA,
          userB,
          basedOnPostId: post.id,
          createdAt: serverTimestamp(),
        });
      }
      router.push(`/community/thread/${threadId}` as any);
    } catch {
      Alert.alert("Error", "Private thread could not be opened.");
    }
  };

  const openLatestPrivateReply = async (post: CommunityPost) => {
    if (!uid || !post.id) return;
    if (post.lastReplyThreadId) {
      markPostAsReadLocal(post.id);
      router.push(`/community/thread/${post.lastReplyThreadId}` as any);
      return;
    }
    try {
      const qA = query(
        collection(db, "threads"),
        where("basedOnPostId", "==", post.id),
        where("userA", "==", uid),
        limit(20)
      );
      const qB = query(
        collection(db, "threads"),
        where("basedOnPostId", "==", post.id),
        where("userB", "==", uid),
        limit(20)
      );
      const [snapA, snapB] = await Promise.all([getDocs(qA), getDocs(qB)]);
      const seen = new Set<string>();
      const merged = [...snapA.docs, ...snapB.docs].filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });
      if (!merged.length) {
        Alert.alert("Info", i18n.t("community.private_no_reply_yet"));
        return;
      }
      merged.sort((a, b) => {
        const aSec = Number((a.data() as any)?.createdAt?.seconds || 0);
        const bSec = Number((b.data() as any)?.createdAt?.seconds || 0);
        return bSec - aSec;
      });
      markPostAsReadLocal(post.id);
      router.push(`/community/thread/${merged[0].id}` as any);
    } catch {
      Alert.alert("Error", "Private thread could not be opened.");
    }
  };

  const replyOrOpenPrivate = async (post: CommunityPost) => openPrivateThread(post);

  const saveOwnThoughts = async (post: CommunityPost) => {
    if (!post.id) return;
    const text = (thoughtDrafts[post.id] ?? post.journalText ?? "").trim();
    try {
      await updateDoc(doc(db, "posts", post.id), { journalText: text });
      setThoughtDrafts((prev) => {
        const next = { ...prev };
        delete next[post.id];
        return next;
      });
    } catch {
      Alert.alert("Error", "Post could not be updated.");
    }
  };

  const openLegalUrl = async (url: string) => {
    const target = String(url || "").trim();
    try {
      if (!/^https?:\/\//i.test(target)) {
        throw new Error("invalid_url_scheme");
      }
      const canOpen = await Linking.canOpenURL(target);
      if (!canOpen) {
        throw new Error("cannot_open_url");
      }
      await Linking.openURL(target);
    } catch {
      Alert.alert(
        i18n.t("community.privacy_link_error_title"),
        i18n.t("community.privacy_link_error_body", { url: target || "-" })
      );
    }
  };

  const acceptPrivacy = async () => {
    if (!consentChecked) {
      Alert.alert("", i18n.t("community.privacy_need_checkbox"));
      return;
    }
    await AsyncStorage.setItem(privacyConsentKey, "1");
    // Keep compatibility for existing users/screens still reading the legacy key.
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

  if (bootError) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.nickSubtitle}>Community unavailable right now.</Text>
          <Pressable style={styles.backBtnNick} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← {i18n.t("buttons.back")}</Text>
          </Pressable>
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
          <Text style={styles.privacySafetyNote}>{i18n.t("community.privacy_safety_note")}</Text>
          <Pressable style={styles.privacyLinkBtn} onPress={() => openLegalUrl(legalUrls.privacy)}>
            <Text style={styles.privacyLinkText}>{i18n.t("community.privacy_link_privacy")}</Text>
          </Pressable>
          <Pressable style={styles.privacyLinkBtn} onPress={() => openLegalUrl(legalUrls.terms)}>
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
          <Text style={styles.header}>
            {i18n.t("community.center_title")}
            {totalUnreadThreads > 0 ? `  🔴${totalUnreadThreads}` : ""}
          </Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          keyboardShouldPersistTaps="handled"
        >
          {posts.map((post) => {
            const isOwn = isOwnPost(post);
            const image = getCardImage(post.cardId);
            return (
              <View
                key={post.id}
                style={[styles.postRow, isOwn ? styles.postRowOwn : styles.postRowOther]}
              >
                <View style={[styles.postCard, isOwn ? styles.postCardOwn : styles.postCardOther]}>
                {(unreadByPostId[post.id] || 0) > 0 ? (
                  <View style={styles.postUnreadPill}>
                    <Text style={styles.postUnreadPillText}>● {unreadByPostId[post.id]}</Text>
                  </View>
                ) : null}
                <Text style={styles.postAuthor}>
                  {post.authorName || i18n.t("community.unknown_author")}
                </Text>
                <Text style={styles.postType}>
                  {post.type === "journal"
                    ? i18n.t("community.post_type_journal")
                    : i18n.t("community.post_type_card")}
                </Text>
                {image ? (
                  <Image source={image} style={styles.cardImage} resizeMode="contain" />
                ) : null}
                {post.question ? (
                  <>
                    <Text style={styles.postQuestion}>
                      {(!isOwn && translatedQuestionById[post.id]) || post.question}
                    </Text>
                    {!isOwn &&
                    translatedQuestionById[post.id] &&
                    translatedQuestionById[post.id] !== post.question ? (
                      <Text style={styles.postOriginalText}>
                        {i18n.t("community.post_original_prefix")} {post.question}
                      </Text>
                    ) : null}
                  </>
                ) : null}
                {post.journalText ? (
                  <>
                    <Text style={styles.postText}>
                      {(!isOwn && translatedPostById[post.id]) || post.journalText}
                    </Text>
                    {!isOwn &&
                    translatedPostById[post.id] &&
                    translatedPostById[post.id] !== post.journalText ? (
                      <Text style={styles.postOriginalText}>
                        {i18n.t("community.post_original_prefix")} {post.journalText}
                      </Text>
                    ) : null}
                  </>
                ) : null}

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

                  {isOwn ? (
                    <Pressable
                      style={styles.replyBtnGhost}
                      onPress={() => openLatestPrivateReply(post)}
                    >
                      <View style={styles.replyViewWrap}>
                        <Text style={styles.replyBtnText}>{i18n.t("community.private_view_replies")}</Text>
                        {(unreadByPostId[post.id] || 0) > 0 ? (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadByPostId[post.id]}</Text>
                          </View>
                        ) : null}
                      </View>
                    </Pressable>
                  ) : null}

                  {!isOwn ? (
                    <View style={styles.replyBox}>
                      <View style={styles.replyActions}>
                        <Pressable style={styles.replyBtn} onPress={() => replyOrOpenPrivate(post)}>
                          <Text style={styles.replyBtnText}>{i18n.t("community.private_reply")}</Text>
                        </Pressable>
                      </View>
                      <Text style={styles.privateReplyHint}>{i18n.t("community.private_reply_hint")}</Text>
                    </View>
                  ) : null}
                  <Pressable style={styles.deleteBtn} onPress={() => tryDeletePost(post)}>
                    <Text style={styles.deleteBtnText}>🗑️ {i18n.t("buttons.delete")}</Text>
                  </Pressable>
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
  postUnreadPill: {
    alignSelf: "flex-end",
    backgroundColor: "#b3261e",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  postUnreadPillText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  postCardOwn: { backgroundColor: "#152136", borderColor: "#3b4b66" },
  postCardOther: { backgroundColor: "#111", borderColor: "#303030" },
  postAuthor: { color: "#cfd7ff", fontSize: 11, letterSpacing: 1 },
  postType: { color: "#8fa0bf", fontSize: 10 },
  postQuestion: { color: "#dedede", fontSize: 13, lineHeight: 18 },
  postText: { color: "#c0c0c0", fontSize: 13, lineHeight: 20 },
  postOriginalText: { color: "#7f7f7f", fontSize: 10, lineHeight: 14, fontStyle: "italic" },
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
  privateReplyHint: { color: "#6f6f6f", fontSize: 10, lineHeight: 14 },
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
  replyViewWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  unreadBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#b3261e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  unreadBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
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