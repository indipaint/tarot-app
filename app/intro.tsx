import { Audio, ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../src/i18n";

const INTRO_DONE_ONCE_KEY = "__intro_done_once";
const AGE_VERIFIED_KEY = "age_verified_v1";
const AGE_DENIED_KEY = "age_denied_v1";
const AGE_GATE_COPY: Record<
  "de" | "en" | "fr" | "es" | "pt",
  {
    title: string;
    body: string;
    checkAdult: string;
    checkResidence: string;
    confirm: string;
    thanks: string;
    deny: string;
    blocked: string;
    blockedTitle: string;
    blockedButton: string;
    closeHintTitle: string;
    closeHintBody: string;
  }
> = {
  de: {
    title: "Willkommen bei ENDYIA",
    body: "Diese App ist ein Raum für Selbstergründung und Reflexion. Um die Community und den KI-Coach nutzen zu können, musst du mindestens 18 Jahre alt sein.",
    checkAdult: "Ich bin mindestens 18 Jahre alt.",
    checkResidence: "Ich bestätige, dass ich nach dem Recht meines Wohnsitzlandes volljährig bin.",
    confirm: "Ich bin volljährig & akzeptiere",
    thanks: "Danke für deine ehrlichen Angaben! Willkommen in einem Raum für achtsame Reflexion.",
    deny: "Ich bin nicht volljährig",
    blockedTitle: "Vielen Dank für deine Ehrlichkeit!",
    blocked:
      "Noch ein wenig Geduld...\n\nENDYIA ist ein Raum, der speziell für die Themen und die Verantwortung des Erwachsenenlebens geschaffen wurde.\nLeider ist die Nutzung von ENDYIA erst ab der Volljährigkeit gestattet.\n\nWir nehmen den Schutz unserer jüngeren Besucher sehr ernst. Aktuell können wir dich daher leider noch nicht begleiten. Wir freuen uns aber sehr darauf, dich hier willkommen zu heißen, sobald du volljährig bist!\n\nAlles Gute auf deinem Weg.\n\nBis bald, wir freuen uns auf dich!",
    blockedButton: "Alles klar, bis dann!",
    closeHintTitle: "Du kannst die App jetzt schließen.",
    closeHintBody: "Wische zum Home-Bildschirm oder öffne den App-Switcher und schließe ENDYIA dort.",
  },
  en: {
    title: "Welcome to ENDYIA",
    body: "This app is a space for self-exploration and reflection. To use the community and AI coach, you must be at least 18 years old.",
    checkAdult: "I am at least 18 years old.",
    checkResidence: "I confirm that I am legally of age in my country of residence.",
    confirm: "I am of legal age & accept",
    thanks: "Thank you for your honest information! Welcome to a space for mindful reflection.",
    deny: "I am not of legal age",
    blocked:
      "Just a little more patience...\n\nENDYIA is a space created specifically for the themes and responsibilities of adult life.\nUnfortunately, using ENDYIA is only permitted once you are of legal age.\n\nWe take the protection of our younger visitors very seriously. For now, we are unfortunately not able to accompany you yet. But we are truly looking forward to welcoming you here as soon as you come of age!\n\nWishing you all the best on your journey.\n\nSee you soon - we look forward to meeting you!",
    blockedTitle: "Thank you for your honesty!",
    blockedButton: "Alright, see you then!",
    closeHintTitle: "You can close the app now.",
    closeHintBody: "Swipe to the Home Screen or open the App Switcher and close ENDYIA there.",
  },
  fr: {
    title: "Bienvenue sur ENDYIA",
    body: "Cette application est un espace d'exploration de soi et de réflexion. Pour utiliser la communauté et le coach IA, vous devez avoir au moins 18 ans.",
    checkAdult: "J'ai au moins 18 ans.",
    checkResidence: "Je confirme que je suis majeur(e) selon le droit de mon pays de résidence.",
    confirm: "Je suis majeur(e) & j'accepte",
    thanks: "Merci pour vos informations sincères ! Bienvenue dans un espace de réflexion consciente.",
    deny: "Je ne suis pas majeur(e)",
    blocked:
      "Encore un peu de patience...\n\nENDYIA est un espace créé spécialement pour les thèmes et les responsabilités de la vie adulte.\nMalheureusement, l'utilisation d'ENDYIA n'est autorisée qu'à partir de la majorité.\n\nNous prenons la protection de nos jeunes visiteurs très au sérieux. Pour le moment, nous ne pouvons malheureusement pas encore t'accompagner. Mais nous avons hâte de t'accueillir ici dès que tu seras majeur(e) !\n\nNous te souhaitons le meilleur pour ton parcours.\n\nÀ très bientôt, nous nous réjouissons de t'accueillir !",
    blockedTitle: "Merci pour ton honnêteté !",
    blockedButton: "D'accord, à bientôt !",
    closeHintTitle: "Tu peux maintenant fermer l'application.",
    closeHintBody: "Fais glisser vers l'écran d'accueil ou ouvre le sélecteur d'apps et ferme ENDYIA depuis là.",
  },
  es: {
    title: "Bienvenido a ENDYIA",
    body: "Esta app es un espacio para la autoexploración y la reflexión. Para usar la comunidad y el coach de IA, debes tener al menos 18 años.",
    checkAdult: "Tengo al menos 18 años.",
    checkResidence: "Confirmo que soy mayor de edad según la ley de mi país de residencia.",
    confirm: "Soy mayor de edad y acepto",
    thanks: "¡Gracias por tus datos honestos! Bienvenido a un espacio de reflexión consciente.",
    deny: "No soy mayor de edad",
    blocked:
      "Solo un poco más de paciencia...\n\nENDYIA es un espacio creado especialmente para los temas y las responsabilidades de la vida adulta.\nLamentablemente, el uso de ENDYIA solo está permitido a partir de la mayoría de edad.\n\nNos tomamos muy en serio la protección de nuestros visitantes más jóvenes. Por ahora, lamentablemente, aún no podemos acompañarte. Pero estamos deseando darte la bienvenida aquí en cuanto seas mayor de edad.\n\nTe deseamos todo lo mejor en tu camino.\n\nHasta pronto, ¡estaremos encantados de recibirte!",
    blockedTitle: "¡Gracias por tu honestidad!",
    blockedButton: "Está bien, ¡hasta luego!",
    closeHintTitle: "Ahora puedes cerrar la app.",
    closeHintBody: "Desliza a la pantalla de inicio o abre el selector de apps y cierra ENDYIA desde allí.",
  },
  pt: {
    title: "Bem-vindo ao ENDYIA",
    body: "Esta app é um espaço para autoexploração e reflexão. Para usar a comunidade e o coach de IA, tens de ter pelo menos 18 anos.",
    checkAdult: "Tenho pelo menos 18 anos.",
    checkResidence: "Confirmo que sou maior de idade segundo a lei do meu país de residência.",
    confirm: "Sou maior de idade e aceito",
    thanks: "Obrigado pelas tuas informações honestas! Bem-vindo a um espaço de reflexão consciente.",
    deny: "Não sou maior de idade",
    blocked:
      "Só mais um pouco de paciência...\n\nENDYIA é um espaço criado especialmente para os temas e as responsabilidades da vida adulta.\nInfelizmente, a utilização do ENDYIA só é permitida a partir da maioridade.\n\nLevamos muito a sério a proteção dos nossos visitantes mais jovens. Neste momento, infelizmente, ainda não te podemos acompanhar. Mas estamos muito felizes por te receber aqui assim que fores maior de idade!\n\nDesejamos-te tudo de bom no teu caminho.\n\nAté breve, ficamos à tua espera!",
    blockedTitle: "Obrigado pela tua honestidade!",
    blockedButton: "Tudo bem, até já!",
    closeHintTitle: "Agora podes fechar a app.",
    closeHintBody: "Desliza para o ecrã principal ou abre o seletor de apps e fecha a ENDYIA por lá.",
  },
};

const normalizeLang = (value?: string): "de" | "en" | "fr" | "es" | "pt" => {
  const lang = String(value || "").toLowerCase().split("-")[0];
  if (lang === "en" || lang === "fr" || lang === "es" || lang === "pt") return lang;
  return "de";
};

export default function Intro() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [ageCheckReady, setAgeCheckReady] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [isAdultChecked, setIsAdultChecked] = useState(false);
  const [isResidenceChecked, setIsResidenceChecked] = useState(false);
  const [ageDenied, setAgeDenied] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showIosCloseHint, setShowIosCloseHint] = useState(false);
  const [ageTransitioning, setAgeTransitioning] = useState(false);
  const localeCode = normalizeLang(i18n.locale);
  const ageCopy = AGE_GATE_COPY[localeCode];
  const ageGateOpacity = useRef(new Animated.Value(1)).current;
  const ageThanksOpacity = useRef(new Animated.Value(0)).current;

  // Schwarzer Curtain gegen White-Flash
  const curtain = useRef(new Animated.Value(0)).current;
  const curtainStarted = useRef(false);
  const navigated = useRef(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedVerified, storedDenied] = await Promise.all([
          AsyncStorage.getItem(AGE_VERIFIED_KEY),
          AsyncStorage.getItem(AGE_DENIED_KEY),
        ]);
        if (cancelled) return;
        if (storedVerified === "1") {
          setAgeVerified(true);
        } else if (storedDenied === "1") {
          setShowBlockedModal(true);
        }
      } finally {
        if (!cancelled) setAgeCheckReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const acceptAgeGate = async () => {
    if (!isAdultChecked || !isResidenceChecked || ageTransitioning) return;
    await AsyncStorage.setItem(AGE_VERIFIED_KEY, "1");
    await AsyncStorage.removeItem(AGE_DENIED_KEY);
    setAgeTransitioning(true);
    setAgeDenied(false);
    setShowBlockedModal(false);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ageGateOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(ageThanksOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(4300),
      Animated.timing(ageThanksOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAgeVerified(true);
      setAgeTransitioning(false);
    });
  };

  const resetAgeGateDebug = async () => {
    await AsyncStorage.multiRemove([AGE_VERIFIED_KEY, AGE_DENIED_KEY, INTRO_DONE_ONCE_KEY]);
    curtainStarted.current = false;
    navigated.current = false;
    ageGateOpacity.stopAnimation();
    ageGateOpacity.setValue(1);
    ageThanksOpacity.stopAnimation();
    ageThanksOpacity.setValue(0);
    setAgeCheckReady(true);
    setAgeVerified(false);
    setAgeTransitioning(false);
    setAgeDenied(false);
    setShowBlockedModal(false);
    setShowIosCloseHint(false);
    setIsAdultChecked(false);
    setIsResidenceChecked(false);
  };

  const startCurtainAndNavigate = () => {
    if (curtainStarted.current) return;
    curtainStarted.current = true;

    curtain.stopAnimation();
    curtain.setValue(0);

    Animated.timing(curtain, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (navigated.current) return;
      navigated.current = true;
      AsyncStorage.setItem(INTRO_DONE_ONCE_KEY, "1").catch(() => {});
      requestAnimationFrame(() => router.replace("/"));
    });
  };

  if (!ageCheckReady) {
    return <View style={styles.stage} />;
  }

  if (!ageVerified) {
    return (
      <SafeAreaView style={styles.ageGateRoot} edges={["top", "bottom"]}>
        <StatusBar hidden />
        <ScrollView
          style={styles.ageGateScroll}
          contentContainerStyle={styles.ageGateScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[styles.ageGateCard, { opacity: ageGateOpacity }]}
            pointerEvents={ageTransitioning ? "none" : "auto"}
          >
            <Text style={styles.ageGateTitle}>{ageCopy.title}</Text>
            <Text style={styles.ageGateBody}>{ageCopy.body}</Text>

            <Pressable
              style={styles.ageGateCheckRow}
              onPress={() => {
                setIsAdultChecked((v) => !v);
                if (ageDenied) setAgeDenied(false);
              }}
            >
              <Text style={styles.ageGateCheckBox}>{isAdultChecked ? "☑" : "☐"}</Text>
              <Text style={styles.ageGateCheckText}>{ageCopy.checkAdult}</Text>
            </Pressable>

            <Pressable
              style={styles.ageGateCheckRow}
              onPress={() => {
                setIsResidenceChecked((v) => !v);
                if (ageDenied) setAgeDenied(false);
              }}
            >
              <Text style={styles.ageGateCheckBox}>{isResidenceChecked ? "☑" : "☐"}</Text>
              <Text style={styles.ageGateCheckText}>{ageCopy.checkResidence}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.ageGateBtn,
                !isAdultChecked || !isResidenceChecked ? styles.ageGateBtnDisabled : null,
              ]}
              disabled={!isAdultChecked || !isResidenceChecked}
              onPress={acceptAgeGate}
            >
              <Text style={styles.ageGateBtnText}>{ageCopy.confirm}</Text>
            </Pressable>

            <Pressable
              style={[styles.ageGateBtn, styles.ageGateDenyBtn]}
              onPress={async () => {
                setAgeDenied(true);
                setIsAdultChecked(false);
                setIsResidenceChecked(false);
                setShowIosCloseHint(false);
                setShowBlockedModal(true);
                await AsyncStorage.setItem(AGE_DENIED_KEY, "1");
              }}
            >
              <Text style={styles.ageGateBtnText}>{ageCopy.deny}</Text>
            </Pressable>
            {__DEV__ ? (
              <Pressable style={[styles.ageGateBtn, styles.debugResetBtn]} onPress={resetAgeGateDebug}>
                <Text style={styles.debugResetBtnText}>AgeGate Reset (Dev)</Text>
              </Pressable>
            ) : null}
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.ageThanksOverlay, { opacity: ageThanksOpacity }]}
          >
            <Text style={styles.ageThanksText}>{ageCopy.thanks}</Text>
          </Animated.View>
          {showBlockedModal ? (
            <View style={styles.blockedOverlay}>
              <View style={styles.blockedCard}>
                <Text style={styles.blockedTitle}>{ageCopy.blockedTitle}</Text>
                <ScrollView
                  style={styles.blockedBodyScroll}
                  contentContainerStyle={styles.blockedBodyContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.blockedBody}>{ageCopy.blocked}</Text>
                </ScrollView>
                <Pressable
                  style={[styles.ageGateBtn, styles.blockedOkBtn]}
                  onPress={() => {
                    if (Platform.OS === "ios") {
                      setShowBlockedModal(false);
                      setShowIosCloseHint(true);
                      return;
                    }
                    BackHandler.exitApp();
                  }}
                >
                  <Text style={styles.ageGateBtnText}>{ageCopy.blockedButton}</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
          {showIosCloseHint ? (
            <View style={styles.blockedOverlay}>
              <View style={styles.blockedCard}>
                <Text style={styles.blockedTitle}>{ageCopy.closeHintTitle}</Text>
                <Text style={styles.iosCloseHintBody}>{ageCopy.closeHintBody}</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.stage}>
      <StatusBar hidden />

      <Video
        ref={videoRef}
        source={require("../assets/images/intro/intro.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        progressUpdateIntervalMillis={100}
        onPlaybackStatusUpdate={(status) => {
          if (!status.isLoaded) return;

          const dur = status.durationMillis ?? 0;
          const pos = status.positionMillis ?? 0;
          if (dur > 0 && dur - pos <= 200) {
            startCurtainAndNavigate();
            return;
          }

          if (status.didJustFinish) {
            startCurtainAndNavigate();
          }
        }}
      />

      <Animated.View
        pointerEvents="none"
        style={[styles.curtain, { opacity: curtain }]}
      />
      {__DEV__ ? (
        <Pressable style={styles.devFloatingReset} onPress={resetAgeGateDebug}>
          <Text style={styles.debugResetBtnText}>AgeGate Reset (Dev)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    backgroundColor: "#000",
  },
  curtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  ageGateRoot: {
    flex: 1,
    backgroundColor: "#05050a",
  },
  ageGateScroll: {
    flex: 1,
  },
  ageGateScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
  },
  ageGateCard: {
    width: "100%",
    maxWidth: 460,
    padding: 10,
    gap: 10,
  },
  ageGateTitle: { color: "#fff", fontSize: 18, textAlign: "left", marginBottom: 2 },
  ageGateBody: { color: "#cfcfcf", fontSize: 13, textAlign: "left", lineHeight: 18 },
  ageGateCheckRow: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 2 },
  ageGateCheckBox: { color: "#fff", fontSize: 18 },
  ageGateCheckText: { flex: 1, color: "#ddd", fontSize: 13, lineHeight: 18 },
  ageGateBtn: {
    borderWidth: 1,
    borderColor: "#5f73a8",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b3b72",
  },
  ageGateBtnDisabled: { opacity: 0.45 },
  ageGateDenyBtn: { borderColor: "#6a2f2f", backgroundColor: "#3a1c1c" },
  ageGateBtnText: { color: "#f2f2f2", fontSize: 13, fontWeight: "600" },
  debugResetBtn: { borderColor: "#3f566f", backgroundColor: "#1d2a37" },
  debugResetBtnText: { color: "#d6e4f2", fontSize: 12, fontWeight: "600" },
  devFloatingReset: {
    position: "absolute",
    right: 12,
    top: 52,
    borderWidth: 1,
    borderColor: "#3f566f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "rgba(29,42,55,0.9)",
  },
  ageGateBlocked: { color: "#ffb2b2", fontSize: 12, textAlign: "center", lineHeight: 17 },
  ageThanksOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ageThanksText: {
    color: "#f2f2f2",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4c5d87",
    backgroundColor: "rgba(18,26,44,0.94)",
  },
  blockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  blockedCard: {
    width: "100%",
    maxWidth: 460,
    maxHeight: "84%",
    borderWidth: 1,
    borderColor: "#4d4d4d",
    borderRadius: 12,
    backgroundColor: "#141414",
    padding: 14,
    gap: 10,
  },
  blockedTitle: { color: "#fff", fontSize: 17, textAlign: "center", lineHeight: 23 },
  blockedBodyScroll: { maxHeight: 360 },
  blockedBodyContent: { paddingBottom: 2 },
  blockedBody: { color: "#ddd", fontSize: 13, lineHeight: 20, textAlign: "left" },
  blockedOkBtn: { marginTop: 2 },
  iosCloseHintBody: { color: "#ddd", fontSize: 13, lineHeight: 20, textAlign: "center" },
});
