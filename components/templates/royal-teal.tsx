'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Music, Volume2, VolumeX } from 'lucide-react'
import { Playfair_Display, Great_Vibes } from 'next/font/google'
import { useLanguage } from '@/lib/LanguageContext'
import { Button } from '@/components/ui/button'

const playfair = Playfair_Display({ subsets: ['latin'] })
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] })

interface RoyalTealTemplateProps {
  data: any
  onDataChange?: (data: any) => void
}

export function RoyalTealTemplate({ data, onDataChange }: RoyalTealTemplateProps) {
  const { lang } = useLanguage()
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showMap, setShowMap] = React.useState(false)
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

  // Sanani qismlarga ajratish (masalan: 2025-08-25)
  const dateObj = data.date ? new Date(data.date) : new Date()
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  
  // Oylar ro'yxati
  const monthsUz = ["YANVAR", "FEVRAL", "MART", "APREL", "MAY", "IYUN", "IYUL", "AVGUST", "SENTABR", "OKTABR", "NOYABR", "DEKABR"]
  const monthsRu = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"]
  const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
  
  const monthList = lang === 'uz' ? monthsUz : lang === 'ru' ? monthsRu : monthsEn
  const monthName = monthList[dateObj.getMonth()]
  
  // Hafta kunlari
  const daysUz = ["YAKSHANBA", "DUSHANBA", "SESHANBA", "CHORSHANBA", "PAYSHANBA", "JUMA", "SHANBA"]
  const daysRu = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"]
  const daysEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  
  const dayList = lang === 'uz' ? daysUz : lang === 'ru' ? daysRu : daysEn
  const dayName = dayList[dateObj.getDay()]

  const isWedding = data.category === 'wedding' || !data.category;

  const getInvitationText = () => {
    if (lang === 'uz') {
      return isWedding 
        ? "SIZNI HAYOTIMIZDAGI ENG BAXTIYOR KUN NIKOH TO'YIMIZGA TAKLIF ETAMIZ" 
        : "SIZNI TAVALLUD AYYOMIMIZGA LUTFAN TAKLIF ETAMIZ"
    }
    if (lang === 'ru') {
      return isWedding
        ? "ПРИГЛАШАЕМ ВАС НА НАШУ СВАДЬБУ"
        : "ПРИГЛАШАЕМ ВАС НА ДЕНЬ РОЖДЕНИЯ"
    }
    return isWedding
      ? "YOU ARE JOYFULLY INVITED TO OUR WEDDING"
      : "YOU ARE JOYFULLY INVITED TO OUR BIRTHDAY"
  }

  const getHeader = () => {
    if (lang === 'uz') return isWedding ? "WEDDING INVITATION" : "BIRTHDAY INVITATION";
    if (lang === 'ru') return isWedding ? "СВАДЕБНОЕ ПРИГЛАШЕНИЕ" : "ПРИГЛАШЕНИЕ НА ДЕНЬ РОЖДЕНИЯ";
    return isWedding ? "WEDDING INVITATION" : "BIRTHDAY INVITATION";
  }

  // Names processing
  const names = data.names || ""
  const namesParts = names.split(/(?:\s+va\s+|\s+and\s+|\s*&\s*|\s+и\s+)/i)

  return (
    <div 
      id="invitation-capture"
      className={`min-h-[100dvh] w-full relative overflow-x-hidden flex flex-col items-center justify-center ${playfair.className} playfair-font bg-[#113a47] py-4`}
      style={{
        backgroundImage: `url("${data.bgBase64 || '/royal-bg.jpg'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Decorative Container (transparent since BG image has the design) */}
      <div className="relative z-10 w-[92%] max-w-md min-h-[90vh] flex flex-col items-center justify-between p-4 sm:p-6 text-center bg-transparent rounded-sm">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-4 space-y-2 flex flex-col items-center"
        >
          {isWedding && (
            <div className="relative w-12 h-12 flex items-center justify-center mb-1">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#D8B154] drop-shadow-md">
                <circle cx="35" cy="50" r="20" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="65" cy="50" r="20" stroke="currentColor" strokeWidth="2.5" />
                <path d="M45 35 L50 25 L55 35 Z" fill="currentColor" />
                <circle cx="50" cy="22" r="3" fill="currentColor" />
              </svg>
            </div>
          )}
          <h2 className="text-white font-bold tracking-[0.2em] text-[9px] md:text-xs uppercase drop-shadow-md playfair-font">
            {getHeader()}
          </h2>
        </motion.div>

        {/* Names Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="my-4 text-center w-full"
        >
          {namesParts.length > 1 ? (
            <div className="flex flex-col items-center justify-center space-y-0.5">
              <h1 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", e.currentTarget.textContent + " va " + namesParts[1])}
                className={`${greatVibes.className} great-vibes-font text-5xl md:text-6xl text-[#D8B154] leading-tight drop-shadow-lg outline-none cursor-text`}
              >
                {namesParts[0].trim()}
              </h1>
              <span className={`${greatVibes.className} great-vibes-font text-2xl md:text-3xl text-[#D8B154] opacity-80`}>&</span>
              <h1 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("names", namesParts[0] + " va " + e.currentTarget.textContent)}
                className={`${greatVibes.className} great-vibes-font text-5xl md:text-6xl text-[#D8B154] leading-tight drop-shadow-lg outline-none cursor-text`}
              >
                {namesParts[1].trim()}
              </h1>
            </div>
          ) : (
            <h1 
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit("names", e.currentTarget.textContent || "")}
              className={`${greatVibes.className} great-vibes-font text-5xl md:text-6xl text-[#D8B154] leading-tight drop-shadow-lg px-4 outline-none cursor-text`}
            >
              {names}
            </h1>
          )}
        </motion.div>

        {/* Invitation Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-[85%] mx-auto"
        >
          <p className="text-white text-[8px] md:text-[10px] font-bold tracking-[0.15em] leading-relaxed drop-shadow-md uppercase">
            {getInvitationText()}
          </p>
        </motion.div>

        {/* Date & Time Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="my-6 w-full"
        >
          <h3 className="text-white font-bold tracking-[0.3em] text-[9px] uppercase mb-3">{monthName}</h3>
          
          <div className="flex items-center justify-center gap-3">
            <div className="text-right w-20 border-t border-b border-[#D8B154]/50 py-1.5">
              <p className="text-white font-bold tracking-[0.1em] text-[8px] uppercase">{dayName}</p>
            </div>
            
            <div className="text-4xl md:text-5xl font-bold text-[#D8B154] drop-shadow-lg">
              {day}
            </div>
            
            <div className="text-left w-20 border-t border-b border-[#D8B154]/50 py-1.5">
              <p 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit("time", e.currentTarget.textContent || "17:00")}
                className="text-white font-bold tracking-[0.1em] text-sm md:text-base outline-none cursor-text"
              >
                {data.time || "17:00"}
              </p>
            </div>
          </div>
          
          <h3 className="text-white font-bold tracking-[0.3em] text-[9px] mt-3">{year}</h3>
        </motion.div>

        {/* Location Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full space-y-1 mb-4"
        >
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("address", e.currentTarget.textContent || "")}
            className="text-white/80 font-bold tracking-[0.15em] text-[8px] uppercase outline-none cursor-text"
          >
            {lang === 'uz' ? 'MANZIL' : lang === 'ru' ? 'АДРЕС' : 'ADDRESS'}: {data.address || "SAMARQAND SHAHAR"}
          </p>
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("venue", e.currentTarget.textContent || "")}
            className="text-[#D8B154] font-bold tracking-[0.1em] text-xs md:text-sm drop-shadow-md uppercase outline-none cursor-text"
          >
            "{data.venue || 'LIFE GARDEN'}"
          </p>
          <p className="text-white font-bold tracking-[0.15em] text-[8px] uppercase">
            {lang === 'uz' ? 'RESTORAN' : lang === 'ru' ? 'РЕСТОРАН' : 'RESTAURANT'}
          </p>
        </motion.div>

      </div>

      {/* Audio Player */}
      {data.musicUrl && (
        <>
          <audio ref={audioRef} src={data.musicUrl} loop />
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            onClick={togglePlay}
            className="fixed bottom-6 right-6 w-12 h-12 bg-[#D8B154] text-[#184C59] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </>
      )}
    </div>
  )
}
