import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import cards from "../src/data/cards";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tarot App</Text>

      {cards.map((card) => (
        <Pressable
          key={card.id}
          style={styles.card}
          onPress={() => console.log("Karte gedrückt:", card.id)}
        >
          <Text style={styles.cardText}>
            {card.id} – {card.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cardText: {
    fontSize: 18,
  },
});
