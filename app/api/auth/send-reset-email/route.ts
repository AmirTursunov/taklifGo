import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import * as admin from 'firebase-admin'
import crypto from 'crypto'

const templates = {
  uz: {
    subject: "TaklifGo – Parolni tiklash",
    greeting: (name: string) => `Salom${name ? ', ' + name : ''}!`,
    body: "Parolingizni tiklash uchun quyidagi tugmani bosing va yangi parol kiriting:",
    button: "Parolni tiklash",
    warning: "Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring. Havolaning amal qilish muddati 1 soat.",
    footer: "© 2025 TaklifGo · Onlayn taklifnomalar platformasi",
    fallbackText: "Havola ishlamasa, quyidagi manzilni brauzeringizga nusxalang:",
  },
  ru: {
    subject: "TaklifGo – Сброс пароля",
    greeting: (name: string) => `Здравствуйте${name ? ', ' + name : ''}!`,
    body: "Нажмите кнопку ниже, чтобы сбросить свой старый пароль и создать новый:",
    button: "Сбросить пароль",
    warning: "Если вы не отправляли этот запрос — просто проигнорируйте это письмо. Ссылка действительна в течение 1 часа.",
    footer: "© 2025 TaklifGo · Платформа онлайн-приглашений",
    fallbackText: "Если кнопка не работает, скопируйте ссылку в браузер:",
  },
  en: {
    subject: "TaklifGo – Password Reset",
    greeting: (name: string) => `Hello${name ? ', ' + name : ''}!`,
    body: "Click the button below to reset your password and create a new one:",
    button: "Reset Password",
    warning: "If you didn't request this, you can safely ignore this email. This link expires in 1 hour.",
    footer: "© 2025 TaklifGo · Online Invitation Platform",
    fallbackText: "If the button doesn't work, copy this link into your browser:",
  },
}

function buildEmailHtml(lang: 'uz' | 'ru' | 'en', name: string, resetLink: string) {
  const t = templates[lang]
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#faf9f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f6;padding:48px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:28px;box-shadow:0 4px 40px rgba(92,99,82,0.1);overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#98a08d 0%,#5c6352 100%);padding:44px 40px 36px;text-align:center;">
            <p style="margin:0 0 20px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 18px;font-size:11px;font-weight:800;color:#ffffff;letter-spacing:0.25em;text-transform:uppercase;">✦ TaklifGo</p>
            <div style="width:68px;height:68px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;font-size:30px;line-height:68px;text-align:center;">🔐</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${t.subject.replace('TaklifGo – ','')}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 10px;color:#5c6352;font-size:17px;font-weight:600;">${t.greeting(name)}</p>
            <p style="margin:0 0 32px;color:#7a8270;font-size:15px;line-height:1.75;">${t.body}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
              <tr><td align="center">
                <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#98a08d 0%,#5c6352 100%);color:#ffffff;text-decoration:none;padding:15px 42px;border-radius:100px;font-size:15px;font-weight:700;letter-spacing:0.4px;box-shadow:0 6px 20px rgba(92,99,82,0.35);">
                  ${t.button} &rarr;
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;color:#7a8270;font-size:13px;">${t.fallbackText}</p>
            <p style="margin:0 0 24px;background:#f5f3f0;border-radius:10px;padding:12px 14px;word-break:break-all;font-size:12px;color:#98a08d;">${resetLink}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, lang = 'uz' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const validLang = (['uz', 'ru', 'en'].includes(lang) ? lang : 'uz') as 'uz' | 'ru' | 'en'

    // 1. Check if Firebase Admin and Resend are configured
    if (!admin.apps.length || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'admin-not-configured' }, { status: 500 })
    }

    // 2. Verify user exists in Firebase Auth
    let userName = ''
    try {
      const userRecord = await admin.auth().getUserByEmail(email)
      userName = userRecord.displayName || ''
    } catch (authErr: any) {
      if (authErr.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'user-not-found' }, { status: 400 })
      }
      return NextResponse.json({ error: authErr.message }, { status: 500 })
    }

    // 3. Generate a secure random token
    const token = crypto.randomUUID()
    const expiresAt = Date.now() + 3600000 // 1 hour expiration

    // 4. Save the token to Firestore
    await adminDb.collection('password_resets').doc(token).set({
      email,
      token,
      expiresAt,
      lang: validLang,
      createdAt: Date.now()
    })

    // 5. Build localized reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taklif-go.vercel.app'
    const resetLink = `${baseUrl}/reset-password?token=${token}`

    // 6. Send the premium HTML email via Resend
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const t = templates[validLang]
    const html = buildEmailHtml(validLang, userName, resetLink)

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const { error } = await resend.emails.send({
      from: `TaklifGo <${fromEmail}>`,
      to: [email],
      subject: t.subject,
      html,
    })

    if (error) {
      console.error('Resend custom mail send error:', error)
      return NextResponse.json({ error: (error as any).message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('send-reset-email API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
