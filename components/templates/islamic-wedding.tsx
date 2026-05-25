'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { Great_Vibes, Amiri, Cormorant_Garamond } from 'next/font/google'
import { useLanguage } from '@/lib/LanguageContext'

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] })
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic'] })
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600'], subsets: ['latin'] })

interface IslamicWeddingTemplateProps {
  data: any
  onDataChange?: (data: any) => void
}

const IMAGES = {
  palace: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85&fit=crop',
}

export function IslamicWeddingTemplate({ data, onDataChange }: IslamicWeddingTemplateProps) {
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

  // Date processing
  const dateStr = data.date || "2025-10-21"
  const dateObj = new Date(dateStr)
  // Check if invalid date
  const isValidDate = !isNaN(dateObj.getTime())
  const validDateObj = isValidDate ? dateObj : new Date("2025-10-21")

  const day = validDateObj.getDate()
  const year = validDateObj.getFullYear()

  const monthsUz = ["YANVAR", "FEVRAL", "MART", "APREL", "MAY", "IYUN", "IYUL", "AVGUST", "SENTABR", "OKTABR", "NOYABR", "DEKABR"]
  const monthsRu = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"]
  const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

  const monthList = lang === 'uz' ? monthsUz : lang === 'ru' ? monthsRu : monthsEn
  const monthName = monthList[validDateObj.getMonth()]

  const daysUz = ["YAKSHANBA", "DUSHANBA", "SESHANBA", "CHORSHANBA", "PAYSHANBA", "JUMA", "SHANBA"]
  const daysRu = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"]
  const daysEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

  const dayList = lang === 'uz' ? daysUz : lang === 'ru' ? daysRu : daysEn
  const dayName = dayList[validDateObj.getDay()]

  const names = data.names || ""
  const namesParts = names.split(/(?:\s+va\s+|\s+and\s+|\s*&\s*|\s+и\s+)/i)

  return (
    <div
      id="invitation-capture"
      className={`min-h-[100dvh] w-full relative overflow-x-hidden flex flex-col items-center justify-center bg-[#faf5ee] py-4 ${cormorant.className}`}
    >
      {/* Background Image */}
      <div
        data-bg-capture="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: `url(${data.bgBase64 || IMAGES.palace})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(180deg,rgba(15,8,2,0.6) 0%,rgba(30,15,5,0.4) 45%,rgba(10,5,2,0.8) 100%)',
      }} />

      {/* Container */}
      <div className="relative z-10 w-[92%] max-w-md min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center">

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-8"
        >
          <div className={`${amiri.className} text-2xl md:text-3xl text-[#e8d5a0] tracking-wider mb-2 drop-shadow-md`}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
          <div className="text-[10px] tracking-[0.38em] text-[#e8d5a0]/70 uppercase">
            {lang === 'uz' ? 'Assalomu alaykum' : lang === 'ru' ? 'Мир вам' : 'Peace be upon you'}
          </div>
        </motion.div>

        {/* Names Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="my-8 w-full"
        >
          {namesParts.length > 1 ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", e.currentTarget.textContent + " va " + namesParts[1])}
                className={`${greatVibes.className} text-5xl md:text-6xl text-[#e8d5a0] drop-shadow-lg outline-none cursor-text`}
              >
                {namesParts[0].trim()}
              </h1>
              <span className="text-xl md:text-2xl text-[#e8d5a0]/70">&</span>
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", namesParts[0] + " va " + e.currentTarget.textContent)}
                className={`${greatVibes.className} text-5xl md:text-6xl text-[#e8d5a0] drop-shadow-lg outline-none cursor-text`}
              >
                {namesParts[1].trim()}
              </h1>
            </div>
          ) : (
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit("names", e.currentTarget.textContent || "")}
              className={`${greatVibes.className} text-5xl md:text-6xl text-[#e8d5a0] drop-shadow-lg px-4 outline-none cursor-text`}
            >
              {names}
            </h1>
          )}
        </motion.div>

        {/* Invite text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="my-6 max-w-[85%] mx-auto"
        >
          <p className="text-[#e8d5a0]/80 text-[10px] md:text-xs font-semibold tracking-[0.2em] leading-relaxed uppercase">
            {lang === 'uz' ? "Sizni hayotimizdagi eng baxtiyor kun nikoh to'yimizga taklif etamiz" :
              lang === 'ru' ? "Приглашаем вас на нашу свадьбу" :
                "You are joyfully invited to our wedding"}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-6 w-full max-w-[200px]">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#d0b880]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d0b880] opacity-80" />
          <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#d0b880]" />
        </div>

        {/* Date & Time Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full mb-8"
          suppressHydrationWarning
        >
          <h3 className="text-[#e8d5a0] font-semibold tracking-[0.3em] text-[10px] uppercase mb-4" suppressHydrationWarning>{monthName}</h3>

          <div className="flex items-center justify-center gap-6" suppressHydrationWarning>
            <div className="text-right w-24">
              <p className="text-[#e8d5a0] font-semibold tracking-[0.1em] text-[9px] uppercase border-y border-[#d0b880]/40 py-2" suppressHydrationWarning>
                {dayName}
              </p>
            </div>

            <div className="text-4xl md:text-5xl font-light text-[#e8d5a0] drop-shadow-md" suppressHydrationWarning>
              {day}
            </div>

            <div className="text-left w-24">
              <p
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("time", e.currentTarget.textContent || "17:00")}
                className="text-[#e8d5a0] font-semibold tracking-[0.1em] text-sm md:text-base border-y border-[#d0b880]/40 py-1.5 outline-none cursor-text"
              >
                {data.time || "17:00"}
              </p>
            </div>
          </div>

          <h3 className="text-[#e8d5a0] font-semibold tracking-[0.3em] text-[10px] mt-4" suppressHydrationWarning>{year}</h3>
        </motion.div>

        {/* Location Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full space-y-2 mt-4"
        >
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("venue", e.currentTarget.textContent || "")}
            className="text-[#e8d5a0] font-semibold tracking-[0.15em] text-sm md:text-base drop-shadow-md uppercase outline-none cursor-text"
          >
            {data.venue || 'LIFE GARDEN'}
          </p>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("address", e.currentTarget.textContent || "")}
            className="text-[#e8d5a0]/70 font-semibold tracking-[0.1em] text-[10px] uppercase outline-none cursor-text"
          >
            {data.address || "SAMARQAND SHAHAR"}
          </p>
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
            className="fixed bottom-6 right-6 w-12 h-12 bg-[#c49848] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#d4a85a] transition-colors z-50"
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </>
      )}
    </div>
  )
}