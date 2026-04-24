import { Audio, ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const INTRO_DONE_ONCE_KEY = "__intro_done_once";

export default function Intro() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

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
});
