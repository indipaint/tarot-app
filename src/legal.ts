/**
 * Store-ready Legal URLs per supported locale.
 * Falls eine Sprache fehlt, wird auf Deutsch zurückgefallen.
 */
const LEGAL_VERSION = "20260512";
const LEGAL_URLS: Record<string, { privacy: string; terms: string }> = {
  de: {
    privacy: `https://indipaint.github.io/tarot-app/legal-pages/privacy.html?v=${LEGAL_VERSION}`,
    terms: `https://indipaint.github.io/tarot-app/legal-pages/terms.html?v=${LEGAL_VERSION}`,
  },
  en: {
    privacy: `https://indipaint.github.io/tarot-app/legal-pages/privacy-en.html?v=${LEGAL_VERSION}`,
    terms: `https://indipaint.github.io/tarot-app/legal-pages/terms-en.html?v=${LEGAL_VERSION}`,
  },
  fr: {
    privacy: `https://indipaint.github.io/tarot-app/legal-pages/privacy-fr.html?v=${LEGAL_VERSION}`,
    terms: `https://indipaint.github.io/tarot-app/legal-pages/terms-fr.html?v=${LEGAL_VERSION}`,
  },
  es: {
    privacy: `https://indipaint.github.io/tarot-app/legal-pages/privacy-es.html?v=${LEGAL_VERSION}`,
    terms: `https://indipaint.github.io/tarot-app/legal-pages/terms-es.html?v=${LEGAL_VERSION}`,
  },
  pt: {
    privacy: `https://indipaint.github.io/tarot-app/legal-pages/privacy-pt.html?v=${LEGAL_VERSION}`,
    terms: `https://indipaint.github.io/tarot-app/legal-pages/terms-pt.html?v=${LEGAL_VERSION}`,
  },
};

export const getLegalUrls = (locale?: string) => {
  const normalized = String(locale || "de").toLowerCase().split("-")[0];
  return LEGAL_URLS[normalized] || LEGAL_URLS.de;
};

export const PRIVACY_POLICY_URL = LEGAL_URLS.de.privacy;
export const TERMS_OF_USE_URL = LEGAL_URLS.de.terms;
