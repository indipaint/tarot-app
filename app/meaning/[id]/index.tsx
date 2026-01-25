import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getMeaningById } from "../../../src/data/meanings";

export default function MeaningScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const meaning = getMeaningById(String(id));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Back Button oben */}
      <Pressable onPress={() => router.back()} style={{ marginTop: 24, marginBottom: 12 }}>
        <Text style={{ color: "#888" }}>← Zurück</Text>
      </Pressable>

      {/* Titel */}
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Deutung</Text>

      {/* Inhalt */}
      {!meaning ? (
        <Text>Keine Deutung gefunden für ID: {String(id)}</Text>
      ) : (
        <Text style={{ fontSize: 16, lineHeight: 22 }}>
          {meaning.general}
        </Text>
      )}

      {/* Spacer + Back Button unten rechts */}
      <View style={{ marginTop: 24, marginBottom: 50, alignItems: "flex-end" }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#888" }}>Zurück →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
