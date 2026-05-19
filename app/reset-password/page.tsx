'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lang, setLang] = useState<'uz' | 'ru' | 'en'>('uz')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    // Detect preferred language from browser or default to uz
    const navLang = navigator.language.toLowerCase()
    if (navLang.startsWith('ru')) setLang('ru')
    else if (navLang.startsWith('en')) setLang('en')
  }, [])

  const t = {
    uz: {
      title: "Yangi parol o'rnatish",
      subtitle: "Profilingiz uchun xavfsiz va yangi parol yarating",
      newPass: "Yangi parol",
      confirmPass: "Parolni tasdiqlang",
      btn: "Parolni yangilash",
      successTitle: "Muvaffaqiyatli yangilandi!",
      successDesc: "Sizning parolingiz muvaffaqiyatli almashtirildi. Endi yangi parolingiz bilan tizimga kirishingiz mumkin.",
      loginBtn: "Kirish sahifasiga o'tish",
      errShort: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      errMismatch: "Kiritilgan parollar bir-biriga mos kelmadi",
      errInvalidToken: "Tizimga kirish kaliti (token) topilmadi yoki muddati tugagan",
      errorOccurred: "Xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring.",
    },
    ru: {
      title: "Установка нового пароля",
      subtitle: "Создайте надежный и новый пароль для вашего профиля",
      newPass: "Новый пароль",
      confirmPass: "Подтвердите пароль",
      btn: "Обновить пароль",
      successTitle: "Успешно обновлено!",
      successDesc: "Ваш пароль был успешно изменен. Теперь вы можете войти в систему с новым паролем.",
      loginBtn: "Перейти к авторизации",
      errShort: "Пароль должен состоять минимум из 6 символов",
      errMismatch: "Введенные пароли не совпадают",
      errInvalidToken: "Ключ доступа (токен) не найден или срок его действия истек",
      errorOccurred: "Произошла ошибка. Пожалуйста, попробуйте позже.",
    },
    en: {
      title: "Set New Password",
      subtitle: "Create a secure and brand new password for your profile",
      newPass: "New Password",
      confirmPass: "Confirm Password",
      btn: "Update Password",
      successTitle: "Successfully Updated!",
      successDesc: "Your password has been successfully changed. You can now log in using your new password.",
      loginBtn: "Go to Login Page",
      errShort: "Password must be at least 6 characters long",
      errMismatch: "Passwords do not match",
      errInvalidToken: "Access token is missing or has expired",
      errorOccurred: "An error occurred. Please try again later.",
    }
  }[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error(t.errInvalidToken)
      return
    }

    if (password.length < 6) {
      toast.warning(t.errShort)
      return
    }

    if (password !== confirmPassword) {
      toast.warning(t.errMismatch)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.error === 'invalid-token' || json.error === 'expired-token') {
          throw new Error(t.errInvalidToken)
        } else if (json.error === 'password-too-short') {
          throw new Error(t.errShort)
        }
        throw new Error(t.errorOccurred)
      }

      toast.success(t.successTitle)
      setSuccess(true)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md p-8 rounded-[2.5rem] border-0 shadow-2xl space-y-6 bg-white text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-[#eef3ec] rounded-full flex items-center justify-center text-[#5c6352] mb-2 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-[#5c6352]">{t.successTitle}</h1>
        <p className="text-sm text-[#7a8270] leading-relaxed">{t.successDesc}</p>
        <Button 
          onClick={() => router.push('/login')}
          className="w-full h-12 rounded-full bg-gradient-to-r from-[#98a08d] to-[#5c6352] hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-4"
        >
          {t.loginBtn}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md p-8 rounded-[2.5rem] border-0 shadow-2xl space-y-8 bg-white relative overflow-hidden">
      {/* Background elegant circles */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#f4f3ef] opacity-60 z-0 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#faf9f6] opacity-80 z-0 pointer-events-none" />

      <div className="space-y-2 text-center relative z-10">
        <h1 className="text-3xl font-extrabold text-[#5c6352] tracking-tight">{t.title}</h1>
        <p className="text-sm text-[#7a8270]">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="space-y-2">
          <Label className="text-[#5c6352] text-xs font-semibold uppercase tracking-wider">{t.newPass}</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a08d]" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-[#ede9e3] focus:border-[#98a08d] focus:ring-1 focus:ring-[#98a08d] transition-all bg-white text-[#5c6352] text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#5c6352] text-xs font-semibold uppercase tracking-wider">{t.confirmPass}</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a08d]" />
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-[#ede9e3] focus:border-[#98a08d] focus:ring-1 focus:ring-[#98a08d] transition-all bg-white text-[#5c6352] text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !token}
          className="w-full h-12 rounded-full bg-gradient-to-r from-[#98a08d] to-[#5c6352] hover:opacity-90 disabled:opacity-50 text-white font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t.btn}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
