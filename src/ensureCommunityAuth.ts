import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

/** Stellt eine Firebase-Anonymous-Session her; UID = community_uid (für Firestore Rules). */
export async function ensureCommunityAuth(): Promise<string> {
  await (auth as any).authStateReady?.();

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    await AsyncStorage.setItem("community_uid", uid);
    return uid;
  }

  // Persistenz kann kurz nach authStateReady nachziehen — warten, bevor neu anonym eingeloggt wird.
  await new Promise<void>((resolve) => {
    let done = false;
    let unsub: (() => void) | null = null;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);
      unsub?.();
      resolve();
    };

    const timeoutId = setTimeout(finish, 2500);
    unsub = onAuthStateChanged(auth, (user) => {
      if (user) finish();
    });
  });

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    await AsyncStorage.setItem("community_uid", uid);
    return uid;
  }

  const { user } = await signInAnonymously(auth);
  await AsyncStorage.setItem("community_uid", user.uid);
  return user.uid;
}
