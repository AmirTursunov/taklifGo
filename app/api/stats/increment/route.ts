import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const docRef = adminDb.collection("invitations").doc(id);
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
