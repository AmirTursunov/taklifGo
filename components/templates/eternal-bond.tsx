'use client'

import { InvitationCanvas } from '@/components/invitation-canvas'
import { Calendar, MapPin, Camera, Gift, Leaf, ArrowDown, Volume2, VolumeX, Music as MusicIcon } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface InvitationData {
  names: string
  date: string
  location: string
  venue: string
  images: string[]
  musicUrl?: string
}

export function EternalBondTemplate({ data, onDataChange }: { data: InvitationData, onDataChange?: (newData: Partial<InvitationData>) => void }) {
  const { t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const handleEdit = (field: keyof InvitationData, value: string) => {
    if (onDataChange) {
      onDataChange({ [field]: value })
    }
  }

  const defaultMusic = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Replace with actual wedding music URL

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.load() // Force reload when URL changes
        audioRef.current.play().catch(e => console.log("Autoplay blocked"))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, data.musicUrl])

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onDataChange) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newImages = [...data.images]
        newImages[index] = event.target?.result as string
        onDataChange({ images: newImages })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] text-[#5c6352] selection:bg-[#98a08d]/20 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] lg:h-screen flex items-center justify-center overflow-hidden bg-[#faf9f6]">
        <div className="absolute inset-0 z-0">
          <InvitationCanvas data={data} onDataChange={onDataChange} />
        </div>
        
        <div className="absolute bottom-8 lg:bottom-12 left-0 right-0 text-center animate-bounce z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#98a08d] font-bold flex flex-col items-center gap-2">
            Scroll to begin
            <ArrowDown className="w-4 h-4" />
          </p>
        </div>
      </section>

      {/* Welcome & Countdown */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-16 lg:py-24 px-6 text-center"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Leaf className="w-8 h-8 text-[#98a08d] mx-auto opacity-40" />
            <h1 
              className="text-4xl lg:text-7xl font-serif text-[#5c6352] tracking-tight leading-tight outline-none focus:bg-[#98a08d]/5 px-4 rounded-xl transition-all"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || t.defaultNames}
            </h1>
            <p className="text-[10px] lg:text-sm font-light tracking-[0.3em] text-[#98a08d] uppercase">
              {t.areGettingMarried} • 
              <span 
                className="outline-none focus:bg-[#98a08d]/5 px-2 rounded-md ml-2"
                contentEditable={!!onDataChange}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
              >
                {data.date || t.defaultDate}
              </span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white/40"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-10 space-y-4">
            <Camera className="w-6 h-6 text-[#98a08d] mx-auto" />
            <h2 className="text-3xl font-serif text-[#5c6352]">{t.theAlbum}</h2>
            <p className="text-[#98a08d] tracking-[0.2em] uppercase text-[9px] font-bold">{t.momentsCaptured}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {data.images.map((url, i) => {
              const isEditable = !!onDataChange;
              const MotionLabel = motion.label as any;
              const MotionDiv = motion.div as any;
              const Container = isEditable ? MotionLabel : MotionDiv;
              
              return (
                <Container 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`group relative aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-md border border-[#98a08d]/10 ${isEditable ? 'cursor-pointer' : ''}`}
                >
                  {isEditable && (
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(i, e)}
                    />
                  )}
                  <img 
                    src={url} 
                    alt={`Album ${i}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  {isEditable && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                      <div className="w-14 h-14 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Camera className="w-7 h-7 text-[#98a08d]" />
                      </div>
                    </div>
                  )}
                </Container>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Event Details */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { id: 'date', icon: Calendar, title: t.weddingDate, desc: data.date || t.defaultDate, sub: t.ceremonyTime },
            { id: 'venue', icon: MapPin, title: t.venueName, desc: data.venue || 'Grand Hall', sub: data.location || t.defaultLocation },
            { id: 'registry', icon: Gift, title: t.giftRegistry, desc: t.giftRegistry, sub: t.presenceEnough }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center space-y-4 p-8 rounded-3xl bg-white shadow-sm border border-[#98a08d]/5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#98a08d]/10 rounded-full flex items-center justify-center mx-auto">
                <item.icon className="w-6 h-6 text-[#98a08d]" />
              </div>
              <h3 className="text-[10px] tracking-[0.3em] text-[#98a08d] font-bold uppercase">{item.title}</h3>
              <p 
                className="text-lg font-medium text-[#5c6352] leading-tight outline-none focus:bg-[#98a08d]/5 rounded-md px-1"
                contentEditable={!!onDataChange && item.id !== 'registry'}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit(item.id as keyof InvitationData, e.currentTarget.textContent || '')}
              >
                {item.desc}
              </p>
              <p 
                className="text-xs text-[#7c6a5a] font-light outline-none focus:bg-[#98a08d]/5 rounded-md px-1"
                contentEditable={!!onDataChange && item.id === 'venue'}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('location', e.currentTarget.textContent || '')}
              >
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 text-center space-y-6"
      >
        <Leaf className="w-8 h-8 text-[#98a08d] mx-auto opacity-40 animate-pulse" />
        <h2 
          className="text-3xl font-serif text-[#5c6352] outline-none focus:bg-[#98a08d]/5 px-4 rounded-xl transition-all cursor-text"
          contentEditable={!!onDataChange}
          suppressContentEditableWarning
          onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
        >
          {data.names || t.defaultNames}
        </h2>
        <p 
          className="text-[10px] uppercase tracking-[0.5em] text-[#98a08d] font-bold outline-none focus:bg-[#98a08d]/5 px-4 rounded-xl transition-all cursor-text"
          contentEditable={!!onDataChange}
          suppressContentEditableWarning
          onBlur={(e) => handleEdit('tagline', e.currentTarget.textContent || '')}
        >
          {t.rootsForever} • {data.date || t.defaultDate}
        </p>
      </motion.footer>

      {/* Music Control */}
      {data.musicUrl !== "none" && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md border ${
              isPlaying 
                ? 'bg-[#98a08d] text-white border-[#98a08d] scale-110' 
                : 'bg-white/80 text-[#98a08d] border-[#98a08d]/20 hover:bg-white'
            }`}
          >
            {isPlaying ? (
              <div className="relative">
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </button>
          
          <audio 
            ref={audioRef}
            src={data.musicUrl || defaultMusic}
            loop
          />
        </div>
      )}
    </div>
  )
}
