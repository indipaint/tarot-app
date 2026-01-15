import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import cards from "../../src/data/cards";

export default function CardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cardId = Number(id);
  const card = cards.find((c) => c.id === cardId);

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Karte nicht gefunden</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{card.name}</Text>
      <Text style={styles.subtitle}>Karten-Nr. {card.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});
