import { NextRequest, NextResponse } from "next/server";

const FIREBASE_API_KEY = "AIzaSyAi7LtxLWbaVaEMGyu9JpY8T_4045GjzLQ"
const PROJECT_ID = "invitation-28b16"
const BASE_REST_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}`);
    
    if (res.status === 404) {
      // Create user doc if it doesn't exist
      await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fields: { 
            balance: { integerValue: "0" }, 
            totalReferrals: { integerValue: "0" } 
          } 
        })
      });
      return NextResponse.json({ balance: 0, totalReferrals: 0 });
    }

    const doc = await res.json();
    const fields = doc.fields || {};
    
    return NextResponse.json({
      balance: parseInt(fields.balance?.integerValue || "0", 10),
      totalReferrals: parseInt(fields.totalReferrals?.integerValue || "0", 10),
      email: fields.email?.stringValue || "",
      phone: fields.phone?.stringValue || "",
      displayName: fields.displayName?.stringValue || fields.name?.stringValue || ""
    });
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, email, displayName } = body
    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 })
    }
    
    const { DbService } = await import('@/lib/db-service')
    const updateData: any = {}
    if (email !== undefined) updateData.email = email.toLowerCase().trim()
    if (displayName !== undefined) updateData.displayName = displayName.trim()
    
    await DbService.updateUser(uid, updateData)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Update user error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

