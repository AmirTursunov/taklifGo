import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || "invitation-28b16",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase Admin initialized successfully");
    }
  } catch (error) {
    console.error("Firebase Admin init error:", error);
  }
}

// Agar build vaqtida env yo'q bo'lsa, app init bo'lmaydi va xato bermasligi uchun lazy init yoki bo'sh obyekt beramiz
const adminDb = admin.apps.length ? admin.firestore() : ({} as admin.firestore.Firestore);
export { adminDb };
