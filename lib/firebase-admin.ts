import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "invitation-28b16",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newline in private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDb = admin.firestore();

export { adminDb };
