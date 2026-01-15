import { Image, StatusBar, StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* StatusBar komplett aus */}
      <StatusBar hidden />

      <Image
        source={require("../assets/cards/5.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingBottom: 176, // dein perfekt eingestellter Wert
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
