import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

/** 
 * Löscht nur das Thread-Dokument und den lokalen Cache.
 * Die Nachrichten-Subcollection wird ignoriert, um Permission-Errors zu vermeiden.
 */
export async function purgeCommunityThread(threadId: string): Promise<void> {
  const tid = String(threadId || "").trim();
  if (!tid) return;

  try {
    // 1. Wir löschen NUR das Haupt-Dokument des Threads.
    // Da du Teilnehmer bist, hast du hierfür normalerweise die Rechte.
    await deleteDoc(doc(db, "threads", tid));

    // 2. Lokalen Speicher für "gelesen"-Status aufräumen
    await AsyncStorage.removeItem(`thread_last_seen_${tid}`);
    
    console.log(`Thread ${tid} erfolgreich aus der Liste entfernt.`);
  } catch (error) {
    // Wir loggen den Fehler nur, damit die App nicht crasht
    console.warn("Fehler beim Löschen des Threads:", error);
  }
}