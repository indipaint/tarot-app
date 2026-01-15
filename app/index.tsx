import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const CARD_IMAGES = [
  require("../assets/cards/01.jpg"),
  require("../assets/cards/02.jpg"),
  require("../assets/cards/03.jpg"),
  require("../assets/cards/04.jpg"),
  require("../assets/cards/05.jpg"),
  require("../assets/cards/06.jpg"),
  require("../assets/cards/07.jpg"),
  require("../assets/cards/08.jpg"),
  require("../assets/cards/09.jpg"),
  require("../assets/cards/10.jpg"),
  require("../assets/cards/11.jpg"),
  require("../assets/cards/12.jpg"),
  require("../assets/cards/13.jpg"),
  require("../assets/cards/14.jpg"),
  require("../assets/cards/15.jpg"),
  require("../assets/cards/16.jpg"),
  require("../assets/cards/17.jpg"),
  require("../assets/cards/18.jpg"),
  require("../assets/cards/19.jpg"),
  require("../assets/cards/20.jpg"),
  require("../assets/cards/21.jpg"),
  require("../assets/cards/22.jpg"),
] as const;

export default function Index() {
  const [index, setIndex] = useState(4); // Start: 05.jpg

  const prev = () =>
    setIndex((i) => (i - 1 + CARD_IMAGES.length) % CARD_IMAGES.length);

  const next = () => setIndex((i) => (i + 1) % CARD_IMAGES.length);

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <View style={styles.imageStage}>
        <Image
          source={CARD_IMAGES[index]}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.nav}>
        <Pressable onPress={prev} style={styles.navBtn} hitSlop={10}>
          <Text style={styles.navText}>◀</Text>
        </Pressable>

        <Text style={styles.counter}>
          {String(index + 1).padStart(2, "0")}
        </Text>

        <Pressable onPress={next} style={styles.navBtn} hitSlop={10}>
          <Text style={styles.navText}>▶</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  imageStage: {
    flex: 1,
    paddingBottom: 176, // dein "Bild höher" Abstand
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nav: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  navText: {
    color: "white",
    fontSize: 18,
  },
  counter: {
    color: "white",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
});

