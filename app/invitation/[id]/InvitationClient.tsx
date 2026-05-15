'use client'

import { useEffect, useState } from 'react'
import { EternalBondTemplate } from '@/components/templates/eternal-bond'
import { GoldenNightTemplate } from '@/components/templates/golden-night'
import { NafosatTemplate } from '@/components/templates/nafosat'
import { GoldenWeddingTemplate } from '@/components/templates/golden-wedding'
import { ElegantBirthdayTemplate } from '@/components/templates/elegant-birthday'
import { GirlBirthdayTemplate } from '@/components/templates/girl-birthday'
import { Loader2 } from 'lucide-react'

export default function InvitationClient({ data, id }: { data: any, id: string }) {
  const [showNotice, setShowNotice] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 5000)
    
    // Increment views
    const updateViews = async () => {
      if (data.status === 'active') {
        try {
          await fetch('/api/stats/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
        } catch (e) {
          console.error("View increment failed", e);
        }
      }
    }
    updateViews();
    
    return () => clearTimeout(timer)
  }, [id, data.status])

  const noticeText = {
    uz: "Ushbu havola faqat ko'rish uchun mo'ljallangan.",
    ru: "Эта ссылка предназначена только для просмотра.",
    en: "This link is for viewing purposes only."
  }

  return (
    <main className="min-h-screen relative">
      {showNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white/90 backdrop-blur-md border border-[#98a08d]/20 px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-[#98a08d] rounded-full animate-pulse" />
            <p className="text-xs font-bold text-[#5c6352] tracking-wider uppercase">
              {noticeText[data.lang as keyof typeof noticeText] || noticeText.uz}
            </p>
          </div>
        </div>
      )}
      {data.templateId === "nafosat" ? (
        <NafosatTemplate data={data} />
      ) : data.templateId === "girl-birthday" ? (
        <GirlBirthdayTemplate data={{
          ...data,
          name: data.names,
          time: data.time || "19:00",
          age: data.age || "21"
        }} />
      ) : data.templateId === "elegant-birthday" ? (
        <ElegantBirthdayTemplate data={{
          ...data,
          name: data.names,
          time: data.time || "19:00",
          age: data.age || "30"
        }} />
      ) : data.templateId === "golden-wedding" ? (
        <GoldenWeddingTemplate data={data} />
      ) : data.templateId === "golden-night" ? (
        <GoldenNightTemplate data={data} />
      ) : (
        <EternalBondTemplate data={data} />
      )}
    </main>
  )
}
