let introCompletedThisSession = false;
let redirectedToLanguageThisSession = false;

export function markIntroCompletedThisSession() {
  introCompletedThisSession = true;
}

export function hasIntroCompletedThisSession() {
  return introCompletedThisSession;
}

export function shouldRedirectToLanguage() {
  if (introCompletedThisSession) return false;
  if (redirectedToLanguageThisSession) return false;
  redirectedToLanguageThisSession = true;
  return true;
}

