import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function FanTest() {
  const router = useRouter();

  const goToDeck = () => {
    // Einfach ins Deck, ohne Random, ohne cards-Import
    router.push("/card/0" as any);
  };

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/images/cards/Rueckseite.jpg")}
        style={styles.back}
        resizeMode="contain"
      />

      <Pressable style={styles.btn} onPress={goToDeck}>
        <Text style={styles.btnText}>ZUM KARTENDECK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05050A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  back: {
    width: "92%",
    height: "65%",
  },
  btn: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1.2,
  },
});
