'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { EternalBondTemplate } from '@/components/templates/eternal-bond'
import { Loader2 } from 'lucide-react'

export default function InvitationView() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showNotice, setShowNotice] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!id) return
      try {
        const docRef = doc(db, 'invitations', id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const invitationData = docSnap.data()
          setData(invitationData)
          
          // Increment views
          if (invitationData.status === 'active') {
            const { updateDoc, increment } = await import('firebase/firestore')
            await updateDoc(docRef, {
              views: increment(1)
            })
          }
        } else {
          setError(true)
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchInvitation()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#98a08d] animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-serif text-[#5c6352]">Taklifnoma topilmadi</h1>
        <p className="text-[#98a08d]">Havola noto'g'ri yoki o'chirib tashlangan.</p>
      </div>
    )
  }

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
      <EternalBondTemplate data={data} />
    </main>
  )
}
