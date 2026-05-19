import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAi7LtxLWbaVaEMGyu9JpY8T_4045GjzLQ",
  authDomain: "invitation-28b16.firebaseapp.com",
  projectId: "invitation-28b16",
  storageBucket: "invitation-28b16.firebasestorage.app",
  messagingSenderId: "897270560095",
  appId: "1:897270560095:web:16eb7ec53b1f9cc2e7f2ea",
  measurementId: "G-E2V3FRC0KD"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app, db, storage, auth };
