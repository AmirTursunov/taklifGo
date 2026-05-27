'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { Great_Vibes, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import { useLanguage } from '@/lib/LanguageContext'

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600'], subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

interface StoryWeddingTemplateProps {
  data: any
  onDataChange?: (data: any) => void
}

const RingsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M8 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M12 9l-2-3-2 3" />
    <path d="M12 9l2-3 2 3" />
    <circle cx="12" cy="6" r="1" fill="currentColor" />
    <path d="M12 3v1M15 4.5l-1 .5M9 4.5l1 .5" />
  </svg>
)

// Text shadow utility — oq text qora bg ustida ham, och bg ustida ham ko'rinadi
const textShadow = '0 1px 8px rgba(0,0,0,0.55), 0 2px 24px rgba(0,0,0,0.35)'
const lightShadow = '0 1px 4px rgba(0,0,0,0.4)'

export function StoryWeddingTemplate({ data, onDataChange }: StoryWeddingTemplateProps) {
  const { lang } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const isEditable = !!onDataChange

  const handleEdit = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  const togglePlay = (e: React.MouseEvent) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (currentSlide === 0) {
      timeout = setTimeout(() => setCurrentSlide(1), 3000)
    } else if (currentSlide === 1) {
      timeout = setTimeout(() => setCurrentSlide(2), 6000) // 2-card 6 sekund turadi
    } else if (currentSlide === 2) {
      timeout = setTimeout(() => setCurrentSlide(0), 7000) // 3-card 7 sekund turadi
    }
    return () => clearTimeout(timeout)
  }, [currentSlide])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3)

  const dateStr = data.date || "2025-11-25"
  const dateObj = new Date(dateStr)
  const isValidDate = !isNaN(dateObj.getTime())
  const validDateObj = isValidDate ? dateObj : new Date("2025-11-25")

  const day = validDateObj.getDate()
  const year = validDateObj.getFullYear()
  const monthNum = (validDateObj.getMonth() + 1).toString().padStart(2, '0')

  const names = data.names || "Jamshed & Ruxshona"
  const namesParts = names.split(/(?:\s+va\s+|\s+and\s+|\s*&\s*|\s+и\s+)/i)

  const message = data.message || "Hurmatli aziz mehmonimiz\nSizni hayotimizning eng go'zal va baxtli onlarida biz bilan bo'lishingiz istagida nikoh shodiyonamizga taklif qilamiz"

  const slideVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.8 } }
  }

  return (
    <div
      id="invitation-capture"
      className={`absolute inset-0 h-full w-full max-w-[430px] mx-auto overflow-hidden flex flex-col items-center justify-center bg-black ${cormorant.className} text-white`}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" data-bg-capture="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/video/1779848311750.mp4"
        />
        {/* Subtle dark overlay — video ko'rinsin lekin text ham o'qilsin */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Glass Container */}
      <div
        className="relative z-10 w-[90%] aspect-[9/16] max-h-[90vh] flex flex-col overflow-hidden cursor-pointer"
        style={{
          // Minimal blur — video ko'rinadi, lekin text zone lar o'zida alohida overlay bor
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}
        onClick={isEditable ? undefined : nextSlide}
      >
        {/* Inner thin border */}
        <div
          className="absolute inset-2 pointer-events-none"
          style={{ border: '1px solid rgba(255,255,255,0.2)' }}
        />

        {/* Slides */}
        <AnimatePresence mode="wait">

          {/* ── SLIDE 0: Names & Intro (0-3s) ── */}
          {currentSlide === 0 && (
            <motion.div
              key="slide0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-between p-10 text-center"
            >
              {/* Verse top */}
              <div className="mt-8">
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("verse", e.currentTarget.textContent || "")}
                  className="text-[10px] tracking-widest uppercase font-semibold text-white/90 outline-none max-w-[280px] leading-relaxed"
                  style={{ textShadow: lightShadow }}
                >
                  {data.verse || "ALLOH ULARNING QALBINI SEVGILILA BIRLASHTIRDI\nANFOL SURASI 63-OYAT"}
                </p>
                <div className="w-12 h-px bg-white/40 mx-auto mt-4" />
              </div>

              {/* Names center */}
              <div className="flex flex-col items-center">
                {namesParts.length > 1 ? (
                  <div className="flex flex-col items-center">
                    <h1
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleEdit("names", e.currentTarget.textContent + " & " + namesParts[1])}
                      className={`${greatVibes.className} text-7xl outline-none text-white`}
                      style={{ textShadow }}
                    >
                      {namesParts[0].trim()}
                    </h1>
                    <span
                      className={`${greatVibes.className} text-5xl my-2 text-white/80`}
                      style={{ textShadow }}
                    >
                      &
                    </span>
                    <h1
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleEdit("names", namesParts[0] + " & " + e.currentTarget.textContent)}
                      className={`${greatVibes.className} text-7xl outline-none text-white`}
                      style={{ textShadow }}
                    >
                      {namesParts[1].trim()}
                    </h1>
                  </div>
                ) : (
                  <h1
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleEdit("names", e.currentTarget.textContent || "")}
                    className={`${greatVibes.className} text-7xl outline-none px-4 text-white`}
                    style={{ textShadow }}
                  >
                    {names}
                  </h1>
                )}
              </div>

              {/* Bottom Intro */}
              <div className="flex flex-col items-center mb-8">
                <div className="text-white/80 mb-6" style={{ filter: `drop-shadow(${lightShadow})` }}>
                  <RingsIcon />
                </div>
                <h2
                  className={`${playfair.className} tracking-[0.3em] text-[11px] font-semibold uppercase text-white/90`}
                  style={{ textShadow }}
                >
                  M Y <span className="mx-2">—</span> W E D D I N G <span className="mx-2">—</span> D A Y
                </h2>
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 1: Message (3-6s) ── */}
          {currentSlide === 1 && (
            <motion.div
              key="slide1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="text-white/70 mb-10" style={{ filter: `drop-shadow(${lightShadow})` }}>
                <RingsIcon />
              </div>
              
              <div
                className="max-w-[280px] px-6 py-8 rounded-xl border border-white/10"
                style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              >
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("message", e.currentTarget.innerText || "")}
                  className="text-[15px] leading-loose font-medium text-white/95 outline-none whitespace-pre-wrap"
                  style={{ textShadow: lightShadow }}
                >
                  {message}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 2: Details & Outro (6-10s) ── */}
          {currentSlide === 2 && (
            <motion.div
              key="slide2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-between p-10 text-center"
            >
              <div className="mt-12 flex flex-col items-center w-full">
                <h3
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("closingMessage", e.currentTarget.textContent || "")}
                  className={`${greatVibes.className} text-4xl leading-relaxed outline-none text-white max-w-[260px]`}
                  style={{ textShadow }}
                >
                  {data.closingMessage || "Qalblar ezgulikka to'la ushbu kunda do'stlar yonida bo'ling"}
                </h3>
                <div className="w-16 h-px bg-white/30 mx-auto mt-8" />
              </div>

              {/* Date / Time / Venue */}
              <div
                className="flex flex-col items-center space-y-6 px-8 py-8 rounded-xl w-full border border-white/10 mb-8"
                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
              >
                <div
                  className="text-3xl tracking-[0.2em] font-semibold flex items-center gap-4 text-white"
                  style={{ textShadow }}
                >
                  <span>{day.toString().padStart(2, '0')}</span>
                  <div className="w-px h-8 bg-white/40" />
                  <span>{monthNum}</span>
                  <div className="w-px h-8 bg-white/40" />
                  <span>{year}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Soat</p>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleEdit("time", e.currentTarget.textContent || "")}
                    className="text-xl font-medium outline-none text-white/90"
                    style={{ textShadow: lightShadow }}
                  >
                    {data.time || "18:00"}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Manzil</p>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleEdit("venue", e.currentTarget.textContent || "")}
                    className="text-xl font-medium outline-none text-white/90 max-w-[220px]"
                    style={{ textShadow: lightShadow }}
                  >
                    {data.venue || "Tohiriy restaurant"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
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