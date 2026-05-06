import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import type { DateTriggerInput } from "expo-notifications";
import { Platform } from "react-native";

export const DAILY_CARD_PENDING_DRAW_KEY = "dailyCard_pending_draw";
export const DAILY_CARD_LAST_HANDLED_AT_KEY = "dailyCard_last_handled_at";

const ENABLED_KEY = "dailyCard_enabled";
const INTERVAL_KEY = "dailyCard_interval_days";
const HOUR_KEY = "dailyCard_hour";
const MINUTE_KEY = "dailyCard_minute";
const ANCHOR_MS_KEY = "dailyCard_anchor_ms";
const LOCALE_KEY = "dailyCard_notif_locale";
const TIME_FORMAT_KEY = "dailyCard_time_format";

export const DAILY_CARD_NOTIFICATION_ID = "endyia-daily-card-v1";
const ANDROID_CHANNEL_ID = "daily-card";

const isExpoGo =
  (Constants as any)?.appOwnership === "expo" || (Constants as any)?.executionEnvironment === "storeClient";
const shouldAvoidExpoNotificationsModule = isExpoGo && Platform.OS === "android";

type NotificationsModule = typeof import("expo-notifications");

function loadNotifications(): NotificationsModule | null {
  if (shouldAvoidExpoNotificationsModule) return null;
  if (Platform.OS === "web") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-notifications");
  } catch {
    return null;
  }
}

export type DailyCardInterval = 1 | 2 | 3 | 7;
export type SupportedMenuLocale = "de" | "en" | "fr" | "es" | "pt";
export type DailyCardTimeFormat = "24h" | "12h";

export const DAILY_CARD_UI: Record<
  SupportedMenuLocale,
  {
    sectionTitle: string;
    enableLabel: string;
    intervalLabel: string;
    daily: string;
    every2: string;
    every3: string;
    every7: string;
    timeFormatLabel: string;
    format24h: string;
    format12h: string;
    timeLabel: string;
    save: string;
    permissionHint: string;
    notificationTitle: string;
    notificationBody: string;
  }
> = {
  de: {
    sectionTitle: "Tageskarte",
    enableLabel: "Erinnerung",
    intervalLabel: "Intervall",
    daily: "Täglich",
    every2: "Alle 2 Tage",
    every3: "Alle 3 Tage",
    every7: "Alle 7 Tage",
    timeFormatLabel: "Zeitformat",
    format24h: "24h",
    format12h: "AM/PM",
    timeLabel: "Uhrzeit (24h)",
    save: "Speichern",
    permissionHint: "Bitte Benachrichtigungen in den Systemeinstellungen erlauben.",
    notificationTitle: "ENDYIA",
    notificationBody: "Zeit für deine Tageskarte – tippe hier, um eine Karte zu ziehen.",
  },
  en: {
    sectionTitle: "Daily card",
    enableLabel: "Reminder",
    intervalLabel: "Interval",
    daily: "Daily",
    every2: "Every 2 days",
    every3: "Every 3 days",
    every7: "Every 7 days",
    timeFormatLabel: "Time format",
    format24h: "24h",
    format12h: "AM / PM",
    timeLabel: "Time (AM / PM)",
    save: "Save",
    permissionHint: "Please allow notifications in system settings.",
    notificationTitle: "ENDYIA",
    notificationBody: "Time for your daily card — tap to draw a card.",
  },
  fr: {
    sectionTitle: "Carte du jour",
    enableLabel: "Rappel",
    intervalLabel: "Intervalle",
    daily: "Chaque jour",
    every2: "Tous les 2 jours",
    every3: "Tous les 3 jours",
    every7: "Tous les 7 jours",
    timeFormatLabel: "Format de l'heure",
    format24h: "24h",
    format12h: "AM / PM",
    timeLabel: "Heure (24h)",
    save: "Enregistrer",
    permissionHint: "Veuillez autoriser les notifications dans les réglages du système.",
    notificationTitle: "ENDYIA",
    notificationBody: "C'est l'heure de votre carte du jour — touchez pour tirer une carte.",
  },
  es: {
    sectionTitle: "Carta del día",
    enableLabel: "Recordatorio",
    intervalLabel: "Intervalo",
    daily: "Cada día",
    every2: "Cada 2 días",
    every3: "Cada 3 días",
    every7: "Cada 7 días",
    timeFormatLabel: "Formato de hora",
    format24h: "24h",
    format12h: "AM / PM",
    timeLabel: "Hora (24h)",
    save: "Guardar",
    permissionHint: "Permite las notificaciones en los ajustes del sistema.",
    notificationTitle: "ENDYIA",
    notificationBody: "Hora de tu carta del día — toca para robar una carta.",
  },
  pt: {
    sectionTitle: "Carta do dia",
    enableLabel: "Lembrete",
    intervalLabel: "Intervalo",
    daily: "Todos os dias",
    every2: "A cada 2 dias",
    every3: "A cada 3 dias",
    every7: "A cada 7 dias",
    timeFormatLabel: "Formato da hora",
    format24h: "24h",
    format12h: "AM / PM",
    timeLabel: "Hora (24h)",
    save: "Guardar",
    permissionHint: "Permite notificações nas definições do sistema.",
    notificationTitle: "ENDYIA",
    notificationBody: "Hora da tua carta do dia — toca para tirar uma carta.",
  },
};

let handlerInstalled = false;

export function ensureDailyCardNotificationHandler(): void {
  if (handlerInstalled) return;
  const Notifications = loadNotifications();
  if (!Notifications) return;
  handlerInstalled = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel(Notifications: NotificationsModule): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Tageskarte",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FFCC00",
  });
}

function clampInterval(n: number): DailyCardInterval {
  if (n === 2) return 2;
  if (n === 3) return 3;
  if (n === 7) return 7;
  return 1;
}

function clampHour(n: number): number {
  if (!Number.isFinite(n)) return 9;
  return Math.max(0, Math.min(23, Math.floor(n)));
}

function clampMinute(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(59, Math.floor(n)));
}

export async function getDailyCardConfig(): Promise<{
  enabled: boolean;
  intervalDays: DailyCardInterval;
  hour: number;
  minute: number;
  locale: SupportedMenuLocale;
  timeFormat: DailyCardTimeFormat;
}> {
  const enabled = (await AsyncStorage.getItem(ENABLED_KEY)) === "1";
  const intervalDays = clampInterval(parseInt((await AsyncStorage.getItem(INTERVAL_KEY)) || "1", 10));
  const hour = clampHour(parseInt((await AsyncStorage.getItem(HOUR_KEY)) || "9", 10));
  const minute = clampMinute(parseInt((await AsyncStorage.getItem(MINUTE_KEY)) || "0", 10));
  const loc = (await AsyncStorage.getItem(LOCALE_KEY)) || "de";
  const locale = (["de", "en", "fr", "es", "pt"].includes(loc) ? loc : "de") as SupportedMenuLocale;
  const timeFormatRaw = (await AsyncStorage.getItem(TIME_FORMAT_KEY)) || "";
  const timeFormat = (timeFormatRaw === "12h" || timeFormatRaw === "24h"
    ? timeFormatRaw
    : locale === "en"
      ? "12h"
      : "24h") as DailyCardTimeFormat;
  return { enabled, intervalDays, hour, minute, locale, timeFormat };
}

export async function saveDailyCardConfig(input: {
  enabled: boolean;
  intervalDays: DailyCardInterval;
  hour: number;
  minute: number;
  locale: SupportedMenuLocale;
  timeFormat: DailyCardTimeFormat;
}): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, input.enabled ? "1" : "0");
  await AsyncStorage.setItem(INTERVAL_KEY, String(input.intervalDays));
  await AsyncStorage.setItem(HOUR_KEY, String(clampHour(input.hour)));
  await AsyncStorage.setItem(MINUTE_KEY, String(clampMinute(input.minute)));
  await AsyncStorage.setItem(LOCALE_KEY, input.locale);
  await AsyncStorage.setItem(TIME_FORMAT_KEY, input.timeFormat);
  if (input.enabled) {
    const hasAnchor = await AsyncStorage.getItem(ANCHOR_MS_KEY);
    if (!hasAnchor) {
      await AsyncStorage.setItem(ANCHOR_MS_KEY, String(Date.now()));
    }
  }
  await rescheduleDailyCardNotification();
}

function computeNextTriggerDate(anchorMs: number, intervalDays: DailyCardInterval, hour: number, minute: number): Date {
  let t = new Date(anchorMs);
  t.setSeconds(0, 0);
  t.setMilliseconds(0);
  t.setHours(hour, minute, 0, 0);
  const now = Date.now();
  while (t.getTime() <= now) {
    t.setDate(t.getDate() + intervalDays);
    t.setHours(hour, minute, 0, 0);
  }
  return t;
}

export async function rescheduleDailyCardNotification(): Promise<void> {
  if (Platform.OS === "web") return;
  const Notifications = loadNotifications();
  if (!Notifications) return;

  await ensureAndroidChannel(Notifications);
  await Notifications.cancelScheduledNotificationAsync(DAILY_CARD_NOTIFICATION_ID).catch(() => {});

  if ((await AsyncStorage.getItem(ENABLED_KEY)) !== "1") return;

  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;

  const intervalDays = clampInterval(parseInt((await AsyncStorage.getItem(INTERVAL_KEY)) || "1", 10));
  const hour = clampHour(parseInt((await AsyncStorage.getItem(HOUR_KEY)) || "9", 10));
  const minute = clampMinute(parseInt((await AsyncStorage.getItem(MINUTE_KEY)) || "0", 10));
  const anchorMs = parseInt((await AsyncStorage.getItem(ANCHOR_MS_KEY)) || String(Date.now()), 10);
  const loc = ((await AsyncStorage.getItem(LOCALE_KEY)) || "de") as SupportedMenuLocale;
  const copy = DAILY_CARD_UI[loc] || DAILY_CARD_UI.de;

  const next = computeNextTriggerDate(anchorMs, intervalDays, hour, minute);

  const trigger: DateTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: next,
    ...(Platform.OS === "android" ? { channelId: ANDROID_CHANNEL_ID } : {}),
  };

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_CARD_NOTIFICATION_ID,
    content: {
      title: copy.notificationTitle,
      body: copy.notificationBody,
      data: { type: "daily_card" },
    },
    trigger,
  });
}

export async function requestDailyCardNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const Notifications = loadNotifications();
  if (!Notifications) return false;
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return !!req.granted;
}

export async function handleDailyCardNotificationOpened(fireDateMs: number): Promise<void> {
  await AsyncStorage.setItem(ANCHOR_MS_KEY, String(fireDateMs));
  await AsyncStorage.setItem(DAILY_CARD_PENDING_DRAW_KEY, "1");
  await rescheduleDailyCardNotification();
}

export async function processLastDailyCardNotificationIfNeeded(): Promise<void> {
  if (Platform.OS === "web") return;
  const Notifications = loadNotifications();
  if (!Notifications) return;
  const last = await Notifications.getLastNotificationResponseAsync();
  if (!last) return;
  const data = last.notification.request.content.data as { type?: string } | undefined;
  if (data?.type !== "daily_card") return;
  const firedAt = last.notification.date;
  const prev = await AsyncStorage.getItem(DAILY_CARD_LAST_HANDLED_AT_KEY);
  if (prev === String(firedAt)) return;
  await AsyncStorage.setItem(DAILY_CARD_LAST_HANDLED_AT_KEY, String(firedAt));
  await handleDailyCardNotificationOpened(firedAt);
}
