/**
 * Synchronous handoff from intro → index: intro calls setPendingWelcomeFromIntro
 * immediately before router.replace("/"). Index reads via peek in useState initializer.
 *
 * Do NOT clear in the initializer: React 18 Strict Mode runs the initializer twice;
 * clearing on first read would make the second read false and drop the welcome overlay.
 * Intro always sets the flag again before each navigation.
 */
let pending = false;

export function setPendingWelcomeFromIntro(value: boolean) {
  pending = value;
}

export function peekPendingWelcomeFromIntro(): boolean {
  return pending;
}
