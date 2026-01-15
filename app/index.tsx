import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tarot App – stabiler Start</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>0 – Der Narr</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>1 – Der Magier</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>2 – Die Hohepriesterin</Text>
      </View>

      <Text style={styles.note}>
        (Statische Liste – keine Imports, keine Assets, kein Router-Stress)
      </Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cardText: {
    fontSize: 18,
  },
  note: {
    marginTop: 24,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
