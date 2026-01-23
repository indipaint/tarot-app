import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { getMeaningById } from "../../data/meanings";

export default function MeaningScreen() {
  const { id } = useLocalSearchParams();
  const meaning = getMeaningById(id as any);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Deutung</Text>

      {!meaning ? (
        <Text>Keine Deutung gefunden für ID: {String(id)}</Text>
      ) : (
        <Text>{meaning.general}</Text>
      )}
    </View>
  );
}
