import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

// KEIN JSON import (verursacht Metro Fehler)
const translations = {
  de: {
    app: { welcome: "Willkommen zur Tarot App" },
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

// ✅ Sprachschleuse: NUR "de" oder "en" verwenden (nicht "de-DE")
const locales = Localization.getLocales();
const lang = locales?.[0]?.languageCode || "de";
i18n.locale = translations[lang] ? lang : "de";

// Optional: manuell umschalten (für späteren Button)
export const setLocale = (newLang) => {
  i18n.locale = translations[newLang] ? newLang : "de";
};
export const getLocale = () => i18n.locale;

// Tarot Helper
export const getMajorTitle = (id) => i18n.t(`tarot.major.${id}.title`);

export default i18n;