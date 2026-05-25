'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { Great_Vibes, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import { useLanguage } from '@/lib/LanguageContext'

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600'], subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

interface VideoWeddingTemplateProps {
  data: any
  onDataChange?: (data: any) => void
}

export function VideoWeddingTemplate({ data, onDataChange }: VideoWeddingTemplateProps) {
  const { lang } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const isEditable = !!onDataChange

  const handleEdit = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const dateStr = data.date || "2025-08-15"
  const dateObj = new Date(dateStr)
  const isValidDate = !isNaN(dateObj.getTime())
  const validDateObj = isValidDate ? dateObj : new Date("2025-08-15")

  const day = validDateObj.getDate()
  const year = validDateObj.getFullYear()

  const monthsUz = ["YANVAR", "FEVRAL", "MART", "APREL", "MAY", "IYUN", "IYUL", "AVGUST", "SENTABR", "OKTABR", "NOYABR", "DEKABR"]
  const monthsRu = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"]
  const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

  const monthList = lang === 'uz' ? monthsUz : lang === 'ru' ? monthsRu : monthsEn
  const monthName = monthList[validDateObj.getMonth()]

  const names = data.names || "Tohir & Odina"
  const namesParts = names.split(/(?:\s+va\s+|\s+and\s+|\s*&\s*|\s+и\s+)/i)

  return (
    <div
      id="invitation-capture"
      className={`min-h-[100dvh] w-full relative overflow-x-hidden flex flex-col items-center justify-center bg-black py-4 ${cormorant.className}`}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" data-bg-capture="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/video/wed-video.mp4"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Container */}
      <div className="relative z-10 w-[92%] max-w-md min-h-[90vh] flex flex-col items-center justify-between p-6 text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-8"
        >
          <div className="text-[10px] tracking-[0.4em] text-white/90 uppercase font-semibold">
            {lang === 'uz' ? 'Assalomu Alaykum' : lang === 'ru' ? 'Здравствуйте' : 'Hello Everyone'}
          </div>
        </motion.div>

        {/* Names Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="my-auto w-full flex flex-col items-center justify-center space-y-4"
        >
          {namesParts.length > 1 ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", e.currentTarget.textContent + " & " + namesParts[1])}
                className={`${greatVibes.className} text-6xl md:text-7xl text-white drop-shadow-2xl outline-none cursor-text`}
              >
                {namesParts[0].trim()}
              </h1>
              <span className="text-3xl text-white/80 font-light">&</span>
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", namesParts[0] + " & " + e.currentTarget.textContent)}
                className={`${greatVibes.className} text-6xl md:text-7xl text-white drop-shadow-2xl outline-none cursor-text`}
              >
                {namesParts[1].trim()}
              </h1>
            </div>
          ) : (
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit("names", e.currentTarget.textContent || "")}
              className={`${greatVibes.className} text-6xl md:text-7xl text-white drop-shadow-2xl px-4 outline-none cursor-text`}
            >
              {names}
            </h1>
          )}

          <p className={`${playfair.className} mt-8 text-white/90 text-xs tracking-[0.2em] uppercase leading-relaxed max-w-[250px]`}>
            {lang === 'uz' ? "Sizni hayotimizdagi eng baxtli kunimizda kutamiz" :
              lang === 'ru' ? "Ждем вас в самый счастливый день нашей жизни" :
                "We wait for you on the happiest day of our lives"}
          </p>
        </motion.div>

        {/* Footer info (Date & Venue) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full mb-8 flex flex-col items-center space-y-6"
          suppressHydrationWarning
        >
          {/* Date Row */}
          <div className="flex items-center justify-center gap-6 border-y border-white/30 py-3 px-6 w-full max-w-[300px]" suppressHydrationWarning>
            <div className="text-right w-1/3">
              <p className="text-white font-semibold tracking-[0.1em] text-[10px] uppercase" suppressHydrationWarning>
                {monthName}
              </p>
            </div>

            <div className="w-px h-6 bg-white/40" />

            <div className="text-3xl font-light text-white" suppressHydrationWarning>
              {day}
            </div>

            <div className="w-px h-6 bg-white/40" />

            <div className="text-left w-1/3">
              <p className="text-white font-semibold tracking-[0.1em] text-[10px] uppercase" suppressHydrationWarning>
                {year}
              </p>
            </div>
          </div>

          {/* Venue & Time */}
          <div className="flex flex-col items-center space-y-2">
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit("venue", e.currentTarget.textContent || "")}
              className={`${playfair.className} text-white font-bold tracking-[0.15em] text-sm md:text-base drop-shadow-md uppercase outline-none cursor-text`}
            >
              {data.venue || 'LIFE GARDEN RESTAURANT'}
            </p>
            <div className="flex items-center gap-3 text-white/80 font-medium tracking-widest text-[9px] uppercase">
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("address", e.currentTarget.textContent || "")}
                className="outline-none cursor-text"
              >
                {data.address || "Samarqand shahar"}
              </span>
              <span>•</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("time", e.currentTarget.textContent || "")}
                className="outline-none cursor-text"
              >
                {data.time || "17:00"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Audio Player */}
      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl || undefined} loop />
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            onClick={togglePlay}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white/30 transition-colors z-50"
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </>
      )}
    </div>
  )
}
