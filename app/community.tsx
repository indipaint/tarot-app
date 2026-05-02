import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { purgeCommunityThread } from "../src/purgeCommunityThread";
import { registerDevicePushToken } from "../src/pushNotifications";
import { deleteCurrentAccountAndData } from "../src/deleteAccountAndData";

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
  createdAt?: any;
};

type PrivateThreadPreview = {
  id: string;
  basedOnPostId?: string;
  otherUid: string;
  lastMessageAtMs: number;
  unread: boolean;
};

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutCode: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutCode)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

const SETTINGS_COPY: Record<
  "de" | "en" | "fr" | "es" | "pt",
  {
    menuTitle: string;
    deleteItem: string;
    confirmTitle: string;
    confirmBody: string;
    continueButton: string;
    finalTitle: string;
    finalBody: string;
    finalConfirm: string;
    successTitle: string;
    successBody: string;
    failedTitle: string;
    failedBody: string;
  }
> = {
  de: {
    menuTitle: "Einstellungen",
    deleteItem: "Gesamtes Konto & alle Daten dauerhaft löschen",
    confirmTitle: "Bist du sicher?",
    confirmBody: "Alle deine Reflexionen und Tagebucheinträge werden unwiderruflich gelöscht.",
    continueButton: "Weiter",
    finalTitle: "Finale Bestätigung",
    finalBody: "Diese Aktion kann nicht rückgängig gemacht werden.",
    finalConfirm: "Ja, endgültig löschen",
    successTitle: "Konto gelöscht",
    successBody: "Dein Konto und alle Daten wurden gelöscht.",
    failedTitle: "Löschen fehlgeschlagen",
    failedBody: "Bitte versuche es erneut.",
  },
  en: {
    menuTitle: "Settings",
    deleteItem: "Permanently delete entire account & all data",
    confirmTitle: "Are you sure?",
    confirmBody: "All your reflections and journal entries will be permanently deleted.",
    continueButton: "Continue",
    finalTitle: "Final confirmation",
    finalBody: "This action cannot be undone.",
    finalConfirm: "Yes, delete permanently",
    successTitle: "Account deleted",
    successBody: "Your account and all data were deleted.",
    failedTitle: "Deletion failed",
    failedBody: "Please try again.",
  },
  fr: {
    menuTitle: "Paramètres",
    deleteItem: "Supprimer définitivement le compte et toutes les données",
    confirmTitle: "Êtes-vous sûr(e) ?",
    confirmBody: "Toutes vos réflexions et entrées du journal seront supprimées de façon irréversible.",
    continueButton: "Continuer",
    finalTitle: "Confirmation finale",
    finalBody: "Cette action est irréversible.",
    finalConfirm: "Oui, supprimer définitivement",
    successTitle: "Compte supprimé",
    successBody: "Votre compte et toutes les données ont été supprimés.",
    failedTitle: "Échec de la suppression",
    failedBody: "Veuillez réessayer.",
  },
  es: {
    menuTitle: "Ajustes",
    deleteItem: "Eliminar permanentemente toda la cuenta y los datos",
    confirmTitle: "¿Estás seguro/a?",
    confirmBody: "Todas tus reflexiones y entradas del diario se eliminarán de forma irreversible.",
    continueButton: "Continuar",
    finalTitle: "Confirmación final",
    finalBody: "Esta acción no se puede deshacer.",
    finalConfirm: "Sí, eliminar permanentemente",
    successTitle: "Cuenta eliminada",
    successBody: "Tu cuenta y todos los datos se eliminaron.",
    failedTitle: "Error al eliminar",
    failedBody: "Por favor, inténtalo de nuevo.",
  },
  pt: {
    menuTitle: "Definições",
    deleteItem: "Eliminar permanentemente a conta e todos os dados",
    confirmTitle: "Tens a certeza?",
    confirmBody: "Todas as tuas reflexões e entradas do diário serão eliminadas de forma irreversível.",
    continueButton: "Continuar",
    finalTitle: "Confirmação final",
    finalBody: "Esta ação não pode ser desfeita.",
    finalConfirm: "Sim, eliminar permanentemente",
    successTitle: "Conta eliminada",
    successBody: "A tua conta e todos os dados foram eliminados.",
    failedTitle: "Falha ao eliminar",
    failedBody: "Tenta novamente.",
  },
};

const buildThreadId = (userA: string, userB: string, postId: string) =>
  `${userA}__${userB}__${postId}`;

/** All private threads for this post where the given uid is a participant (may be several ids). */
async function listThreadIdsForPost(postId: string, uid: string): Promise<string[]> {
  const me = String(uid || "").trim();
  const pid = String(postId || "").trim();
  if (!me || !pid) return [];
  const qA = query(
    collection(db, "threads"),
    where("basedOnPostId", "==", pid),
    where("userA", "==", me),
    limit(30)
  );
  const qB = query(
    collection(db, "threads"),
    where("basedOnPostId", "==", pid),
    where("userB", "==", me),
    limit(30)
  );
  const [snapA, snapB] = await Promise.all([getDocs(qA), getDocs(qB)]);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const d of [...snapA.docs, ...snapB.docs]) {
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    out.push(d.id);
  }
  return out;
}

/** UIDs blocked by the current user (local + Firestore), for unread / delivery UX. */
async function loadMergedBlockedUids(meUid: string): Promise<Set<string>> {
  const out = new Set<string>();
  if (!meUid) return out;
  try {
    const raw = await AsyncStorage.getItem("blocked_uids");
    const list = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list)) {
      for (const x of list) {
        if (typeof x === "string" && x.trim()) out.add(x.trim());
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const meSnap = await getDoc(doc(db, "community_users", meUid));
    const arr = meSnap.data()?.blockedUids;
    if (Array.isArray(arr)) {
      for (const x of arr) {
        if (typeof x === "string" && x.trim()) out.add(x.trim());
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

export default function CommunityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string }>();
  const chatsOnly = String(params?.view || "").toLowerCase() === "chats";
  const cards = useMemo(() => getCards(), []);
  const normalizeLang = (value?: string) => {
    const lang = String(value || "").toLowerCase().split("-")[0];
    return ["de", "en", "fr", "es", "pt"].includes(lang) ? lang : "de";
  };
  const [localeCode, setLocaleCode] = useState(() => normalizeLang(getLocale()));
  const settingsCopy = SETTINGS_COPY[localeCode as "de" | "en" | "fr" | "es" | "pt"];
  const privacyConsentKey = `community_privacy_accepted_v2_${localeCode}`;
  const communityAcceptedTermsKey = "community_accepted_terms";
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
  const [privateThreads, setPrivateThreads] = useState<PrivateThreadPreview[]>([]);
  const [seenPostIds, setSeenPostIds] = useState<Record<string, number>>({});
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const seenPostsStorageKey = uid ? `community_seen_posts_${uid}` : "community_seen_posts";

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

  const getPostCreatedAtMs = (post: CommunityPost): number => {
    const raw: any = post?.createdAt;
    const fromMillis = Number(raw?.toMillis?.() || 0);
    if (fromMillis > 0) return fromMillis;
    const sec = Number(raw?.seconds || 0);
    if (sec > 0) return sec * 1000;
    return 0;
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
    const unsubscribe = subscribeLocale((lang: string) => {
      setLocaleCode(normalizeLang(lang));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const authUid = await withTimeout(ensureCommunityAuth(), 12000, "community_auth_timeout");
        // Push registration is non-critical for opening the screen.
        registerDevicePushToken(authUid).catch(() => {});
        setUid(authUid);

        const [privacyV2, privacyLegacy, termsAccepted] = await Promise.all([
          AsyncStorage.getItem(privacyConsentKey),
          AsyncStorage.getItem("community_privacy_accepted"),
          AsyncStorage.getItem(communityAcceptedTermsKey),
        ]);
        const accepted = privacyV2 === "1" || privacyLegacy === "1" || termsAccepted === "1";
        setPrivacyAccepted(accepted);
        if (accepted && termsAccepted !== "1") {
          AsyncStorage.setItem(communityAcceptedTermsKey, "1").catch(() => {});
        }

        const storedNickname = await AsyncStorage.getItem("community_nickname");
        if (storedNickname && storedNickname.trim().length > 1) {
          setNickname(storedNickname.trim());
          setNicknameSet(true);
        }
      } catch (err: any) {
        const msg =
          typeof err?.message === "string" && err.message.trim()
            ? err.message.trim()
            : "community_boot_error";
        setBootError(msg);
      } finally {
        setBootReady(true);
      }
    })();
  }, [privacyConsentKey]);

  const retryBoot = () => {
    setBootReady(false);
    setBootError(null);
    (async () => {
      try {
        const authUid = await withTimeout(ensureCommunityAuth(), 12000, "community_auth_timeout");
        setUid(authUid);

        const [privacyV2, privacyLegacy, termsAccepted] = await Promise.all([
          AsyncStorage.getItem(privacyConsentKey),
          AsyncStorage.getItem("community_privacy_accepted"),
          AsyncStorage.getItem(communityAcceptedTermsKey),
        ]);
        const accepted = privacyV2 === "1" || privacyLegacy === "1" || termsAccepted === "1";
        setPrivacyAccepted(accepted);
        if (accepted && termsAccepted !== "1") {
          AsyncStorage.setItem(communityAcceptedTermsKey, "1").catch(() => {});
        }

        const storedNickname = await AsyncStorage.getItem("community_nickname");
        if (storedNickname && storedNickname.trim().length > 1) {
          setNickname(storedNickname.trim());
          setNicknameSet(true);
        }
      } catch (err: any) {
        const msg =
          typeof err?.message === "string" && err.message.trim()
            ? err.message.trim()
            : "community_boot_error";
        setBootError(msg);
      } finally {
        setBootReady(true);
      }
    })();
  };

  useEffect(() => {
    if (!uid || !nicknameSet || !nickname.trim()) return;
    setDoc(
      doc(db, "community_users", uid),
      {
        uid,
        nickname: nickname.trim(),
        nicknameKey: normalizeAuthorName(nickname),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});
  }, [uid, nicknameSet, nickname]);

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
    if (!uid) return;
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(seenPostsStorageKey);
        if (cancelled) return;
        const parsed = stored ? JSON.parse(stored) : {};
        setSeenPostIds(parsed && typeof parsed === "object" ? parsed : {});
      } catch {
        if (!cancelled) setSeenPostIds({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, seenPostsStorageKey]);

  const markFeedPostAsSeen = (post: CommunityPost) => {
    const postId = String(post.id || "").trim();
    if (!postId || isOwnPost(post)) return;
    const createdAtMs = getPostCreatedAtMs(post);
    setSeenPostIds((prev) => {
      const previousSeen = Number(prev[postId] || 0);
      const nextSeen = Math.max(previousSeen, createdAtMs || Date.now());
      if (previousSeen >= nextSeen) return prev;
      const next = { ...prev, [postId]: nextSeen };
      AsyncStorage.setItem(seenPostsStorageKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

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
        setPrivateThreads([]);
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
      const previews: PrivateThreadPreview[] = [];
      const blockedPeers = await loadMergedBlockedUids(uid);
      for (const threadDoc of merged) {
        const data = threadDoc.data() as any;
        const postId = String(data?.basedOnPostId || "");
        const lastSender = String(data?.lastMessageSenderUid || "");
        const lastMs = Number(data?.lastMessageAt?.toMillis?.() || 0);
        const seenMs = seenMap[`thread_last_seen_${threadDoc.id}`] || 0;
        const userA = String(data?.userA || "");
        const userB = String(data?.userB || "");
        const otherUid = userA === uid ? userB : userA;
        const unreadRaw = !!(lastSender && lastSender !== uid && lastMs > seenMs);
        const unread = unreadRaw && !blockedPeers.has(otherUid);
        if (otherUid) {
          previews.push({
            id: threadDoc.id,
            basedOnPostId: postId || undefined,
            otherUid,
            lastMessageAtMs: lastMs,
            unread,
          });
        }
        if (postId && unread) {
          nextByPost[postId] = (nextByPost[postId] || 0) + 1;
          total += 1;
        }
      }
      previews.sort((a, b) => b.lastMessageAtMs - a.lastMessageAtMs);
      setPrivateThreads(previews.slice(0, 8));
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

  useEffect(() => {
    setUnreadRefreshTick((x) => x + 1);
  }, []);

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
      const previews: PrivateThreadPreview[] = [];
      const blockedPeers = await loadMergedBlockedUids(uid);
      for (const threadDoc of merged) {
        const data = threadDoc.data() as any;
        const postId = String(data?.basedOnPostId || "");
        const lastSender = String(data?.lastMessageSenderUid || "");
        const lastMs = Number(data?.lastMessageAt?.toMillis?.() || 0);
        const seenMs = seenMap[`thread_last_seen_${threadDoc.id}`] || 0;
        const userA = String(data?.userA || "");
        const userB = String(data?.userB || "");
        const otherUid = userA === uid ? userB : userA;
        const unreadRaw = !!(lastSender && lastSender !== uid && lastMs > seenMs);
        const unread = unreadRaw && !blockedPeers.has(otherUid);
        if (otherUid) {
          previews.push({
            id: threadDoc.id,
            basedOnPostId: postId || undefined,
            otherUid,
            lastMessageAtMs: lastMs,
            unread,
          });
        }
        if (postId && unread) {
          nextByPost[postId] = (nextByPost[postId] || 0) + 1;
          total += 1;
        }
      }
      previews.sort((a, b) => b.lastMessageAtMs - a.lastMessageAtMs);
      setPrivateThreads(previews.slice(0, 8));
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
            const threadIds = await listThreadIdsForPost(postId, uid);
            for (const tid of threadIds) {
              try {
                await purgeCommunityThread(tid);
              } catch {
                // Thread cleanup is best-effort (rules may differ from post delete).
              }
            }
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

  const confirmDeleteThreadRow = (threadId: string) => {
    Alert.alert(i18n.t("thread.delete_chat_title"), i18n.t("thread.delete_chat_body"), [
      { text: i18n.t("buttons.cancel"), style: "cancel" },
      {
        text: i18n.t("buttons.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await purgeCommunityThread(threadId);
          } catch (e: any) {
            const msg =
              typeof e?.message === "string" && e.message.trim()
                ? e.message.trim()
                : String(e?.code || "unknown");
            Alert.alert(i18n.t("thread.delete_chat_error_title"), msg);
          }
        },
      },
    ]);
  };

  const openPrivateThread = async (post: CommunityPost) => {
    if (!uid || !post.id) return;

    try {
      const postAuthorUid = String(post.authorUid || "").trim();
      let targetUid = postAuthorUid;
      const authorNameKey = normalizeAuthorName(String(post.authorName || ""));
      if (authorNameKey) {
        const byNameSnap = await getDocs(
          query(collection(db, "community_users"), where("nicknameKey", "==", authorNameKey), limit(5))
        ).catch(() => null);
        const candidates = (byNameSnap?.docs || [])
          .map((d) => String((d.data() as any)?.uid || d.id || "").trim())
          .filter((id) => !!id && id !== uid);
        if (candidates.length === 1) {
          // If nickname resolves uniquely, prefer the resolved uid (handles anonymous uid rotation).
          targetUid = candidates[0];
        } else if (candidates.length > 1) {
          // Prefer the post's author uid if it still matches a resolved profile; otherwise keep post uid.
          if (postAuthorUid && candidates.includes(postAuthorUid)) {
            targetUid = postAuthorUid;
          }
        }
      }

      // If anonymous UIDs rotated, an older thread may already exist for this post.
      // Prefer an existing thread for this post that includes the current user.
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
        if (merged.length) {
          merged.sort((a, b) => {
            const aMs = Number((a.data() as any)?.lastMessageAt?.toMillis?.() || 0);
            const bMs = Number((b.data() as any)?.lastMessageAt?.toMillis?.() || 0);
            return bMs - aMs;
          });
          const bestId = merged[0].id;
          router.push(`/community/thread/${bestId}` as any);
          return;
        }
      } catch {
        // fall through to deterministic thread id
      }

      if (!targetUid) {
        Alert.alert("Info", i18n.t("community.private_unavailable"));
        return;
      }
      if (targetUid === uid) {
        Alert.alert("Info", i18n.t("community.private_unavailable"));
        return;
      }

      const [userA, userB] = [uid, targetUid].sort();
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
    const freshTarget = `${target}${target.includes("?") ? "&" : "?"}_open=${Date.now()}`;
    try {
      if (!/^https?:\/\//i.test(target)) {
        throw new Error("invalid_url_scheme");
      }
      const canOpen = await Linking.canOpenURL(freshTarget);
      if (!canOpen) {
        throw new Error("cannot_open_url");
      }
      await Linking.openURL(freshTarget);
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
    await AsyncStorage.setItem(communityAcceptedTermsKey, "1");
    setPrivacyAccepted(true);
  };

  const requestDeleteAllData = () => {
    setSettingsMenuOpen(false);
    if (deletingAccount) return;
    Alert.alert(
      settingsCopy.confirmTitle,
      settingsCopy.confirmBody,
      [
        { text: i18n.t("buttons.cancel"), style: "cancel" },
        {
          text: settingsCopy.continueButton,
          style: "destructive",
          onPress: () => {
            Alert.alert(settingsCopy.finalTitle, settingsCopy.finalBody, [
              { text: i18n.t("buttons.cancel"), style: "cancel" },
              {
                text: settingsCopy.finalConfirm,
                style: "destructive",
                onPress: async () => {
                  try {
                    setDeletingAccount(true);
                    await deleteCurrentAccountAndData();
                    Alert.alert(settingsCopy.successTitle, settingsCopy.successBody);
                    router.replace("/language" as any);
                  } catch (e: any) {
                    const msg = String(e?.message || "").trim();
                    Alert.alert(settingsCopy.failedTitle, msg || settingsCopy.failedBody);
                  } finally {
                    setDeletingAccount(false);
                  }
                },
              },
            ]);
          },
        },
      ]
    );
  };

  if (!bootReady) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.bootText}>Loading Community…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (bootError) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.nickTitle}>Community unavailable</Text>
          <Text style={styles.nickSubtitle}>{bootError}</Text>
          <Pressable style={styles.nickBtn} onPress={retryBoot}>
            <Text style={styles.nickBtnText}>Retry</Text>
          </Pressable>
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
          {chatsOnly ? (
            <View style={styles.chatHeaderInline}>
              <Text style={styles.chatHeaderGlobe}>🌍</Text>
              <Text style={styles.chatHeaderTitle} numberOfLines={1}>
                Endyia Chat
                {totalUnreadThreads > 0 ? `  🔴${totalUnreadThreads}` : ""}
              </Text>
            </View>
          ) : (
            <Text style={styles.header}>
              {i18n.t("community.center_title")}
              {totalUnreadThreads > 0 ? `  🔴${totalUnreadThreads}` : ""}
            </Text>
          )}
          <Pressable
            style={styles.settingsMenuBtn}
            onPress={() => setSettingsMenuOpen((v) => !v)}
            disabled={deletingAccount}
          >
            <MaterialCommunityIcons name="menu" size={20} color="#8f8f8f" />
          </Pressable>
        </View>
        {settingsMenuOpen ? (
          <>
            <Pressable style={styles.settingsBackdrop} onPress={() => setSettingsMenuOpen(false)} />
            <View style={styles.settingsMenuCard}>
              <Text style={styles.settingsMenuTitle}>{settingsCopy.menuTitle}</Text>
              <Pressable style={styles.settingsMenuDangerItem} onPress={requestDeleteAllData}>
                <Text style={styles.settingsMenuDangerText}>{settingsCopy.deleteItem}</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          keyboardShouldPersistTaps="handled"
        >
          {chatsOnly ? (
            <View style={styles.threadSection}>
              <Text style={styles.threadSectionTitle}>{i18n.t("community.last_private_chats")}</Text>
              {privateThreads.length ? (
                privateThreads.map((thread) => {
                  const relatedPost = posts.find((p) => p.id === thread.basedOnPostId);
                  const thumb = getCardImage(relatedPost?.cardId);
                  const labelBase =
                    relatedPost?.authorName ||
                    relatedPost?.question ||
                    relatedPost?.journalText ||
                    thread.otherUid;
                  const label = String(labelBase || thread.otherUid).slice(0, 44);
                  return (
                    <View key={thread.id} style={styles.threadRowOuter}>
                      <Pressable
                        style={styles.threadRowMain}
                        onPress={() => router.push(`/community/thread/${thread.id}` as any)}
                      >
                        {thumb ? <Image source={thumb} style={styles.threadThumb} resizeMode="contain" /> : null}
                        <View style={styles.threadRowLabelWrap}>
                          <Text style={styles.threadRowText} numberOfLines={1}>
                            {label}
                          </Text>
                        </View>
                        <View style={styles.threadMetaWrap}>
                          {thread.unread ? <Text style={styles.threadUnreadDot}>●</Text> : null}
                        </View>
                      </Pressable>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.threadSectionEmpty}>{i18n.t("community.last_private_chats_empty")}</Text>
              )}
            </View>
          ) : null}
          {!chatsOnly
            ? posts.map((post) => {
            const isOwn = isOwnPost(post);
            const postCreatedAtMs = getPostCreatedAtMs(post);
            const seenAtMs = Number(seenPostIds[post.id] || 0);
            const isNewFeedPost = !isOwn && postCreatedAtMs > 0 && postCreatedAtMs > seenAtMs;
            const image = getCardImage(post.cardId);
            return (
              <View
                key={post.id}
                style={[styles.postRow, isOwn ? styles.postRowOwn : styles.postRowOther]}
              >
                <Pressable
                  style={[styles.postCard, isOwn ? styles.postCardOwn : styles.postCardOther]}
                  onPress={() => markFeedPostAsSeen(post)}
                >
                {(unreadByPostId[post.id] || 0) > 0 ? (
                  <View style={styles.postUnreadPill}>
                    <Text style={styles.postUnreadPillText}>● {unreadByPostId[post.id]}</Text>
                  </View>
                ) : null}
                {isNewFeedPost ? (
                  <View style={styles.postNewPill}>
                    <Text style={styles.postNewPillText}>● NEU</Text>
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
                    <Text
                      style={[
                        styles.postText,
                        isOwn ? styles.postTextOwnHighlight : styles.postTextOtherHighlight,
                      ]}
                    >
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
                </Pressable>
              </View>
            );
          })
            : null}
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
  bootText: { color: "#cfdcff", fontSize: 14 },
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
  settingsMenuBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  settingsBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  settingsMenuCard: {
    position: "absolute",
    top: 52,
    right: 12,
    width: 270,
    borderWidth: 1,
    borderColor: "#3c3c3c",
    borderRadius: 10,
    backgroundColor: "#141414",
    padding: 10,
    gap: 8,
    zIndex: 30,
  },
  settingsMenuTitle: { color: "#d7d7d7", fontSize: 12, letterSpacing: 0.4 },
  settingsMenuDangerItem: {
    borderWidth: 1,
    borderColor: "#7a2f2f",
    borderRadius: 8,
    backgroundColor: "#2c1414",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  settingsMenuDangerText: { color: "#ff7f7f", fontSize: 12, lineHeight: 16 },
  header: { flex: 1, color: "#fff", fontSize: 12, textAlign: "center", paddingVertical: 12, letterSpacing: 1 },
  chatHeaderInline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 0,
    paddingHorizontal: 4,
  },
  chatHeaderGlobe: { fontSize: 14 },
  chatHeaderTitle: {
    color: "#fff",
    fontSize: 11,
    letterSpacing: 0.4,
    textAlign: "center",
    flexShrink: 1,
  },
  feed: { flex: 1 },
  feedContent: { padding: 14, gap: 12 },
  threadSection: {
    borderWidth: 1,
    borderColor: "#2f3a52",
    borderRadius: 10,
    backgroundColor: "#101826",
    padding: 10,
    gap: 8,
  },
  threadSectionTitle: { color: "#cfd7ff", fontSize: 11, letterSpacing: 0.8 },
  threadSectionEmpty: { color: "#7a869e", fontSize: 12, lineHeight: 17 },
  threadRowOuter: {
    borderWidth: 1,
    borderColor: "#3d4863",
    borderRadius: 8,
    backgroundColor: "#111c2d",
    flexDirection: "row",
    alignItems: "stretch",
    overflow: "hidden",
  },
  threadRowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 4,
    minWidth: 0,
  },
  threadThumb: {
    width: 72,
    height: 120,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3d4863",
    backgroundColor: "#0c121d",
  },
  threadRowLabelWrap: { flex: 1, minWidth: 0 },
  threadRowText: { color: "#d8def0", fontSize: 12, flex: 1 },
  threadMetaWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  threadUnreadDot: { color: "#ff6b6b", fontSize: 12, marginTop: -1 },
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
  postNewPill: {
    alignSelf: "flex-end",
    backgroundColor: "#d10000",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  postNewPillText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  postCardOwn: { backgroundColor: "#152136", borderColor: "#3b4b66" },
  postCardOther: { backgroundColor: "#111", borderColor: "#303030" },
  postAuthor: { color: "#cfd7ff", fontSize: 11, letterSpacing: 1 },
  postType: { color: "#8fa0bf", fontSize: 10 },
  postQuestion: { color: "#dedede", fontSize: 13, lineHeight: 18 },
  postText: { color: "#c0c0c0", fontSize: 13, lineHeight: 20 },
  postTextOwnHighlight: {
    alignSelf: "flex-start",
    backgroundColor: "#203a58",
    color: "#d7e8ff",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  postTextOtherHighlight: {
    alignSelf: "flex-start",
    backgroundColor: "#6b3d21",
    color: "#f4ddc6",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
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