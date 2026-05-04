import { router } from "expo-router";

import { normalizeLegalLocale } from "./legalPageAssets";

/**
 * Opens bundled `legal-pages` HTML in an in-app screen (WebView). Same files as in the repo.
 */
export function openBundledLegalPage(kind: "privacy" | "terms", locale?: string): void {
  const loc = normalizeLegalLocale(locale);
  router.push({
    pathname: "/legal-document",
    params: { kind, locale: loc },
  });
}
