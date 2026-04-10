import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);