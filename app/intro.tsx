import { Audio, ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Intro() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [ready, setReady] = useState(false);

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

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/images/intro/intro.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping={false}
        progressUpdateIntervalMillis={200}
        onReadyForDisplay={() => setReady(true)}
        onPlaybackStatusUpdate={(status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            router.replace("/");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { flex: 1 },
});
