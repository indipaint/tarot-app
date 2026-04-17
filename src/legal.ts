/**
 * Store-ready Legal URLs per supported locale.
 * Falls eine Sprache fehlt, wird auf Deutsch zurückgefallen.
 */
const LEGAL_URLS: Record<string, { privacy: string; terms: string }> = {
  de: {
    privacy: "https://indipaint.github.io/tarot-app/legal-pages/privacy.html",
    terms: "https://indipaint.github.io/tarot-app/legal-pages/terms.html",
  },
  en: {
    privacy: "https://indipaint.github.io/tarot-app/legal-pages/privacy-en.html",
    terms: "https://indipaint.github.io/tarot-app/legal-pages/terms-en.html",
  },
  fr: {
    privacy: "https://indipaint.github.io/tarot-app/legal-pages/privacy-fr.html",
    terms: "https://indipaint.github.io/tarot-app/legal-pages/terms-fr.html",
  },
  es: {
    privacy: "https://indipaint.github.io/tarot-app/legal-pages/privacy-es.html",
    terms: "https://indipaint.github.io/tarot-app/legal-pages/terms-es.html",
  },
  pt: {
    privacy: "https://indipaint.github.io/tarot-app/legal-pages/privacy-pt.html",
    terms: "https://indipaint.github.io/tarot-app/legal-pages/terms-pt.html",
  },
};

export const getLegalUrls = (locale?: string) => {
  const normalized = String(locale || "de").toLowerCase().split("-")[0];
  return LEGAL_URLS[normalized] || LEGAL_URLS.de;
};

export const PRIVACY_POLICY_URL = LEGAL_URLS.de.privacy;
export const TERMS_OF_USE_URL = LEGAL_URLS.de.terms;
