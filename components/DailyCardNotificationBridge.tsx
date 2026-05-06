import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function DailyCardNotificationBridge() {
  const router = useRouter();

  useEffect(() => {
    const isExpoGo =
      (Constants as any)?.appOwnership === "expo" || (Constants as any)?.executionEnvironment === "storeClient";
    const shouldAvoidExpoNotificationsModule = isExpoGo && Platform.OS === "android";
    if (shouldAvoidExpoNotificationsModule) return;
    if (Platform.OS === "web") return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require("expo-notifications");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const daily = require("../src/dailyCardNotifications");

      daily.ensureDailyCardNotificationHandler();

      const sub = Notifications.addNotificationResponseReceivedListener(async (response: any) => {
        const data = response.notification.request.content.data as { type?: string } | undefined;
        if (data?.type !== "daily_card") return;
        const firedAt = response.notification.date;
        const prev = await AsyncStorage.getItem(daily.DAILY_CARD_LAST_HANDLED_AT_KEY);
        if (prev !== String(firedAt)) {
          await AsyncStorage.setItem(daily.DAILY_CARD_LAST_HANDLED_AT_KEY, String(firedAt));
          await daily.handleDailyCardNotificationOpened(firedAt);
        }
        router.replace("/");
      });

      return () => sub.remove();
    } catch {
      return;
    }
  }, [router]);

  return null;
}
