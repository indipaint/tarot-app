import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  DAILY_CARD_UI,
  type DailyCardInterval,
  type SupportedMenuLocale,
  type DailyCardTimeFormat,
  getDailyCardConfig,
  requestDailyCardNotificationPermission,
  saveDailyCardConfig,
} from "../src/dailyCardNotifications";

type Props = {
  locale: SupportedMenuLocale;
  onClose: () => void;
};

function to12h(hour24: number): { h12: number; mer: "AM" | "PM" } {
  if (hour24 === 0) return { h12: 12, mer: "AM" };
  if (hour24 === 12) return { h12: 12, mer: "PM" };
  if (hour24 < 12) return { h12: hour24, mer: "AM" };
  return { h12: hour24 - 12, mer: "PM" };
}

function from12h(h12: number, mer: "AM" | "PM"): number {
  if (mer === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

const INTERVAL_OPTIONS = [1, 2, 3, 7] as const satisfies readonly DailyCardInterval[];

export default function DailyCardMenuBlock({ locale, onClose }: Props) {
  const copy = DAILY_CARD_UI[locale] || DAILY_CARD_UI.de;
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [intervalDays, setIntervalDays] = useState<DailyCardInterval>(1);
  const [timeFormat, setTimeFormat] = useState<DailyCardTimeFormat>("24h");
  const [hourStr, setHourStr] = useState("9");
  const [hour12Str, setHour12Str] = useState("9");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [minuteStr, setMinuteStr] = useState("0");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const c = await getDailyCardConfig();
      setEnabled(c.enabled);
      setIntervalDays(c.intervalDays);
      setMinuteStr(String(c.minute));
      setTimeFormat(c.timeFormat);
      if (c.timeFormat === "12h") {
        const { h12, mer } = to12h(c.hour);
        setHour12Str(String(h12));
        setMeridiem(mer);
        setHourStr(String(c.hour));
      } else {
        setHourStr(String(c.hour));
      }
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async () => {
    const minute = parseInt(minuteStr, 10);
    if (!Number.isFinite(minute) || minute < 0 || minute > 59) {
      Alert.alert("", copy.timeLabel);
      return;
    }

    let hour: number;
    if (timeFormat === "12h") {
      const h12 = parseInt(hour12Str, 10);
      if (!Number.isFinite(h12) || h12 < 1 || h12 > 12) {
        Alert.alert("", copy.timeLabel);
        return;
      }
      hour = from12h(h12, meridiem);
    } else {
      hour = parseInt(hourStr, 10);
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) {
        Alert.alert("", copy.timeLabel);
        return;
      }
    }
    setSaving(true);
    try {
      if (enabled && Platform.OS !== "web") {
        const ok = await requestDailyCardNotificationPermission();
        if (!ok) {
          Alert.alert("", copy.permissionHint);
          setEnabled(false);
          setSaving(false);
          return;
        }
      }
      await saveDailyCardConfig({
        enabled,
        intervalDays,
        hour,
        minute,
        locale,
        timeFormat,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.block}>
        <Text style={styles.section}>{copy.sectionTitle}</Text>
        <Text style={styles.webHint}>Nur in der iOS/Android-App verfügbar.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.block}>
        <ActivityIndicator color="#aaa" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.section}>{copy.sectionTitle}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{copy.enableLabel}</Text>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: "#3a3a3a", true: "#8b3a3a" }}
          thumbColor={enabled ? "#ff0000" : "#d0d0d0"}
          ios_backgroundColor="#3a3a3a"
        />
      </View>
      <Text style={styles.sub}>{copy.intervalLabel}</Text>
      <View style={styles.intervalRow}>
        {INTERVAL_OPTIONS.map((d) => (
          <Pressable
            key={d}
            style={[styles.intervalChip, intervalDays === d && styles.intervalChipOn]}
            onPress={() => setIntervalDays(d)}
          >
            <Text style={[styles.intervalChipText, intervalDays === d && styles.intervalChipTextOn]}>
              {d === 1 ? copy.daily : d === 2 ? copy.every2 : d === 3 ? copy.every3 : copy.every7}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.sub}>{copy.timeFormatLabel}</Text>
      <View style={styles.intervalRow}>
        <Pressable
          style={[styles.intervalChip, timeFormat === "24h" && styles.intervalChipOn]}
          onPress={() => setTimeFormat("24h")}
        >
          <Text style={[styles.intervalChipText, timeFormat === "24h" && styles.intervalChipTextOn]}>
            {copy.format24h}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.intervalChip, timeFormat === "12h" && styles.intervalChipOn]}
          onPress={() => setTimeFormat("12h")}
        >
          <Text style={[styles.intervalChipText, timeFormat === "12h" && styles.intervalChipTextOn]}>
            {copy.format12h}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.sub}>{copy.timeLabel}</Text>
      {timeFormat === "12h" ? (
        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={hour12Str}
            onChangeText={setHour12Str}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={minuteStr}
            onChangeText={setMinuteStr}
          />
          <View style={styles.meridiemRow}>
            <Pressable
              style={[styles.merChip, meridiem === "AM" && styles.merChipOn]}
              onPress={() => setMeridiem("AM")}
            >
              <Text style={[styles.merChipText, meridiem === "AM" && styles.merChipTextOn]}>AM</Text>
            </Pressable>
            <Pressable
              style={[styles.merChip, meridiem === "PM" && styles.merChipOn]}
              onPress={() => setMeridiem("PM")}
            >
              <Text style={[styles.merChipText, meridiem === "PM" && styles.merChipTextOn]}>PM</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={hourStr}
            onChangeText={setHourStr}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={minuteStr}
            onChangeText={setMinuteStr}
          />
        </View>
      )}
      <Pressable style={styles.saveBtn} onPress={() => void onSave()} disabled={saving}>
        <Text style={styles.saveText}>{saving ? "..." : copy.save}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8 },
  section: { color: "#c7d5ff", fontSize: 11, fontWeight: "600", marginBottom: 2 },
  webHint: { color: "#888", fontSize: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { color: "#ccc", fontSize: 11, flex: 1, paddingRight: 8 },
  sub: { color: "#999", fontSize: 10, marginTop: 4 },
  intervalRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  intervalChip: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
  },
  intervalChipOn: { borderColor: "#5a6fa8", backgroundColor: "#222a3d" },
  intervalChipText: { color: "#aaa", fontSize: 10 },
  intervalChipTextOn: { color: "#dde6ff" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  meridiemRow: { flexDirection: "row", gap: 4, marginLeft: 2 },
  merChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
  },
  merChipOn: { borderColor: "#5a6fa8", backgroundColor: "#222a3d" },
  merChipText: { color: "#aaa", fontSize: 11 },
  merChipTextOn: { color: "#dde6ff" },
  timeInput: {
    width: 40,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    color: "#eee",
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#111",
  },
  colon: { color: "#888", fontSize: 14 },
  saveBtn: {
    marginTop: 4,
    alignSelf: "stretch",
    backgroundColor: "#2a3148",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3d4a6b",
  },
  saveText: { color: "#dde6ff", fontSize: 12 },
});
