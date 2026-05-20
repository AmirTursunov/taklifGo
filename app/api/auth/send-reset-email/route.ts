import { NextRequest, NextResponse } from 'next/server'
import { DbService } from '@/lib/db-service'
import crypto from 'crypto'

// ── Rate limiting (memory, per-process) ──────────────────────
// Production da Redis ishlatish tavsiya etiladi
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (!limit || limit.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }) // 15 min window
    return true
  }
  if (limit.count >= 3) return false // Max 3 attempts per 15 min
  limit.count++
  return true
}

// ── Email templates ───────────────────────────────────────────
const templates = {
  uz: {
    subject: 'TaklifGo – Parolni tiklash',
    greeting: (name: string) => `Salom${name ? ', ' + name : ''}!`,
    body: "Parolingizni tiklash uchun quyidagi tugmani bosing:",
    button: 'Parolni tiklash',
    warning: "Agar siz bu so'rovni yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring. Havola 1 soat davomida amal qiladi.",
    footer: '© 2025 TaklifGo · Onlayn taklifnomalar platformasi',
    fallbackText: 'Tugma ishlamasa, quyidagi havolani brauzeringizga nusxalang:',
  },
  ru: {
    subject: 'TaklifGo – Сброс пароля',
    greeting: (name: string) => `Здравствуйте${name ? ', ' + name : ''}!`,
    body: 'Нажмите кнопку ниже, чтобы сбросить пароль:',
    button: 'Сбросить пароль',
    warning: 'Если вы не отправляли этот запрос — просто проигнорируйте письмо. Ссылка действительна 1 час.',
    footer: '© 2025 TaklifGo · Платформа онлайн-приглашений',
    fallbackText: 'Если кнопка не работает, скопируйте ссылку в браузер:',
  },
  en: {
    subject: 'TaklifGo – Password Reset',
    greeting: (name: string) => `Hello${name ? ', ' + name : ''}!`,
    body: 'Click the button below to reset your password:',
    button: 'Reset Password',
    warning: "If you didn't request this, you can safely ignore this email. This link expires in 1 hour.",
    footer: '© 2025 TaklifGo · Online Invitation Platform',
    fallbackText: "If the button doesn't work, copy this link into your browser:",
  },
}

function buildEmailHtml(lang: 'uz' | 'ru' | 'en', name: string, resetLink: string) {
  const t = templates[lang]
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${t.subject}</title>
</head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:28px;box-shadow:0 4px 40px rgba(92,99,82,0.1);overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#98a08d,#5c6352);padding:44px 40px 36px;text-align:center;">
            <p style="margin:0 0 20px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 18px;font-size:11px;font-weight:800;color:#fff;letter-spacing:0.25em;text-transform:uppercase;">✦ TaklifGo</p>
            <div style="width:68px;height:68px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;font-size:30px;line-height:68px;text-align:center;">🔐</div>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">${t.subject.replace('TaklifGo – ', '')}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 10px;color:#5c6352;font-size:17px;font-weight:600;">${t.greeting(name)}</p>
            <p style="margin:0 0 32px;color:#7a8270;font-size:15px;line-height:1.75;">${t.body}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
              <tr><td align="center">
                <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#98a08d,#5c6352);color:#fff;text-decoration:none;padding:15px 42px;border-radius:100px;font-size:15px;font-weight:700;box-shadow:0 6px 20px rgba(92,99,82,0.35);">
                  ${t.button} →
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;color:#7a8270;font-size:13px;">${t.fallbackText}</p>
            <p style="margin:0 0 24px;background:#f5f3f0;border-radius:10px;padding:12px 14px;word-break:break-all;font-size:12px;color:#98a08d;">${resetLink}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background:#fff8f0;border:1px solid #fde8c8;border-radius:14px;padding:15px 18px;">
                <p style="margin:0;color:#b07840;font-size:13px;line-height:1.65;">⚠️ ${t.warning}</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f3f0;padding:22px 40px;text-align:center;border-top:1px solid #ede9e3;">
            <p style="margin:0;color:#98a08d;font-size:12px;">${t.footer}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Email sender: Strictly Gmail SMTP via Nodemailer ──────────
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpUser || !smtpPass) {
    throw new Error('smtp-not-configured')
  }

  const cleanUser = smtpUser.trim()
  const cleanPass = smtpPass.trim()

  const nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: cleanUser, pass: cleanPass },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
  })

  // Premium spam-reduction headers for maximum Inbox delivery
  await transporter.sendMail({
    from: `"TaklifGo" <${cleanUser}>`,
    to,
    subject,
    html,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'List-Unsubscribe': `<mailto:${cleanUser}?subject=unsubscribe>`,
      'Precedence': 'bulk',
    }
  })

  console.log(`✅ Email successfully sent via Gmail SMTP to ${to}`)
}

// ── Route handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limit — IP bo'yicha
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'too-many-requests' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, lang = 'uz' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const validLang = (['uz', 'ru', 'en'].includes(lang) ? lang : 'uz') as 'uz' | 'ru' | 'en'
    const lowerEmail = email.toLowerCase().trim()

    // 1. Foydalanuvchini tekshir
    const userData = await DbService.getUserByEmail(lowerEmail)
    if (!userData) {
      // Xavfsizlik: email mavjudligini oshkor qilmaymiz
      // Shunga qaramay muvaffaqiyatli javob qaytaramiz
      return NextResponse.json({ success: true })
    }

    const userName = userData.displayName || userData.name || ''

    // 2. Xavfsiz token yaratish
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1 soat

    // 3. Tokenni DB ga saqlash
    await DbService.savePasswordResetToken(resetTokenHash, {
      email: lowerEmail,
      token: resetTokenHash,
      expiresAt,
      lang: validLang,
      createdAt: Date.now(),
    })

    // 4. Havola va HTML yaratish
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`
    const html = buildEmailHtml(validLang, userName, resetLink)
    const subject = templates[validLang].subject

    // 5. Email yuborish
    await sendEmail(lowerEmail, subject, html)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('send-reset-email error:', err)
    return NextResponse.json(
      { error: 'mail-delivery-failed', details: err.message },
      { status: 500 }
    )
  }
}