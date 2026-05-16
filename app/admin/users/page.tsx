'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Calendar,
  ChevronRight,
  Loader2,
  UserCheck
} from 'lucide-react'

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const q = query(collection(db, "users"), orderBy("lastSeen", "desc"))
        const snap = await getDocs(q)
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Foydalanuvchilar</h1>
          <p className="text-[#98a08d] font-medium">Platforma a'zolari va ularning faolligi.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a08d]" />
          <input 
            type="text" 
            placeholder="Email yoki ism bo'yicha..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-[#98a08d]/20 rounded-2xl text-sm focus:ring-2 focus:ring-[#98a08d]/20 outline-none w-72 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#98a08d] animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#98a08d] font-bold">
            Foydalanuvchilar topilmadi
          </div>
        ) : (
          filtered.map((user, i) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[2rem] border border-[#98a08d]/10 shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
                  className="w-14 h-14 rounded-2xl border-2 border-[#98a08d]/10 shadow-sm"
                  alt=""
                />
                <div className="flex-1">
                  <h3 className="text-sm font-black text-[#5c6352] line-clamp-1">{user.displayName || 'Ismsiz User'}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#98a08d] font-bold uppercase tracking-wider">
                    <UserCheck className="w-3 h-3 text-green-500" />
                    Verified
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#98a08d]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#98a08d]">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold">Email</span>
                  </div>
                  <span className="text-xs font-black text-[#5c6352]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#98a08d]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">Oxirgi kirish</span>
                  </div>
                  <span className="text-xs font-black text-[#5c6352]">
                    {user.lastSeen?.toDate().toLocaleDateString() || "Noma'lum"}
                  </span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-[#f8f7f4] hover:bg-[#98a08d] hover:text-white text-[#98a08d] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                Batafsil ko'rish
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
