import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionButton from "../components/ui/QuestionButton";
import { getRandomQuestion } from "../src/data/questions";
import i18n from "../src/i18n";


const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const EDGE_WIDTH = 18;
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 0.35;
const BUTTON_BAR_H = 76;
const RITUAL_FADE_MS = 4000;
const WELCOME_SCALE = 1.12;
const WELCOME_TRANSLATE_Y = -177;
const WELCOME_BTN_MARGIN_TOP = -266;

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

function toRoman(n: number) {
  if (n === 0) return "0";
  if (!Number.isFinite(n) || n < 0) return "";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "";
  let x = Math.floor(n);
  for (const [v, s] of map) {
    while (x >= v) { res += s; x -= v; }
  }
  return res;
}

export default function Index() {
  const [questionOverlayOpen, setQuestionOverlayOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (journalOpen) { setJournalOpen(false); setJournalNote(""); return true; }
      if (activeQuestion) { setActiveQuestion(null); return true; }
      if (questionOverlayOpen) { setQuestionOverlayOpen(false); return true; }
      return false;
    });
    return () => sub.remove();
  }, [activeQuestion, questionOverlayOpen, journalOpen]);

  const cards = useMemo(() => {
    const all = getCards();
    return all.filter((c: any) => String(c?.id) !== "BACK");
  }, []);

  const [index, setIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  const clampIndex = (i: number) => Math.max(0, Math.min(i, cards.length - 1));

  const startRitualTo = (targetIndex: number) => {
    if (locked.current) return;
    if (!cards.length) return;
    const nextIndex = clampIndex(targetIndex);
    if (nextIndex === index) return;
    locked.current = true;
    setIncomingIndex(nextIndex);
    progress.stopAnimation();
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: RITUAL_FADE_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        progress.setValue(0);
        setIncomingIndex(null);
        locked.current = false;
        return;
      }
      setIndex(nextIndex);
      requestAnimationFrame(() => {
        setIncomingIndex(null);
        progress.setValue(0);
        locked.current = false;
      });
    });
  };

  const next = () => startRitualTo(index + 1);
  const prev = () => startRitualTo(index - 1);

  const deckRef = useRef<number[]>([]);
  const deckPosRef = useRef(0);

  const shuffleInPlace = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const rebuildDeck = (excludeIndex?: number) => {
    const arr = Array.from({ length: cards.length }, (_, i) => i);
    const filtered = typeof excludeIndex === "number" ? arr.filter((i) => i !== excludeIndex) : arr;
    shuffleInPlace(filtered);
    deckRef.current = filtered;
    deckPosRef.current = 0;
  };

  const drawUnique = () => {
    if (!cards.length) return;
    if (deckRef.current.length === 0 || deckPosRef.current >= deckRef.current.length) {
      rebuildDeck(index);
    }
    const nextIdx = deckRef.current[deckPosRef.current++];
    startRitualTo(nextIdx);
  };

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gs) => {
        if (locked.current) return false;
        const x0 = evt.nativeEvent.pageX;
        if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;
        const absDx = Math.abs(gs.dx);
        const absDy = Math.abs(gs.dy);
        return absDx > 8 && absDx > absDy + 6;
      },
      onMoveShouldSetPanResponderCapture: (evt, gs) => {
        if (locked.current) return false;
        const x0 = evt.nativeEvent.pageX;
        if (x0 <= EDGE_WIDTH || x0 >= SCREEN_W - EDGE_WIDTH) return false;
        const absDx = Math.abs(gs.dx);
        const absDy = Math.abs(gs.dy);
        return absDx > 8 && absDx > absDy + 6;
      },
      onPanResponderRelease: (_e, gs) => {
        if (locked.current) return;
        const swipeLeft = gs.dx < -SWIPE_DISTANCE || gs.vx < -SWIPE_VELOCITY;
        const swipeRight = gs.dx > SWIPE_DISTANCE || gs.vx > SWIPE_VELOCITY;
        if (swipeLeft) next();
        else if (swipeRight) prev();
      },
    }),
    [cards.length, index]
  );

  const currentCard = cards[index];
  const nextCard = incomingIndex != null ? cards[incomingIndex] : null;

  if (!cards.length || !currentCard) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar hidden />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Cards fehlen / Import stimmt nicht</Text>
          <Text style={styles.errorText}>Prüfe: src/data/cards.ts export (default oder named)</Text>
        </View>
      </SafeAreaView>
    );
  }

  const outgoingOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const incomingOpacity = progress;

  const displayPrefix = (card: any) => {
    const id = String(card?.id ?? "");
    if (/^\d+$/.test(id)) return toRoman(Number(id));
    if (id.startsWith("W")) return id.slice(1);
    return "";
  };

  const currentPrefix = displayPrefix(currentCard);
  const nextPrefix = nextCard ? displayPrefix(nextCard) : "";
  const currentId = String((currentCard as any).id ?? index);

  const currentName = i18n.t(`cards.${currentId}`, {
    defaultValue: (currentCard as any).name ?? "Unbenannt",
  });

  const nextId = nextCard ? String((nextCard as any).id ?? incomingIndex) : "";
  const nextName = nextCard
    ? i18n.t(`cards.${nextId}`, { defaultValue: (nextCard as any).name ?? "Unbenannt" })
    : "";

  const currentSource = (currentCard as any).image;
  const nextSource = nextCard ? (nextCard as any).image : null;

  const saveJournalEntry = async () => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      cardId: currentId,
      cardTitle: currentName,
      lang: i18n.locale,
      question: activeQuestion ?? "",
      note: journalNote,
    };
    const existing = await AsyncStorage.getItem("journal_entries");
    const entries = existing ? JSON.parse(existing) : [];
    entries.unshift(entry);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(entries));
    setJournalNote("");
    setJournalOpen(false);
    setActiveQuestion(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar hidden />
      <View style={styles.container}>

        {/* WELCOME OVERLAY */}
        {showWelcome ? (
          <View style={styles.welcomeOverlay}>
            <Image
              source={require("../assets/images/cards/Rueckseite.jpg")}
              style={{
                width: "100%",
                height: "100%",
                transform: [{ scale: WELCOME_SCALE }, { translateY: WELCOME_TRANSLATE_Y }],
              }}
              resizeMode="contain"
            />
            <Pressable
              style={[styles.welcomeBtn, { marginTop: WELCOME_BTN_MARGIN_TOP }]}
              onPress={() => {
                if (cards.length > 1) {
                  let r = index;
                  while (r === index) r = Math.floor(Math.random() * cards.length);
                  setIndex(r);
                  rebuildDeck(r);
                } else {
                  rebuildDeck(index);
                }
                setShowWelcome(false);
              }}
            >
              <Text style={styles.welcomeBtnText}>{i18n.t("buttons.draw_welcome")}</Text>
            </Pressable>
          </View>
        ) : null}

        {/* SWIPE AREA */}
        <View style={styles.swipeArea} {...panResponder.panHandlers}>

          {/* IMAGE BOX */}
          <View style={styles.imageBox}>
            {nextSource ? (
              <Animated.Image
                source={nextSource}
                style={[styles.imageAbs, { opacity: incomingOpacity }]}
                resizeMode="contain"
              />
            ) : null}
            <Animated.Image
              source={currentSource}
              style={[styles.imageAbs, { opacity: outgoingOpacity }]}
              resizeMode="contain"
            />
            {(questionOverlayOpen || activeQuestion !== null) && (
              <BlurView
                intensity={10}
                tint="default"
                experimentalBlurMethod="dimezisBlurView"
                style={styles.blurAbs}
                pointerEvents="none"
              />
            )}
          </View>

          {/* FRAGE TEXT */}
          {activeQuestion ? (
            <View style={styles.questionOnCardWrap}>
              <Text style={styles.questionOnCardText}>{activeQuestion}</Text>
              <View style={styles.questionBtnRow}>
                <Pressable
                  onPress={() => {
                    setActiveQuestion(null);
                    setQuestionOverlayOpen(true);
                  }}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>✦ {i18n.t("buttons.question")}</Text>
                </Pressable>
                <Pressable onPress={() => setActiveQuestion(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕ {i18n.t("buttons.close")}</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setJournalOpen(true)}
                style={[styles.closeBtn, { marginTop: 10 }]}
              >
                <Text style={styles.closeBtnText}>✍️ {i18n.t("buttons.journal")}</Text>
              </Pressable>
            </View>
          ) : null}

          {/* TITEL */}
          <View style={styles.titleWrap}>
            {nextCard ? (
              <Animated.Text style={[styles.title, { opacity: incomingOpacity }]} numberOfLines={2}>
                {nextPrefix} · {nextName}
              </Animated.Text>
            ) : null}
            <Animated.Text
              style={[styles.title, { opacity: outgoingOpacity, position: "absolute" }]}
              numberOfLines={2}
            >
              {currentPrefix} · {currentName}
            </Animated.Text>
          </View>

        </View>

        {/* DEUTUNG + ZIEH */}
        <View style={styles.buttonBar}>
          <Pressable style={styles.btn} onPress={() => router.push(`/meaning/${currentId}` as any)}>
            <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>{i18n.t("buttons.meaning")}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={drawUnique}>
            <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>{i18n.t("buttons.draw")}</Text>
          </Pressable>
        </View>

        {/* FRAGE BUTTON */}
        <View style={styles.questionBar}>
          <QuestionButton onPress={() => setQuestionOverlayOpen(true)} />
        </View>

        {/* TIEFEN OVERLAY */}
        {questionOverlayOpen && (
          <View style={styles.overlayRoot}>
            <Pressable style={styles.backdrop} onPress={() => setQuestionOverlayOpen(false)} />
            <View style={styles.overlayPanel} onStartShouldSetResponder={() => true}>
              <Pressable
                style={styles.depthBtn}
                onPress={() => {
                  const q = getRandomQuestion(currentId, "sanft", i18n.locale);
                  setActiveQuestion(q);
                  setQuestionOverlayOpen(false);
                }}
              >
                <Text style={styles.depthText}>{i18n.t("buttons.soft")}</Text>
              </Pressable>
              <Pressable
                style={styles.depthBtn}
                onPress={() => {
                  const q = getRandomQuestion(currentId, "tief", i18n.locale);
                  setActiveQuestion(q);
                  setQuestionOverlayOpen(false);
                }}
              >
                <Text style={styles.depthText}>{i18n.t("buttons.deep")}</Text>
              </Pressable>
              <Pressable
                style={styles.depthBtn}
                onPress={() => {
                  const q = getRandomQuestion(currentId, "existenziell", i18n.locale);
                  setActiveQuestion(q);
                  setQuestionOverlayOpen(false);
                }}
              >
                <Text style={styles.depthText}>{i18n.t("buttons.existential")}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* JOURNAL MODAL */}
        {journalOpen && (
          <View style={styles.journalOverlay}>
            <View style={styles.journalHeader}>
              <Text style={styles.journalTitle}>✍️ {i18n.t("buttons.journal")}</Text>
              <Text style={styles.journalCard}>{currentName}</Text>
              <Text style={styles.journalQuestion}>{activeQuestion ?? ""}</Text>
            </View>
            <TextInput
              style={styles.journalInput}
              multiline
              placeholder="..."
              placeholderTextColor="#666"
              value={journalNote}
              onChangeText={setJournalNote}
              textAlignVertical="top"
              autoFocus={true}
              scrollEnabled={true}
            />
            <View style={styles.journalButtons}>
              <Pressable style={styles.closeBtn} onPress={saveJournalEntry}>
                <Text style={styles.closeBtnText}>💾 Speichern</Text>
              </Pressable>
              <Pressable
                style={styles.closeBtn}
                onPress={() => { setJournalOpen(false); setJournalNote(""); }}
              >
                <Text style={styles.closeBtnText}>✕ {i18n.t("buttons.close")}</Text>
              </Pressable>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  questionOnCardWrap: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 400,
    alignItems: "center",
  },
  questionBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  questionOnCardText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1 },
  swipeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: BUTTON_BAR_H + 120,
  },
  imageBox: {
    width: "100%",
    height: SCREEN_H * 0.68,
  },
  imageAbs: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  blurAbs: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  titleWrap: {
    marginTop: -1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  title: {
    marginTop: 0,
    fontSize: 17,
    lineHeight: 20,
    color: "#888",
    letterSpacing: 1,
    textAlign: "center",
  },
  buttonBar: {
    position: "absolute",
    left: -17,
    right: 0,
    bottom: 125,
    height: 55,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 999,
    elevation: 999,
  },
  questionBar: {
    position: "absolute",
    left: 41,
    right: 41,
    bottom: 70,
    zIndex: 999,
    elevation: 999,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  btnText: { color: "#888", fontSize: 13, letterSpacing: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorTitle: { color: "#fff", fontSize: 16, marginBottom: 10, textAlign: "center" },
  errorText: { color: "#bbb", fontSize: 13, paddingHorizontal: 20, textAlign: "center" },
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5000,
    elevation: 5000,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  overlayPanel: {
    width: "86%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(20,20,20,0.92)",
  },
  depthBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginTop: 10,
  },
  depthText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#05050A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  welcomeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(180,180,255,0.6)",
    backgroundColor: "rgba(40,40,80,0.6)",
  },
  welcomeBtnText: { color: "#eaeaff", letterSpacing: 1.4, fontWeight: "700" },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  closeBtnText: {
    color: "#dbd6d6",
    fontSize: 10,
    textAlign: "center",
  },
  journalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#111",
    zIndex: 6000,
    elevation: 6000,
    flexDirection: "column",
    padding: 0,
  },
  journalHeader: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#111",
  },
  journalTitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 4,
  },
  journalCard: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  journalQuestion: {
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
  },
  journalInput: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 15,
    padding: 20,
    textAlignVertical: "top",
  },
  journalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    padding: 20,
    backgroundColor: "#111",
  },
});