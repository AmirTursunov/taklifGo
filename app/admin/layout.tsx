'use client'

import { useAuth } from '@/lib/AuthContext'
import { isAdmin } from '@/lib/admin'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') setIsAuth(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (res.ok) {
        setIsAuth(true)
        sessionStorage.setItem('admin_authenticated', 'true')
      } else {
        alert('Noto\'g\'ri parol!')
      }
    } catch (e) {
      alert('Xatolik yuz berdi')
    } finally {
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#121212]">
        <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#121212] p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Access Denied</h1>
          <p className="text-white/40 max-w-xs mx-auto text-sm font-medium">
            Sizda ushbu sahifaga kirish huquqi yo'q. Faqat administratorlar kirishi mumkin.
          </p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[#98a08d] text-white rounded-xl font-bold hover:bg-[#868d7c] transition-all"
        >
          Asosiy sahifaga qaytish
        </button>
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#121212] p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Login</h1>
            <p className="text-white/40 text-sm">Davom etish uchun parolni kiriting</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin paroli..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#98a08d]/50 transition-all"
              autoFocus
            />
            <button 
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-[#98a08d] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#868d7c] transition-all flex items-center justify-center gap-2"
            >
              {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Kirish
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#98a08d]/10 px-10 py-6 flex items-center justify-between">
          <h2 className="text-xl font-serif text-[#5c6352] capitalize">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-[#5c6352]">{user.displayName || 'Admin'}</p>
              <p className="text-[10px] text-[#98a08d] font-bold uppercase">{user.email}</p>
            </div>
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
              className="w-10 h-10 rounded-full border-2 border-[#98a08d]/20"
              alt="Admin Profile"
            />
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
