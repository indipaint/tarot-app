import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { purgeCommunityThread } from "./purgeCommunityThread";

async function collectThreadIdsForUid(uid: string): Promise<string[]> {
  const [snapA, snapB] = await Promise.all([
    getDocs(query(collection(db, "threads"), where("userA", "==", uid))),
    getDocs(query(collection(db, "threads"), where("userB", "==", uid))),
  ]);
  const out = new Set<string>();
  for (const d of [...snapA.docs, ...snapB.docs]) out.add(d.id);
  return Array.from(out);
}

async function deleteUserPosts(uid: string): Promise<void> {
  const postsSnap = await getDocs(query(collection(db, "posts"), where("authorUid", "==", uid)));
  await Promise.all(postsSnap.docs.map((d) => deleteDoc(doc(db, "posts", d.id))));
}

async function deleteUserThreads(uid: string): Promise<void> {
  const threadIds = await collectThreadIdsForUid(uid);
  for (const tid of threadIds) {
    try {
      await purgeCommunityThread(tid);
    } catch {
      await deleteDoc(doc(db, "threads", tid)).catch(() => {});
    }
  }
}

export async function deleteCurrentAccountAndData(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("no_authenticated_user");
  const uid = String(user.uid || "").trim();
  if (!uid) throw new Error("invalid_user_uid");

  await deleteUserPosts(uid);
  await deleteUserThreads(uid);
  await deleteDoc(doc(db, "community_users", uid)).catch(() => {});

  await deleteUser(user);

  const allKeys = await AsyncStorage.getAllKeys();
  if (allKeys.length) {
    await AsyncStorage.multiRemove(allKeys);
  }
}
