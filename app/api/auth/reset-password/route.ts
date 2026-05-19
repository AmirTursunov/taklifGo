import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import * as admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'password-too-short' }, { status: 400 })
    }

    // 1. Initialize Firebase Admin if not already done
    if (!admin.apps.length) {
      return NextResponse.json({ error: 'admin-not-configured' }, { status: 500 })
    }

    // 2. Find the token in Firestore
    const tokenQuery = await adminDb
      .collection('password_resets')
      .where('token', '==', token)
      .limit(1)
      .get()

    if (tokenQuery.empty) {
      return NextResponse.json({ error: 'invalid-token' }, { status: 400 })
    }

    const tokenDoc = tokenQuery.docs[0]
    const resetData = tokenDoc.data()

    // 3. Check expiration (1 hour)
    if (resetData.expiresAt < Date.now()) {
      await tokenDoc.ref.delete()
      return NextResponse.json({ error: 'expired-token' }, { status: 400 })
    }

    // 4. Update the user's password in Firebase Auth using Admin SDK
    try {
      const userRecord = await admin.auth().getUserByEmail(resetData.email)
      await admin.auth().updateUser(userRecord.uid, {
        password: password,
      })
    } catch (authErr: any) {
      console.error('Error updating user password via Admin SDK:', authErr)
      return NextResponse.json({ error: authErr.message }, { status: 500 })
    }

    // 5. Delete the token from Firestore so it cannot be reused
    await tokenDoc.ref.delete()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('reset-password API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
