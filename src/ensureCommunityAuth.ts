import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

/** Stellt eine Firebase-Anonymous-Session her; UID = community_uid (für Firestore Rules). */
export async function ensureCommunityAuth(): Promise<string> {
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    await AsyncStorage.setItem("community_uid", uid);
    return uid;
  }
  const { user } = await signInAnonymously(auth);
  await AsyncStorage.setItem("community_uid", user.uid);
  return user.uid;
}
