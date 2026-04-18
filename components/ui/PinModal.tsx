import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import i18n from "../../src/i18n";

type Props = {
  onSuccess: () => void;
  onClose: () => void;
};

const PIN_KEY = "journal_pin";

export default function PinModal({ onSuccess, onClose }: Props) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(PIN_KEY);
      if (stored) {
        setSavedPin(stored);
      } else {
        setIsSettingPin(true);
      }
    })();
  }, []);

  const handleEnterPin = async () => {
    if (pin === savedPin) {
      setError("");
      onSuccess();
    } else {
      setError(i18n.t("pin.error_wrong"));
      setPin("");
    }
  };

  const handleSetPin = async () => {
    if (pin.length < 4) {
      setError(i18n.t("pin.error_length"));
      return;
    }
    if (pin !== confirmPin) {
      setError(i18n.t("pin.error_match"));
      return;
    }
    await AsyncStorage.setItem(PIN_KEY, pin);
    setSavedPin(pin);
    setError("");
    onSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.panel}>
        <Text style={styles.title}>
          {isSettingPin ? i18n.t("pin.title_set") : i18n.t("pin.title_enter")}
        </Text>
        <Text style={styles.subtitle}>
          {isSettingPin ? i18n.t("pin.subtitle_set") : i18n.t("pin.subtitle_enter")}
        </Text>

        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={(t) => { setPin(t.replace(/[^0-9]/g, "")); setError(""); }}
          keyboardType="numeric"
          secureTextEntry
          maxLength={8}
          placeholder={i18n.t("pin.placeholder")}
          placeholderTextColor="#444"
          autoFocus
        />

        {isSettingPin && (
          <TextInput
            style={styles.input}
            value={confirmPin}
            onChangeText={(t) => { setConfirmPin(t.replace(/[^0-9]/g, "")); setError(""); }}
            keyboardType="numeric"
            secureTextEntry
            maxLength={8}
            placeholder={i18n.t("pin.placeholder_confirm")}
            placeholderTextColor="#444"
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.btnRow}>
          <Pressable
            style={styles.btn}
            onPress={isSettingPin ? handleSetPin : handleEnterPin}
          >
            <Text style={styles.btnText}>
              {isSettingPin ? i18n.t("pin.save") : i18n.t("pin.open")}
            </Text>
          </Pressable>
          <Pressable style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>{i18n.t("pin.cancel")}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: "rgba(0,0,0,0.95)",
    zIndex: 7000,
    elevation: 7000,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 28,
  },
  panel: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  error: {
    color: "#f44",
    fontSize: 12,
    textAlign: "center",
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  btn: {
    flex: 1,
    backgroundColor: "#1e1e2e",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  btnCancel: {
    backgroundColor: "#111",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  btnCancelText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});