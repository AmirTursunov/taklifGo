import { NextRequest, NextResponse } from 'next/server'
import { DbService } from '@/lib/db-service'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'missing-fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'password-too-short' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase().trim()

    // 1. Check if user already exists
    const existingUser = await DbService.getUserByEmail(lowerEmail)
    if (existingUser) {
      return NextResponse.json({ error: 'email-already-in-use' }, { status: 400 })
    }

    // 2. Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // 3. Generate a secure random UUID as UID
    const uid = crypto.randomUUID()

    // 4. Save user profile using DbService (Supports Firestore and Local JSON seamlessly)
    await DbService.createUser(uid, {
      uid,
      email: lowerEmail,
      displayName: name,
      photoURL: '',
      passwordHash,
      provider: 'credentials',
      createdAt: Date.now(),
      lastSeen: Date.now(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Register API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
