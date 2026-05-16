'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { 
  Save, 
  Settings as SettingsIcon, 
  CreditCard, 
  Phone, 
  Bell, 
  Globe,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    price: 25000,
    supportPhone: '+998 90 123 45 67',
    notificationsEnabled: true,
    siteName: '3D Invitations',
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "settings", "global")
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setSettings(prev => ({ ...prev, ...snap.data() }))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "global"), settings)
      toast.success("Sozlamalar muvaffaqiyatli saqlandi!")
    } catch (e) {
      toast.error("Saqlashda xatolik yuz berdi")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Sozlamalar</h1>
          <p className="text-[#98a08d] font-medium">Platforma parametrlarini boshqarish.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-[#98a08d] text-white rounded-2xl shadow-xl shadow-[#98a08d]/20 font-black text-xs uppercase tracking-widest hover:bg-[#868d7c] transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Saqlash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRICE SETTINGS */}
        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-6">
          <div className="flex items-center gap-4 text-[#5c6352]">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-black tracking-tight">To'lov Sozlamalari</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Taklifnoma narxi (UZS)</label>
              <input 
                type="number"
                value={settings.price}
                onChange={(e) => setSettings({ ...settings, price: Number(e.target.value) })}
                className="w-full px-6 py-4 bg-[#f8f7f4] border border-[#98a08d]/10 rounded-2xl outline-none focus:ring-2 focus:ring-[#98a08d]/20 font-bold text-[#5c6352]"
              />
            </div>
          </div>
        </div>

        {/* SUPPORT SETTINGS */}
        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-6">
          <div className="flex items-center gap-4 text-[#5c6352]">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Aloqa & Qo'llab-quvvatlash</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Support Telefon raqami</label>
              <input 
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-6 py-4 bg-[#f8f7f4] border border-[#98a08d]/10 rounded-2xl outline-none focus:ring-2 focus:ring-[#98a08d]/20 font-bold text-[#5c6352]"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION SETTINGS */}
        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-6">
          <div className="flex items-center gap-4 text-[#5c6352]">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Bildirishnomalar</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#f8f7f4] rounded-2xl border border-[#98a08d]/5">
            <div>
              <p className="text-sm font-bold text-[#5c6352]">Telegram bildirishnomalar</p>
              <p className="text-[10px] text-[#98a08d] font-medium">Yangi buyurtmalar haqida xabar berish</p>
            </div>
            <button 
              onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-[#98a08d]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* SYSTEM SETTINGS */}
        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-6">
          <div className="flex items-center gap-4 text-[#5c6352]">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Tizim Sozlamalari</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#f8f7f4] rounded-2xl border border-[#98a08d]/5">
            <div>
              <p className="text-sm font-bold text-[#5c6352]">Texnik ishlar rejimi</p>
              <p className="text-[10px] text-[#98a08d] font-medium">Saytni vaqtincha yopish</p>
            </div>
            <button 
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#5c6352] p-10 rounded-[3rem] text-white flex items-center justify-between relative overflow-hidden">
        <ShieldCheck className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-black tracking-tight uppercase">Xavfsizlik Protokoli</h3>
          <p className="text-white/60 text-sm max-w-md font-medium">Barcha o'zgarishlar darhol bazada saqlanadi va butun platforma bo'ylab qo'llaniladi.</p>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-md">
          <SettingsIcon className="w-8 h-8 text-white animate-spin-slow" />
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
