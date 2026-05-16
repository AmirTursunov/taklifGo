'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Download,
  Wallet,
  PiggyBank
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

const INVITATION_PRICE = 25000

export default function RevenuePage() {
  const [data, setData] = useState({
    total: 0,
    monthly: 0,
    pending: 0,
    byCategory: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const snap = await getDocs(collection(db, "invitations"))
        let total = 0
        let pending = 0
        const cats: any = {}

        snap.forEach(doc => {
          const inv = doc.data()
          if (inv.status === 'active') {
            total += INVITATION_PRICE
            const cat = inv.category || 'wedding'
            cats[cat] = (cats[cat] || 0) + INVITATION_PRICE
          } else if (inv.status === 'pending') {
            pending += INVITATION_PRICE
          }
        })

        setData({
          total,
          monthly: total * 0.4, // Mock monthly for visual
          pending,
          byCategory: Object.entries(cats).map(([name, value]) => ({ name, value }))
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  const COLORS = ['#98a08d', '#5c6352', '#D4AF37', '#1a56a0']

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Moliyaviy Hisobot</h1>
          <p className="text-[#98a08d] font-medium">Barcha to'lovlar va daromadlar tahlili.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl shadow-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
          <Download className="w-4 h-4" />
          PDF Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#98a08d] p-10 rounded-[3rem] text-white shadow-2xl shadow-[#98a08d]/40 relative overflow-hidden">
          <Wallet className="absolute -bottom-10 -right-10 w-40 h-40 text-white/10 rotate-12" />
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Umumiy Daromad</p>
          <h2 className="text-4xl font-black tracking-tighter">{data.total.toLocaleString()} UZS</h2>
          <div className="mt-6 flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-md">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">+24% o'sish</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl relative overflow-hidden">
          <PiggyBank className="absolute -bottom-10 -right-10 w-40 h-40 text-[#98a08d]/5 rotate-12" />
          <p className="text-xs font-black text-[#98a08d] uppercase tracking-[0.2em] mb-2">Kutilayotgan To'lovlar</p>
          <h2 className="text-4xl font-black text-[#5c6352] tracking-tighter">{data.pending.toLocaleString()} UZS</h2>
          <div className="mt-6 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-[#98a08d]">Tasdiqlanishi kerak</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl">
          <p className="text-xs font-black text-[#98a08d] uppercase tracking-[0.2em] mb-2">O'rtacha Chek</p>
          <h2 className="text-4xl font-black text-[#5c6352] tracking-tighter">25,000 UZS</h2>
          <div className="mt-6 flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-sm font-bold">Stabil narx</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-[#98a08d]/10 shadow-2xl space-y-10">
        <h3 className="text-xl font-black text-[#5c6352] tracking-tight">Kategoriyalar bo'yicha daromad</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byCategory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#98a08d10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#98a08d', fontSize: 12, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#98a08d', fontSize: 12, fontWeight: 700 }} />
              <Tooltip 
                cursor={{ fill: '#f8f7f4' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[20, 20, 0, 0]} barSize={60}>
                {data.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

function CheckCircleIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
