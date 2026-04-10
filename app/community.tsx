import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  const [nickname, setNickname] = useState("");
  const [nicknameSet, setNicknameSet] = useState(false);

  if (!nicknameSet) {
    return (
      <SafeAreaView style={styles.nickSafe} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View style={styles.nickContainer}>
          <Text style={styles.nickTitle}>🌍 Community</Text>
          <Text style={styles.nickSubtitle}>Wähle einen Nickname</Text>

          <TextInput
            style={styles.nickInput}
            placeholder="Dein Nickname..."
            placeholderTextColor="#aaa"
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
          />

          <Pressable
            style={styles.nickBtn}
            onPress={() => {
              if (nickname.trim().length > 1) setNicknameSet(true);
            }}
          >
            <Text style={styles.nickBtnText}>✓ Los gehts</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>🌍 {nickname}</Text>

        <View style={styles.placeholderWrap}>
          <Text style={styles.placeholderText}>Community Testscreen sichtbar</Text>
          <Text style={styles.placeholderSub}>
            Firebase ist in diesem Test komplett abgeklemmt.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nickSafe: {
    flex: 1,
    backgroundColor: "#1a0a2e",
  },
  nickContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 20,
  },
  nickTitle: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
  },
  nickSubtitle: {
    color: "#ccc",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  nickInput: {
    width: "100%",
    backgroundColor: "#2a1a4e",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#7755cc",
  },
  nickBtn: {
    backgroundColor: "#5533bb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderColor: "#9977ee",
    marginTop: 10,
  },
  nickBtnText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  flex: {
    flex: 1,
  },
  header: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 12,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  placeholderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
  },
  placeholderSub: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
  },
});