import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyD4asBy6Yya3A49m0s5PZ5bn28E5yqIjjU",
  authDomain: "endyia-tarot.firebaseapp.com",
  projectId: "endyia-tarot",
  storageBucket: "endyia-tarot.firebasestorage.app",
  messagingSenderId: "735998127433",
  appId: "1:735998127433:web:5afd6f7c859a317566be98",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

function createAuth() {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Hot reload / duplicate init: fall back to existing instance.
    return getAuth(app);
  }
}

export const auth = createAuth();