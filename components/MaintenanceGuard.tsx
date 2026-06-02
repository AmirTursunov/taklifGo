'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Settings, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMaintenance, setIsMaintenance] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setIsMaintenance(doc.data().maintenanceMode === true)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Admin and Auth routes should not be blocked
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return <>{children}</>
  }

  if (isMaintenance && !loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#98a08d]/10 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-[#98a08d]/10 rounded-full flex items-center justify-center relative">
            <Wrench className="w-10 h-10 text-[#98a08d]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Settings className="w-6 h-6 text-[#5c6352]" />
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-[#5c6352] uppercase tracking-tight">
              Texnik Ishlar
            </h1>
            <p className="text-[#98a08d] text-sm leading-relaxed font-medium">
              Saytda texnik ishlar olib borilmoqda. Tez orada o'z ishimizni davom ettiramiz. Tushunganingiz uchun rahmat!
            </p>
          </div>

          <div className="w-full h-1 bg-[#98a08d]/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#98a08d]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
