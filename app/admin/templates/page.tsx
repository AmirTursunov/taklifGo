'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TEMPLATES_BY_CATEGORY } from '@/lib/templates'
import { motion } from 'framer-motion'
import { 
  Save, 
  Sparkles, 
  TrendingDown, 
  DollarSign,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function TemplatesManagement() {
  const [templateSettings, setTemplateSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Flatten templates from categories and remove duplicates by ID
  const allTemplates = Array.from(
    new Map(Object.values(TEMPLATES_BY_CATEGORY).flat().map(t => [t.id, t])).values()
  )

  useEffect(() => {
    async function fetchTemplateSettings() {
      try {
        const docRef = doc(db, "settings", "templates")
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setTemplateSettings(snap.data())
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplateSettings()
  }, [])

  const handleUpdate = (id: string, field: string, value: any) => {
    setTemplateSettings(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { price: 25000, originalPrice: 100000 }),
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "templates"), templateSettings)
      toast.success("Shablon narxlari muvaffaqiyatli saqlandi!")
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
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#5c6352] tracking-tighter">Shablon Narxlari</h1>
          <p className="text-[#98a08d] font-medium">Har bir shablon uchun alohida narx va chegirmalarni belgilash.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTemplates.map((tmpl) => {
          const config = templateSettings[tmpl.id] || { price: 25000, originalPrice: 100000 }
          // Extract hex from bg-[#HEX] if possible
          const bgColor = tmpl.color.replace('bg-[', '').replace(']', '')
          
          return (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-[#98a08d]/10 shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 pb-0">
                <div 
                  className="w-full h-24 rounded-[1.5rem] flex flex-col items-center justify-center text-white relative overflow-hidden"
                  style={{ backgroundColor: bgColor.startsWith('#') ? bgColor : undefined }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <Sparkles className="w-6 h-6 mb-1 opacity-50 relative z-10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 relative z-10">Template ID</span>
                  <span className="text-xs font-black relative z-10">{tmpl.id}</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-black text-[#5c6352] tracking-tight">{tmpl.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#98a08d] uppercase tracking-widest">Sotuv Narxi</label>
                    <input 
                      type="number"
                      value={config.price}
                      onChange={(e) => handleUpdate(tmpl.id, 'price', Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#f8f7f4] border border-[#98a08d]/10 rounded-xl outline-none focus:ring-2 focus:ring-[#98a08d]/20 font-bold text-[#5c6352] text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#98a08d] uppercase tracking-widest">Eski Narx</label>
                    <input 
                      type="number"
                      value={config.originalPrice}
                      onChange={(e) => handleUpdate(tmpl.id, 'originalPrice', Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#f8f7f4] border border-[#98a08d]/10 rounded-xl outline-none focus:ring-2 focus:ring-[#98a08d]/20 font-bold text-[#98a08d] text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#98a08d]/5">
                  <span className="text-[10px] font-black text-[#98a08d] uppercase">Userga:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#98a08d] line-through font-bold">{config.originalPrice.toLocaleString()}</span>
                    <span className="text-xs text-[#5c6352] font-black">{config.price.toLocaleString()} UZS</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="font-black text-amber-900 text-sm uppercase tracking-wide">Eslatma</h4>
          <p className="text-amber-800/80 text-xs leading-relaxed font-medium">
            Bu yerda o'zgartirilgan narxlar darhol saytdagi shablonlar ro'yxatida va to'lov oynasida aks etadi. 
            Eski narx (ustidan chizilgan) foydalanuvchida chegirma hissini uyg'otish uchun xizmat qiladi.
          </p>
        </div>
      </div>
    </div>
  )
}
