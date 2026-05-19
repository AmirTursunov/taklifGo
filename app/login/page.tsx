'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from '@/lib/AuthContext'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { lang } = useLanguage()
  const { user, loading: authLoading } = useAuth()

  // ── 1. Load Google Identity Services SDK Dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    
    script.onload = () => {
      if ((window as any).google) {
        // Universal client ID associated with the Firebase Project
        const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '897270560095-2s1jtrg1plhgfepn0f5gcrcl173p7cld.apps.googleusercontent.com'
        ;(window as any).google.accounts.id.initialize({
          client_id: client_id,
          callback: handleGoogleCredentialResponse,
        })
        ;(window as any).google.accounts.id.renderButton(
          document.getElementById('googleSignInBtn'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: 382, 
            shape: 'pill',
            text: 'continue_with'
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignUp, lang])

  // ── 2. Handle Google Login JWT ID Token Response (Instant same-origin credential login)
  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true)
    setError('')
    try {
      const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth')
      const credential = GoogleAuthProvider.credential(response.credential)
      await signInWithCredential(auth, credential)
      toast.success(lang === 'uz' ? "Xush kelibsiz!" : lang === 'ru' ? "Добро пожаловать!" : "Welcome!")
      router.push('/')
    } catch (err: any) {
      console.error("Google native login error:", err)
      const msg = getErrorMessage(err.code || err.message)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── 3. If already logged in, redirect to home
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const getErrorMessage = (code: string) => {
    const errors: Record<string, Record<string, string>> = {
      'auth/invalid-email': {
        uz: 'Email manzili noto\'g\'ri kiritilgan',
        ru: 'Неверный формат email',
        en: 'Invalid email format'
      },
      'auth/user-not-found': {
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found'
      },
      'auth/wrong-password': {
        uz: 'Parol noto\'g\'ri',
        ru: 'Неверный пароль',
        en: 'Wrong password'
      },
      'auth/email-already-in-use': {
        uz: 'Ushbu email allaqachon ro\'yxatdan o\'tgan',
        ru: 'Этот email уже зарегистрирован',
        en: 'Email already registered'
      },
      'auth/weak-password': {
        uz: 'Parol juda oddiy (kamida 6 ta belgi kerak)',
        ru: 'Слишком слабый пароль (минимум 6 символов)',
        en: 'Weak password (min 6 characters)'
      },
      'auth/invalid-credential': {
        uz: 'Email yoki parol noto\'g\'ri',
        ru: 'Неверный email или пароль',
        en: 'Invalid email or password'
      }
    }

    if (errors[code]) return errors[code][lang as keyof typeof errors[string]] || errors[code].en
    return lang === 'uz' ? 'Xatolik yuz berdi' : lang === 'ru' ? 'Произошла ошибка' : 'An error occurred'
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await updateProfile(userCredential.user, { displayName: name })
        }
        toast.success(lang === 'uz' ? "Muvaffaqiyatli ro'yxatdan o'tdingiz!" : "Вы успешно зарегистрировались!")
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success(lang === 'uz' ? "Xush kelibsiz!" : "Добро пожаловать!")
      }
      router.push('/')
    } catch (err: any) {
      const msg = getErrorMessage(err.code)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      const msg = lang === 'uz'
        ? 'Iltimos, avval email manzilingizni kiriting'
        : lang === 'ru'
          ? 'Пожалуйста, сначала введите ваш email'
          : 'Please enter your email address first'
      setError(msg)
      toast.warning(msg)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      })
      const json = await res.json()

      if (!res.ok) {
        const errorMsg = json.error === 'user-not-found'
          ? (lang === 'uz' ? 'Bu email bilan foydalanuvchi topilmadi' : lang === 'ru' ? 'Пользователь с таким email не найден' : 'No user found with this email')
          : (lang === 'uz' ? 'Parolni tiklash xizmati sozlanmagan. Iltimos, administratorga murojaat qiling.' : lang === 'ru' ? 'Служба сброса пароля не настроена. Пожалуйста, обратитесь к администратору.' : 'Password reset service is not configured. Please contact the administrator.')
        throw new Error(errorMsg)
      }

      setError('')
      const successMsg = lang === 'uz'
        ? `✅ Parolni tiklash xati ${email} manziliga yuborildi! Iltimos, kiruvchi va spam papkalarni tekshiring.`
        : lang === 'ru'
          ? `✅ Письмо для сброса пароля отправлено на ${email}! Пожалуйста, проверьте папки Входящие и Спам.`
          : `✅ Password reset email sent to ${email}! Please check your inbox and spam folder.`
      toast.success(successMsg, { autoClose: 8000 })
    } catch (err: any) {
      const msg = err.code ? getErrorMessage(err.code) : err.message
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Show loading screen while checking initial Auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin" />
        <p className="text-[#98a08d] text-sm font-medium">
          {lang === 'uz' ? 'Yuklanmoqda...' : lang === 'ru' ? 'Загрузка...' : 'Loading...'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 rounded-[2.5rem] border-0 shadow-2xl space-y-8 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#98a08d]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-block px-3 py-1 bg-[#98a08d]/10 rounded-full text-[10px] font-bold text-[#98a08d] uppercase tracking-[0.2em] mb-2">
            {isSignUp ? (lang === 'uz' ? 'Yangi foydalanuvchi' : 'Новый пользователь') : (lang === 'uz' ? 'Kirish' : 'Вход')}
          </div>
          <h1 className="text-3xl font-serif text-[#5c6352]">
            {isSignUp ? (lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация') : (lang === 'uz' ? 'Xush kelibsiz' : 'С возвращением')}
          </h1>
          <p className="text-[#98a08d] text-sm">
            {isSignUp ? (lang === 'uz' ? 'O\'z hisobingizni yarating' : 'Создайте свой аккаунт') : (lang === 'uz' ? '3D taklifnomalar olamiga xush kelibsiz' : 'Добро пожаловать в мир 3D приглашений')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 relative z-10">
            {error}
          </div>
        )}

        <div className="space-y-4 relative z-10">
          {/* Native bug-free Google Sign-In button container */}
          <div className="flex justify-center w-full min-h-[50px]">
            <div id="googleSignInBtn" className="w-full flex justify-center" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#98a08d]/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#98a08d] font-bold tracking-widest">{lang === 'uz' ? 'YOKI' : 'ИЛИ'}</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-[#98a08d]">{lang === 'uz' ? 'Ismingiz' : 'Ваше Имя'}</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a08d]" />
                  <input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all bg-white text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[#98a08d]">{lang === 'uz' ? 'Email manzilingiz' : 'Ваш Email'}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a08d]" />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all bg-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#98a08d]">{lang === 'uz' ? 'Parol' : 'Пароль'}</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#98a08d] hover:text-[#5c6352] transition-colors font-bold"
                >
                  {lang === 'uz' ? 'Parolni unutdingizmi?' : 'Забыли пароль?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a08d]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all bg-white text-sm"
                  required={!loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-2xl py-8 transition-all shadow-xl shadow-[#98a08d]/20 flex items-center justify-center gap-2 text-lg font-bold"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? (lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация') : (lang === 'uz' ? 'Kirish' : 'Войти'))}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-sm text-[#98a08d] hover:text-[#5c6352] transition-colors font-medium underline underline-offset-4"
            >
              {isSignUp
                ? (lang === 'uz' ? 'Akkauntingiz bormi? Kirish' : 'Уже есть аккаунт? Войти')
                : (lang === 'uz' ? 'Akkauntingiz yo\'qmi? Ro\'yxatdan o\'tish' : 'Нет аккаунта? Зарегистрироваться')}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
