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
    cards: {
      "00": "Der Narr",
      "01": "Der Magier",
      "02": "Die Hohepriesterin",
      "03": "Die Königin",
      "04": "Der König",
      "05": "Der Hohepriester",
      "06": "Die Liebenden",
      "07": "Der Wagen",
      "08": "Die Kraft",
      "09": "Der Eremit",
      "10": "Rad des Schicksals",
      "11": "Gerechtigkeit",
      "12": "Der Gehängte",
      "13": "Der Tod",
      "14": "Mäßigkeit",
      "15": "Der Teufel",
      "16": "Der Turm",
      "17": "Der Stern",
      "18": "Der Mond",
      "19": "Die Sonne",
      "20": "Das Gericht",
      "21": "Die Welt",
      "W01": "Ass der Stäbe",
      "W02": "Zwei der Stäbe",
      "W03": "Drei der Stäbe",
      "W04": "Vier der Stäbe",
      "W05": "Fünf der Stäbe",
      "W06": "Sechs der Stäbe",
      "W07": "Sieben der Stäbe",
      "W08": "Acht der Stäbe",
      "W09": "Neun der Stäbe",
      "W10": "Zehn der Stäbe",
      "W11": "Bube der Stäbe",
      "W12": "Ritter der Stäbe",
      "W13": "Königin der Stäbe",
      "W14": "König der Stäbe",
      "C01": "Ass der Kelche",
      "C02": "Zwei der Kelche",
      "C03": "Drei der Kelche",
      "C04": "Vier der Kelche",
      "C05": "Fünf der Kelche",
      "C06": "Sechs der Kelche",
      "C07": "Sieben der Kelche",
      "C08": "Acht der Kelche",
      "C09": "Neun der Kelche",
      "C10": "Zehn der Kelche",
      "C11": "Bube der Kelche",
      "C12": "Ritter der Kelche",
      "C13": "Königin der Kelche",
      "C14": "König der Kelche",
      "S01": "Ass der Schwerter",
      "S02": "Zwei der Schwerter",
      "S03": "Drei der Schwerter",
      "S04": "Vier der Schwerter",
      "S05": "Fünf der Schwerter",
      "S06": "Sechs der Schwerter",
      "S07": "Sieben der Schwerter",
      "S08": "Acht der Schwerter",
      "S09": "Neun der Schwerter",
      "S10": "Zehn der Schwerter",
      "S11": "Bube der Schwerter",
      "S12": "Ritter der Schwerter",
      "S13": "Königin der Schwerter",
      "S14": "König der Schwerter",
      "P01": "Ass der Münzen",
      "P02": "Zwei der Münzen",
      "P03": "Drei der Münzen",
      "P04": "Vier der Münzen",
      "P05": "Fünf der Münzen",
      "P06": "Sechs der Münzen",
      "P07": "Sieben der Münzen",
      "P08": "Acht der Münzen",
      "P09": "Neun der Münzen",
      "P10": "Zehn der Münzen",
      "P11": "Bube der Münzen",
      "P12": "Ritter der Münzen",
      "P13": "Königin der Münzen",
      "P14": "König der Münzen",
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
    cards: {
      "00": "The Fool",
      "01": "The Magician",
      "02": "The High Priestess",
      "03": "The Empress",
      "04": "The Emperor",
      "05": "The Hierophant",
      "06": "The Lovers",
      "07": "The Chariot",
      "08": "Strength",
      "09": "The Hermit",
      "10": "Wheel of Fortune",
      "11": "Justice",
      "12": "The Hanged Man",
      "13": "Death",
      "14": "Temperance",
      "15": "The Devil",
      "16": "The Tower",
      "17": "The Star",
      "18": "The Moon",
      "19": "The Sun",
      "20": "Judgement",
      "21": "The World",
      "W01": "Ace of Wands",
      "W02": "Two of Wands",
      "W03": "Three of Wands",
      "W04": "Four of Wands",
      "W05": "Five of Wands",
      "W06": "Six of Wands",
      "W07": "Seven of Wands",
      "W08": "Eight of Wands",
      "W09": "Nine of Wands",
      "W10": "Ten of Wands",
      "W11": "Page of Wands",
      "W12": "Knight of Wands",
      "W13": "Queen of Wands",
      "W14": "King of Wands",
      "C01": "Ace of Cups",
      "C02": "Two of Cups",
      "C03": "Three of Cups",
      "C04": "Four of Cups",
      "C05": "Five of Cups",
      "C06": "Six of Cups",
      "C07": "Seven of Cups",
      "C08": "Eight of Cups",
      "C09": "Nine of Cups",
      "C10": "Ten of Cups",
      "C11": "Page of Cups",
      "C12": "Knight of Cups",
      "C13": "Queen of Cups",
      "C14": "King of Cups",
      "S01": "Ace of Swords",
      "S02": "Two of Swords",
      "S03": "Three of Swords",
      "S04": "Four of Swords",
      "S05": "Five of Swords",
      "S06": "Six of Swords",
      "S07": "Seven of Swords",
      "S08": "Eight of Swords",
      "S09": "Nine of Swords",
      "S10": "Ten of Swords",
      "S11": "Page of Swords",
      "S12": "Knight of Swords",
      "S13": "Queen of Swords",
      "S14": "King of Swords",
      "P01": "Ace of Pentacles",
      "P02": "Two of Pentacles",
      "P03": "Three of Pentacles",
      "P04": "Four of Pentacles",
      "P05": "Five of Pentacles",
      "P06": "Six of Pentacles",
      "P07": "Seven of Pentacles",
      "P08": "Eight of Pentacles",
      "P09": "Nine of Pentacles",
      "P10": "Ten of Pentacles",
      "P11": "Page of Pentacles",
      "P12": "Knight of Pentacles",
      "P13": "Queen of Pentacles",
      "P14": "King of Pentacles",
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