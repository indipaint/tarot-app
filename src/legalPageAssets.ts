const SUPPORTED = ["de", "en", "fr", "es", "pt"] as const;
export type SupportedLegalLocale = (typeof SUPPORTED)[number];

export function normalizeLegalLocale(locale?: string): SupportedLegalLocale {
  const code = String(locale || "de").toLowerCase().split("-")[0];
  return (SUPPORTED.includes(code as SupportedLegalLocale) ? code : "de") as SupportedLegalLocale;
}

export const BUNDLED_PRIVACY: Record<SupportedLegalLocale, number> = {
  de: require("../legal-pages/privacy.html"),
  en: require("../legal-pages/privacy-en.html"),
  fr: require("../legal-pages/privacy-fr.html"),
  es: require("../legal-pages/privacy-es.html"),
  pt: require("../legal-pages/privacy-pt.html"),
};

export const BUNDLED_TERMS: Record<SupportedLegalLocale, number> = {
  de: require("../legal-pages/terms.html"),
  en: require("../legal-pages/terms-en.html"),
  fr: require("../legal-pages/terms-fr.html"),
  es: require("../legal-pages/terms-es.html"),
  pt: require("../legal-pages/terms-pt.html"),
};

export function getBundledLegalModuleId(
  kind: "privacy" | "terms",
  locale?: string
): number {
  const code = normalizeLegalLocale(locale);
  return kind === "privacy" ? BUNDLED_PRIVACY[code] : BUNDLED_TERMS[code];
}
