import { Audio, ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function Intro() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    if (!ready) return;
    videoRef.current?.playAsync().catch(() => {});
  }, [ready]);

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
        shouldPlay={false}
        isLooping={false}
        progressUpdateIntervalMillis={100}
        onReadyForDisplay={() => setReady(true)}
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
