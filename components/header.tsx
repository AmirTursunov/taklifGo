'use client'

import { useAuth } from '@/lib/AuthContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

export function Header() {
  const { user } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    toast.info(lang === 'uz' ? "Xayr! Yana kutib qolamiz." : "До свидания! Ждем вас снова.")
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#98a08d]/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-serif text-[#5c6352] tracking-tight">
            3D Invitations
          </Link>
          
          <div className="hidden md:flex p-1 bg-[#98a08d]/5 rounded-full border border-[#98a08d]/10">
            {(['uz', 'ru', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  lang === l ? 'bg-[#98a08d] text-white shadow-md' : 'text-[#98a08d] hover:bg-[#98a08d]/10'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-[#98a08d] hover:text-[#5c6352] hover:bg-[#98a08d]/5 gap-2 font-bold">
                  <UserIcon className="w-4 h-4" />
                  {t.myProfile}
                </Button>
              </Link>
              <Link href="/create">
                <Button className="bg-[#98a08d] hover:bg-[#868d7c] text-white gap-2 font-bold shadow-md shadow-[#98a08d]/20">
                  <Plus className="w-4 h-4" />
                  {t.newCreate}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2"
                title={t.logout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-[#98a08d] hover:bg-[#868d7c] text-white px-8 font-bold">
                {lang === 'uz' ? 'Kirish' : lang === 'ru' ? 'Войти' : 'Login'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
