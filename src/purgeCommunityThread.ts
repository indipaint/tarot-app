import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/** Deletes all messages in a thread, the thread document, and local last-seen key. */
export async function purgeCommunityThread(threadId: string): Promise<void> {
  const tid = String(threadId || "").trim();
  if (!tid) return;
  const msgSnap = await getDocs(collection(db, "threads", tid, "messages"));
  const docs = msgSnap.docs;
  const chunk = 80;
  for (let i = 0; i < docs.length; i += chunk) {
    await Promise.all(
      docs.slice(i, i + chunk).map((d) => deleteDoc(doc(db, "threads", tid, "messages", d.id)))
    );
  }
  await deleteDoc(doc(db, "threads", tid));
  await AsyncStorage.removeItem(`thread_last_seen_${tid}`);
}
