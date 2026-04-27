import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Animated, Image, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import i18n from "../src/i18n";
import { getLegalUrls } from "../src/legal";

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

function getCards(): any[] {
  const mod = require("../src/data/cards");
  const data = mod?.default ?? mod?.cards ?? mod;
  return Array.isArray(data) ? data : [];
}

function buildJournalShareMessage(entry: JournalEntry): string {
  const cardTitle = String(entry.cardTitle || "").trim();
  const cardId = String(entry.cardId || "").trim();
  const question = String(entry.question || "").trim();
  const note = String(entry.note || "").trim();
  const cardLine = cardId ? `${cardTitle} (${cardId})` : cardTitle;

  return [
    `🃏 ${cardLine || i18n.t("community.post_type_card", { defaultValue: "Card" })}`,
    question ? `\n❓ ${question}` : "",
    note ? `\n📝 ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeLang(value?: string): "de" | "en" | "fr" | "es" | "pt" {
  const lang = String(value || "").toLowerCase().split("-")[0];
  if (lang === "en" || lang === "fr" || lang === "es" || lang === "pt") return lang;
  return "de";
}

const COACH_CONSENT_COPY = {
  de: {
    title: "Live Coach Hinweis",
    line1: "ENDYIA Coach dient der persönlichen Reflexion.",
    line2: "Er ersetzt keine medizinische, psychologische, juristische oder finanzielle Beratung.",
    line3: "Antworten werden automatisiert generiert und können unvollständig oder unzutreffend sein.",
    line4: "ENDYIA Coach übernimmt keine Gewähr für Richtigkeit oder Vollständigkeit.",
    line5: "Bei entsprechenden Anliegen wende dich bitte an qualifizierte Fachpersonen.",
    checkbox: "Ich habe verstanden und stimme zu.",
    terms: "Nutzungsbedingungen öffnen",
    cancel: "Abbrechen",
    confirm: "Ich stimme zu",
  },
  en: {
    title: "Live Coach notice",
    line1: "ENDYIA Coach is intended for personal reflection.",
    line2: "It does not replace medical, psychological, legal, or financial advice.",
    line3: "Responses are generated automatically and may be incomplete or inaccurate.",
    line4: "ENDYIA Coach makes no guarantees regarding accuracy or completeness.",
    line5: "For such matters, please consult qualified professionals.",
    checkbox: "I understand and agree.",
    terms: "Open terms of use",
    cancel: "Cancel",
    confirm: "I agree",
  },
  fr: {
    title: "Information Live Coach",
    line1: "ENDYIA Coach est destiné à la réflexion personnelle.",
    line2: "Il ne remplace pas un avis médical, psychologique, juridique ou financier.",
    line3: "Les réponses sont générées automatiquement et peuvent être incomplètes ou inexactes.",
    line4: "ENDYIA Coach ne garantit pas l'exactitude ni l'exhaustivité.",
    line5: "Pour ces sujets, veuillez consulter des professionnels qualifiés.",
    checkbox: "J'ai compris et j'accepte.",
    terms: "Ouvrir les conditions d'utilisation",
    cancel: "Annuler",
    confirm: "J'accepte",
  },
  es: {
    title: "Aviso Live Coach",
    line1: "ENDYIA Coach está destinado a la reflexión personal.",
    line2: "No sustituye asesoramiento médico, psicológico, legal o financiero.",
    line3: "Las respuestas se generan automáticamente y pueden ser incompletas o inexactas.",
    line4: "ENDYIA Coach no garantiza la exactitud ni la integridad.",
    line5: "Para estos temas, consulta a profesionales cualificados.",
    checkbox: "He entendido y acepto.",
    terms: "Abrir términos de uso",
    cancel: "Cancelar",
    confirm: "Acepto",
  },
  pt: {
    title: "Aviso Live Coach",
    line1: "ENDYIA Coach destina-se à reflexão pessoal.",
    line2: "Nao substitui aconselhamento médico, psicológico, jurídico ou financeiro.",
    line3: "As respostas são geradas automaticamente e podem ser incompletas ou imprecisas.",
    line4: "ENDYIA Coach nao garante a exatidão ou integridade.",
    line5: "Para estes assuntos, consulta profissionais qualificados.",
    checkbox: "Compreendo e aceito.",
    terms: "Abrir termos de uso",
    cancel: "Cancelar",
    confirm: "Aceito",
  },
} as const;

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cards = useMemo(() => getCards(), []);
  const entryCardRefs = React.useRef<Record<string, View | null>>({});
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomValue] = useState(() => new Animated.Value(1));
  const [pinchValue] = useState(() => new Animated.Value(1));
  const [panX] = useState(() => new Animated.Value(0));
  const [panY] = useState(() => new Animated.Value(0));
  const [panEnabled, setPanEnabled] = useState(false);
  const [coachConsentOpen, setCoachConsentOpen] = useState(false);
  const [coachConsentChecked, setCoachConsentChecked] = useState(false);
  const [pendingLiveChatEntryId, setPendingLiveChatEntryId] = useState<string | null>(null);
  const lastZoomRef = React.useRef(1);
  const lastPanXRef = React.useRef(0);
  const lastPanYRef = React.useRef(0);
  const localeCode = normalizeLang(i18n.locale);
  const coachCopy = COACH_CONSENT_COPY[localeCode];
  const coachTermsKey = `coach_terms_v1_${localeCode}`;
  const legalUrls = getLegalUrls(localeCode);

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

  const updateEntryNote = (id: string, note: string) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, note } : e));
      AsyncStorage.setItem("journal_entries", JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const getCardImageSource = (cardId: string): any | undefined => {
    const card = cards.find((c: any) => String(c?.id) === String(cardId));
    return card?.image;
  };

  const getLocalizedCardTitle = (entry: JournalEntry): string => {
    const cardId = String(entry.cardId || "").trim();
    const fallback = String(entry.cardTitle || "").trim() || "Card";
    if (!cardId) return fallback;
    return i18n.t(`cards.${cardId}`, { defaultValue: fallback });
  };

  const getCardShareUri = async (cardId: string): Promise<string | undefined> => {
    const source = getCardImageSource(cardId);
    if (!source) return undefined;
    try {
      const asset = Asset.fromModule(source);
      await asset.downloadAsync();
      return asset.localUri || asset.uri;
    } catch {
      const resolved = Image.resolveAssetSource(source);
      return resolved?.uri;
    }
  };

  const shareEntryWithCard = async (entry: JournalEntry) => {
    const cardRef = entryCardRefs.current[entry.id];
    if (cardRef) {
      try {
        const combinedUri = await captureRef(cardRef, {
          format: "jpg",
          quality: 0.95,
          result: "tmpfile",
          width: 1080,
          height: 1350,
        });
        await Sharing.shareAsync(combinedUri, {
          dialogTitle: entry.cardTitle || "Tarot",
        });
        return;
      } catch {
        // fallback below
      }
    }

    const imageUri = await getCardShareUri(entry.cardId);
    if (imageUri) {
      await Sharing.shareAsync(imageUri, {
        dialogTitle: entry.cardTitle || "Tarot",
      });
      return;
    }
    await Share.share({ message: buildJournalShareMessage(entry) });
  };

  const openTerms = async () => {
    const target = String(legalUrls.terms || "").trim();
    try {
      if (!/^https?:\/\//i.test(target)) throw new Error("invalid_url");
      const canOpen = await Linking.canOpenURL(target);
      if (!canOpen) throw new Error("cannot_open");
      await Linking.openURL(target);
    } catch {
      Alert.alert("Info", target || "URL invalid");
    }
  };

  const openLiveChatWithConsent = async (entryId: string) => {
    const accepted = await AsyncStorage.getItem(coachTermsKey);
    if (accepted === "accepted") {
      router.push({ pathname: "/live-chat", params: { entryId } } as any);
      return;
    }
    setPendingLiveChatEntryId(entryId);
    setCoachConsentChecked(false);
    setCoachConsentOpen(true);
  };

  const acceptCoachConsent = async () => {
    if (!coachConsentChecked) {
      Alert.alert("Info", coachCopy.checkbox);
      return;
    }
    await AsyncStorage.setItem(coachTermsKey, "accepted");
    setCoachConsentOpen(false);
    const entryId = pendingLiveChatEntryId;
    setPendingLiveChatEntryId(null);
    if (entryId) {
      router.push({ pathname: "/live-chat", params: { entryId } } as any);
    }
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
                      <View
                        key={entry.id}
                        ref={(node) => {
                          entryCardRefs.current[entry.id] = node;
                        }}
                        collapsable={false}
                        style={styles.card}
                      >
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{getLocalizedCardTitle(entry)}</Text>
                          <Text style={styles.cardDate}>{entry.date} · {entry.time}</Text>
                        </View>
                        {getCardImageSource(entry.cardId) ? (
                          <Image source={getCardImageSource(entry.cardId)} style={styles.shareCardImage} resizeMode="cover" />
                        ) : null}
                        {entry.question ? (
                          <Text style={styles.cardQuestion}>{entry.question}</Text>
                        ) : null}

                        <TextInput
                          style={styles.cardNoteInput}
                          value={entry.note}
                          onChangeText={(value) => updateEntryNote(entry.id, value)}
                          multiline
                          textAlignVertical="top"
                          placeholder="..."
                          placeholderTextColor="#666"
                        />

                        <View style={styles.cardActions}>
                          <Pressable
                            style={styles.cardBtn}
                            onPress={() => openLiveChatWithConsent(entry.id)}
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

        {coachConsentOpen ? (
          <View style={[styles.consentOverlay, { paddingTop: insets.top + 56 }]}>
            <ScrollView
              style={styles.consentScroll}
              contentContainerStyle={styles.consentScrollContent}
              showsVerticalScrollIndicator={true}
            >
            <View style={styles.consentCard}>
              <Text style={styles.consentTitle}>{coachCopy.title}</Text>
              <Text style={styles.consentBody}>{coachCopy.line1}</Text>
              <Text style={styles.consentBody}>{coachCopy.line2}</Text>
              <Text style={styles.consentBody}>{coachCopy.line3}</Text>
              <Text style={styles.consentBody}>{coachCopy.line4}</Text>
              <Text style={styles.consentBody}>{coachCopy.line5}</Text>

              <Pressable style={styles.consentTermsBtn} onPress={openTerms}>
                <Text style={styles.consentTermsText}>{coachCopy.terms}</Text>
              </Pressable>

              <Pressable
                style={styles.consentCheckboxRow}
                onPress={() => setCoachConsentChecked((v) => !v)}
              >
                <Text style={styles.consentCheckbox}>{coachConsentChecked ? "☑" : "☐"}</Text>
                <Text style={styles.consentCheckboxLabel}>{coachCopy.checkbox}</Text>
              </Pressable>

              <View style={styles.consentActions}>
                <Pressable
                  style={styles.consentActionBtn}
                  onPress={() => {
                    setCoachConsentOpen(false);
                    setPendingLiveChatEntryId(null);
                    setCoachConsentChecked(false);
                  }}
                >
                  <Text style={styles.consentActionText}>{coachCopy.cancel}</Text>
                </Pressable>
                <Pressable style={styles.consentActionBtn} onPress={acceptCoachConsent}>
                  <Text style={styles.consentActionText}>{coachCopy.confirm}</Text>
                </Pressable>
              </View>
            </View>
            </ScrollView>
          </View>
        ) : null}
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
    width: "100%",
    padding: 16, gap: 6, borderWidth: 1, borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 4,
  },
  cardTitle: { color: "#aaa", fontSize: 16, fontWeight: "600", letterSpacing: 1 },
  cardDate: { color: "#777", fontSize: 13 },
  cardQuestion: { color: "#999", fontSize: 14, fontStyle: "italic", marginBottom: 4 },
  shareCardImage: {
    width: 90,
    height: 144,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardNoteInput: {
    backgroundColor: "#222",
    color: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 17,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: "#444",
    minHeight: 90,
    textAlignVertical: "top",
  },
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
  consentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 18,
    zIndex: 10000,
  },
  consentScroll: {
    width: "100%",
  },
  consentScrollContent: {
    paddingBottom: 24,
  },
  consentCard: {
    width: "100%",
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  consentTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 2 },
  consentBody: { color: "#d2d2d2", fontSize: 13, lineHeight: 18 },
  consentTermsBtn: { alignSelf: "flex-start", marginTop: 4 },
  consentTermsText: { color: "#8fa6ff", fontSize: 13, textDecorationLine: "underline" },
  consentCheckboxRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 4 },
  consentCheckbox: { color: "#d8d8d8", fontSize: 16, marginTop: 1 },
  consentCheckboxLabel: { color: "#d8d8d8", fontSize: 13, lineHeight: 18, flex: 1 },
  consentActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 6 },
  consentActionBtn: {
    borderWidth: 1,
    borderColor: "#4a4a4a",
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#202020",
  },
  consentActionText: { color: "#cfcfcf", fontSize: 12 },
});