'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Chrome, Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
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
        ru: 'Неверный parol',
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast.success(lang === 'uz' ? "Xush kelibsiz!" : "Добро пожаловать!")
      router.push('/')
    } catch (err: any) {
      const msg = getErrorMessage(err.code)
      setError(msg)
      toast.error(msg)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      const msg = lang === 'uz' ? 'Iltimos, avval email manzilingizni kiriting' : 'Пожалуйста, сначала введите ваш email'
      setError(msg)
      toast.warning(msg)
      return
    }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setError('')
      toast.info(lang === 'uz' ? 'Parolni tiklash xati yuborildi' : 'Письмо для сброса пароля отправлено')
    } catch (err: any) {
      const msg = getErrorMessage(err.code)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
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
            {isSignUp ? (lang === 'uz' ? 'O\'z hisobingizni yarating' : 'Создайте свой аккаунт') : (lang === 'uz' ? '3D taklifnomalar olamiga xush kelibsiz' : 'Добро пожаловать v mir 3D приглашений')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 relative z-10">
            {error}
          </div>
        )}

        <div className="space-y-4 relative z-10">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full rounded-2xl py-6 border-[#98a08d]/20 text-[#5c6352] hover:bg-[#98a08d] hover:text-white transition-all flex items-center justify-center gap-3 font-bold"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            {lang === 'uz' ? 'Google orqali davom etish' : 'Продолжить через Google'}
          </Button>

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
                    className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all"
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
                  className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all"
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
                  className="w-full pl-12 pr-4 rounded-2xl border border-[#98a08d]/20 py-4 outline-none focus:border-[#98a08d] transition-all"
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
