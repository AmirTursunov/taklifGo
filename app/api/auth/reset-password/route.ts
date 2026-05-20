import { NextRequest, NextResponse } from 'next/server'
import { DbService } from '@/lib/db-service'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// ── Rate limiting ─────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (!limit || limit.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (limit.count >= 5) return false
  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'too-many-requests' }, { status: 429 })
    }

    const body = await req.json()
    const { token, password } = body

    // 1. Input validation
    if (!token || typeof token !== 'string' || token.length < 32) {
      return NextResponse.json({ error: 'invalid-token' }, { status: 400 })
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'password-required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'password-too-short' }, { status: 400 })
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'password-too-long' }, { status: 400 })
    }

    // 2. Raw token → hash qilamiz va DB dan qidiramiz
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const resetData = await DbService.getPasswordResetToken(resetTokenHash)

    if (!resetData) {
      return NextResponse.json({ error: 'invalid-token' }, { status: 400 })
    }

    // 3. Muddatni tekshirish
    if (resetData.expiresAt < Date.now()) {
      // Eskirgan tokenni o'chiramiz
      await DbService.deletePasswordResetToken(resetTokenHash).catch(() => { })
      return NextResponse.json({ error: 'expired-token' }, { status: 400 })
    }

    // 4. Foydalanuvchini topish
    const userData = await DbService.getUserByEmail(resetData.email)
    if (!userData) {
      // Token bor, user yo'q — tokenni o'chiramiz
      await DbService.deletePasswordResetToken(resetTokenHash).catch(() => { })
      return NextResponse.json({ error: 'user-not-found' }, { status: 400 })
    }

    // 5. Yangi parolni hash qilish
    const salt = await bcrypt.genSalt(12) // 12 round — xavfsizroq
    const newPasswordHash = await bcrypt.hash(password, salt)
    const uid = userData.uid || userData.id

    // 6. Parolni yangilash
    await DbService.updateUser(uid, {
      passwordHash: newPasswordHash,
      lastSeen: Date.now(),
      // Barcha sessiyalarni bekor qilish uchun
      passwordChangedAt: Date.now(),
    })

    // 7. Tokenni o'chirish (bir martalik)
    await DbService.deletePasswordResetToken(resetTokenHash)

    console.log(`✅ Password reset successful for ${resetData.email}`)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('reset-password error:', err)
    return NextResponse.json({ error: 'server-error' }, { status: 500 })
  }
}