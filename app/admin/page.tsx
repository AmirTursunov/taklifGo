'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const INVITATION_PRICE = 25000 // 25,000 UZS

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    pendingInvitations: 0,
    activeInvitations: 0,
    recentActivity: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersSnap = await getDocs(collection(db, "users"))
        const invSnap = await getDocs(collection(db, "invitations"))
        
        let pending = 0
        let active = 0
        let revenue = 0
        
        invSnap.forEach(doc => {
          const data = doc.data()
          if (data.status === 'pending') pending++
          if (data.status === 'active') {
            active++
            revenue += INVITATION_PRICE
          }
        })

        setStats({
          totalUsers: usersSnap.size,
          totalRevenue: revenue,
          pendingInvitations: pending,
          activeInvitations: active,
          recentActivity: invSnap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() }))
        })
      } catch (e) {
        console.error("Error fetching stats:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { name: 'Umumiy Daromad', value: stats.totalRevenue.toLocaleString() + ' UZS', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', trend: '+12%' },
    { name: 'Faol Taklifnomalar', value: stats.activeInvitations, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
    { name: 'Kutilayotganlar', value: stats.pendingInvitations, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2%' },
    { name: 'Foydalanuvchilar', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
  ]

  const chartData = [
    { name: 'Mon', rev: 125000 },
    { name: 'Tue', rev: 250000 },
    { name: 'Wed', rev: 175000 },
    { name: 'Thu', rev: 400000 },
    { name: 'Fri', rev: 350000 },
    { name: 'Sat', rev: 525000 },
    { name: 'Sun', rev: 600000 },
  ]

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Xush Kelibsiz!</h1>
          <p className="text-[#98a08d] font-medium">Bugungi hisobotlar va statistika bilan tanishing.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#98a08d]/20 rounded-xl shadow-sm font-bold text-xs text-[#5c6352] uppercase tracking-widest hover:bg-white/80 transition-all">
          <TrendingUp className="w-4 h-4" />
          Hisobotni Yuklash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-[#98a08d]/10 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6`}>
              <card.icon className={`w-7 h-7 ${card.color}`} />
            </div>
            <p className="text-xs font-black text-[#98a08d] uppercase tracking-[0.2em] mb-2">{card.name}</p>
            <h3 className="text-2xl font-black text-[#5c6352] tracking-tighter">{card.value}</h3>
            
            <div className="mt-4 flex items-center gap-1.5">
              <div className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                card.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {card.trend}
              </div>
              <span className="text-[10px] text-[#98a08d] font-medium">o'tgan haftaga nisbatan</span>
            </div>

            <ArrowUpRight className="absolute top-8 right-8 w-5 h-5 text-[#98a08d]/20 group-hover:text-[#98a08d]/50 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#5c6352] tracking-tight">Daromad Grafigi</h3>
            <select className="bg-[#f8f7f4] border border-[#98a08d]/10 rounded-lg px-4 py-2 text-xs font-bold text-[#5c6352]">
              <option>Oxirgi 7 kun</option>
              <option>Oxirgi 30 kun</option>
            </select>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#98a08d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#98a08d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#98a08d20" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#98a08d', fontSize: 12, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#98a08d', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#5c6352' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rev" 
                  stroke="#98a08d" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-[#98a08d]/10 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#5c6352] tracking-tight">Oxirgi Buyurtmalar</h3>
            <button className="text-[#98a08d] text-xs font-bold hover:underline">Hammasi</button>
          </div>
          
          <div className="space-y-6">
            {stats.recentActivity.map((inv, i) => (
              <div key={inv.id} className="flex items-center justify-between p-4 bg-[#f8f7f4] rounded-2xl border border-[#98a08d]/5 group hover:border-[#98a08d]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#98a08d]/10 shadow-sm">
                    <Sparkles className="w-5 h-5 text-[#98a08d]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#5c6352] line-clamp-1">{inv.names}</p>
                    <p className="text-[10px] text-[#98a08d] font-bold uppercase">{inv.templateId}</p>
                  </div>
                </div>
                <div className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
                  inv.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {inv.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
