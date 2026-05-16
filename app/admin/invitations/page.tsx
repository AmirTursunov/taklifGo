'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Check, 
  X, 
  Eye,
  Loader2,
  Calendar,
  MapPin,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function InvitationsManagement() {
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedInv, setSelectedInv] = useState<any>(null)

  const fetchInvitations = async () => {
    try {
      const q = query(collection(db, "invitations"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setInvitations(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      const docRef = doc(db, "invitations", id)
      await updateDoc(docRef, { status })
      toast.success(`Status "${status}" ga o'zgartirildi`)
      fetchInvitations()
      setSelectedInv(null)
    } catch (e) {
      toast.error("Xatolik yuz berdi")
    }
  }

  const filtered = invitations.filter(inv => {
    const matchesSearch = inv.names?.toLowerCase().includes(search.toLowerCase()) || 
                          inv.id.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || inv.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Taklifnomalar</h1>
          <p className="text-[#98a08d] font-medium">Barcha buyurtmalarni boshqarish va tasdiqlash.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a08d]" />
            <input 
              type="text" 
              placeholder="Ism yoki ID bo'yicha qidirish..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-[#98a08d]/20 rounded-2xl text-sm focus:ring-2 focus:ring-[#98a08d]/20 outline-none w-72 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-white border border-[#98a08d]/20 rounded-2xl p-1 shadow-sm">
            {['all', 'pending', 'active'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-[#98a08d] text-white' : 'text-[#98a08d] hover:bg-[#98a08d]/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-[#98a08d]/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f7f4] border-b border-[#98a08d]/10">
                <th className="px-8 py-5 text-[10px] font-black text-[#98a08d] uppercase tracking-[0.2em]">Buyurtmachi</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#98a08d] uppercase tracking-[0.2em]">Sana & Joy</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#98a08d] uppercase tracking-[0.2em]">To'lov turi</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#98a08d] uppercase tracking-[0.2em]">Holat</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#98a08d] uppercase tracking-[0.2em]">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#98a08d]/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[#98a08d] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-[#98a08d] font-bold">
                    Hech narsa topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f8f7f4]/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                          <span className="text-rose-500 font-black text-sm">{inv.names?.[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#5c6352]">{inv.names}</p>
                          <p className="text-[10px] text-[#98a08d] font-bold">ID: {inv.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-[#5c6352] font-bold">
                          <Calendar className="w-3 h-3 text-[#98a08d]" />
                          {inv.date}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#98a08d] font-medium">
                          <MapPin className="w-3 h-3" />
                          {inv.venue}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase border border-blue-100">
                        {inv.paymentType || "NOMA'LUM"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        inv.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'active' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                        {inv.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedInv(inv)}
                          className="p-2 hover:bg-[#98a08d]/10 text-[#98a08d] rounded-lg transition-colors shadow-sm bg-white border border-[#98a08d]/10"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.open(`/invitation/${inv.id}`, '_blank')}
                          className="p-2 hover:bg-[#98a08d]/10 text-[#98a08d] rounded-lg transition-colors shadow-sm bg-white border border-[#98a08d]/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedInv && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInv(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="md:w-1/2 bg-[#f8f7f4] p-10 overflow-y-auto">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[#5c6352] tracking-tighter">Buyurtma Tafsilotlari</h3>
                    <button onClick={() => setSelectedInv(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <X className="w-6 h-6 text-[#98a08d]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">ID</p>
                      <p className="text-sm font-bold text-[#5c6352]">{selectedInv.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Holat</p>
                      <p className="text-sm font-bold text-[#5c6352] capitalize">{selectedInv.status}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Ismlar</p>
                      <p className="text-sm font-bold text-[#5c6352]">{selectedInv.names}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Sana</p>
                      <p className="text-sm font-bold text-[#5c6352]">{selectedInv.date}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] font-black text-[#98a08d] uppercase tracking-widest">Manzil</p>
                      <p className="text-sm font-bold text-[#5c6352]">{selectedInv.venue} — {selectedInv.location}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#98a08d]/10 flex gap-4">
                    {selectedInv.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => updateStatus(selectedInv.id, 'active')}
                          className="flex-1 py-4 bg-[#98a08d] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#868d7c] transition-all"
                        >
                          <Check className="w-5 h-5" />
                          TASDIQLASH
                        </button>
                        <button 
                          onClick={() => updateStatus(selectedInv.id, 'rejected')}
                          className="flex-1 py-4 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                        >
                          <X className="w-5 h-5" />
                          RAD ETISH
                        </button>
                      </>
                    ) : (
                      <div className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${
                        selectedInv.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedInv.status === 'active' ? (
                          <>
                            <Check className="w-5 h-5" />
                            BU BUYURTMA TASDIQLANGAN
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5" />
                            BU BUYURTMA RAD ETILGAN
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 bg-gray-900 relative">
                {selectedInv.receiptUrl ? (
                  <div className="h-full w-full flex flex-col">
                    <div className="p-4 bg-black/40 backdrop-blur-md absolute top-0 left-0 right-0 z-10 flex items-center justify-between">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> TO'LOV CHEKI
                      </span>
                      <button 
                        onClick={() => window.open(selectedInv.receiptUrl, '_blank')}
                        className="text-white hover:text-[#98a08d] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                    <img src={selectedInv.receiptUrl} className="w-full h-full object-contain" alt="Receipt" />
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-white/20 p-10 text-center gap-4">
                    <ImageIcon className="w-20 h-20" />
                    <p className="font-bold">Chek yuklanmagan</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
