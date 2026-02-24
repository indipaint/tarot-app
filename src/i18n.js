import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  de: {
    app: { welcome: "Willkommen zur Tarot App" },
    buttons: {
      meaning: "Deutung",
      draw: "Zieh",
      draw_welcome: "ZIEH EINE KARTE",
      back: "Zurück",
    },
    tarot: {
      major: {
        "0": { title: "Der Narr" },
        "1": { title: "Der Magier" },
        "2": { title: "Die Hohepriesterin" },
      },
    },
  },
  en: {
    app: { welcome: "Welcome to Tarot App" },
    buttons: {
      meaning: "Meaning",
      draw: "Draw",
      draw_welcome: "DRAW A CARD",
      back: "Back",
    },
    tarot: {
      major: {
        "0": { title: "The Fool" },
        "1": { title: "The Magician" },
        "2": { title: "The High Priestess" },
      },
    },
  },
};

const i18n = new I18n(translations);
i18n.enableFallback = true;

const locales = Localization.getLocales();
const lang = locales?.[0]?.languageCode || "de";
i18n.locale = translations[lang] ? lang : "de";

let listeners = [];

export const subscribeLocale = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((x) => x !== cb);
  };
};

const notifyLocale = () => {
  for (const cb of listeners) {
    try {
      cb(i18n.locale);
    } catch {}
  }
};

export const setLocale = (newLang) => {
  i18n.locale = translations[newLang] ? newLang : "de";
  notifyLocale();
};

export const getLocale = () => i18n.locale;

export const getMajorTitle = (id) => i18n.t(`tarot.major.${id}.title`);

export default i18n;