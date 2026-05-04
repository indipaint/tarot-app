import { Asset } from "expo-asset";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { getLegalUrls } from "../src/legal";
import { getBundledLegalModuleId, normalizeLegalLocale } from "../src/legalPageAssets";

export default function LegalDocumentScreen() {
  const params = useLocalSearchParams<{ kind?: string | string[]; locale?: string | string[] }>();
  const rawKind = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const rawLocale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const kind = rawKind === "terms" ? "terms" : "privacy";
  const locale = normalizeLegalLocale(rawLocale);

  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = getBundledLegalModuleId(kind, locale);
        const asset = Asset.fromModule(mod);
        await asset.downloadAsync();
        const next = asset.localUri || asset.uri;
        if (!next) throw new Error("missing_uri");
        if (!cancelled) setUri(next);
      } catch {
        if (!cancelled) setError("load_failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, locale]);

  const title = kind === "privacy" ? "Privacy" : "Terms";
  const remote = getLegalUrls(locale)[kind];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <Stack.Screen options={{ headerShown: true, title, presentation: "modal" }} />
      {error ? (
        <View style={styles.center}>
          <Text style={styles.err}>Could not load the bundled legal page.</Text>
          <Text style={styles.hint}>Public copy (open in browser):</Text>
          <Text style={styles.url} selectable>
            {remote}
          </Text>
        </View>
      ) : !uri ? (
        <View style={styles.center}>
          <ActivityIndicator color="#c7d5ff" />
        </View>
      ) : Platform.OS === "web" ? (
        <View style={styles.webFallback}>
          <Text style={styles.hint}>Web preview:</Text>
          <Pressable onPress={() => void Linking.openURL(remote)}>
            <Text style={styles.link}>{remote}</Text>
          </Pressable>
        </View>
      ) : (
        <WebView source={{ uri }} style={styles.webview} originWhitelist={["*"]} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#111" },
  webview: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  err: { color: "#f88", textAlign: "center", marginBottom: 12 },
  hint: { color: "#aaa", textAlign: "center", marginBottom: 8 },
  url: { color: "#c7d5ff", fontSize: 12 },
  webFallback: { flex: 1, padding: 20, justifyContent: "center" },
  link: { color: "#c7d5ff", textDecorationLine: "underline" },
});
