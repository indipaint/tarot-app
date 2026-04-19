import Constants from "expo-constants";
import * as Device from "expo-device";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Platform } from "react-native";
import { db } from "./firebase";

const isExpoGo =
  (Constants as any)?.appOwnership === "expo" || (Constants as any)?.executionEnvironment === "storeClient";

// Expo Go + Android: remote push APIs are not supported (SDK 53+). Avoid importing the module at all.
const shouldAvoidExpoNotificationsModule = isExpoGo && Platform.OS === "android";

function loadNotifications(): any | null {
  if (shouldAvoidExpoNotificationsModule) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-notifications");
  } catch {
    return null;
  }
}

const Notifications = loadNotifications();
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function getProjectId(): string | undefined {
  const easProjectId = (Constants as any)?.easConfig?.projectId;
  const expoProjectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId;
  return easProjectId || expoProjectId;
}

export async function registerDevicePushToken(uid: string): Promise<string | null> {
  if (!uid || !Device.isDevice) return null;
  if (shouldAvoidExpoNotificationsModule) return null;
  if (!Notifications) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  const projectId = getProjectId();
  if (!projectId) return null;

  const tokenResp = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenResp?.data || null;
  if (!token) return null;

  const userRef = doc(db, "community_users", uid);
  const existing = await getDoc(userRef);
  const prevTokens = Array.isArray(existing.data()?.expoPushTokens)
    ? (existing.data()?.expoPushTokens as string[])
    : [];
  const nextTokens = Array.from(new Set([...prevTokens, token]));

  await setDoc(
    userRef,
    {
      uid,
      expoPushTokens: nextTokens,
      pushEnabled: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return token;
}

export async function sendPushToUser(
  targetUid: string,
  payload: { title: string; body: string; data?: Record<string, any>; badge?: number }
): Promise<void> {
  if (shouldAvoidExpoNotificationsModule) return;
  if (!targetUid) return;
  const snap = await getDoc(doc(db, "community_users", targetUid));
  const tokens = Array.isArray(snap.data()?.expoPushTokens) ? (snap.data()?.expoPushTokens as string[]) : [];
  if (!tokens.length) return;

  const messages = tokens.map((to) => ({
    to,
    sound: "default",
    title: payload.title,
    body: payload.body,
    data: payload.data || {},
    badge: payload.badge,
    priority: "high",
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });
}
