'use client'

import { use } from 'react'
import { EternalBondTemplate } from '@/components/templates/eternal-bond'

// Mock data fetching function
const getInvitationData = (id: string) => {
  // In a real app, this would fetch from a database (Supabase/Firebase/etc.)
  return {
    names: 'Sarah & James',
    date: 'June 15, 2025',
    location: 'Paris, France',
    venue: 'Rose Mansion',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'
    ]
  }
}

export default function InvitationViewer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const data = getInvitationData(id)

  return (
    <div className="w-full min-h-screen">
      <EternalBondTemplate data={data} />
    </div>
  )
}
