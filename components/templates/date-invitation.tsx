'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond, Montserrat, Caveat } from 'next/font/google'
import { CalendarDays, Clock, MapPin, Heart, Sparkles } from 'lucide-react'

const cormorant = Cormorant_Garamond({ weight: ['400', '500', '600', '700'], subsets: ['latin'], style: ['normal', 'italic'] })
const montserrat = Montserrat({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] })
const caveat = Caveat({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

interface DateInvitationTemplateProps {
  data: any
  onDataChange?: (data: any) => void
}

const NO_TAUNTS = [
  "Voy, qochdi 😅",
  "Yana bir bor? 😄",
  "Aniqmi? 🤔",
  "U-u-u... 😏",
  "Oxirgi imkon! 🥺",
  "Men kutaman... 💕",
  "Hmm... 🌸",
]

function FloatingHeart({ x, delay, size, duration }: { x: number; delay: number; size: number; duration: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, bottom: '-5%', pointerEvents: 'none', zIndex: 1 }}
      initial={{ y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{
        y: '-105vh',
        opacity: [0, 0.7, 0.7, 0],
        scale: [0.5, 1, 1.1, 0.5],
        rotate: [0, 25, -25, 0],
        x: [0, 15, -15, 0]
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Heart fill="#FFB6C1" stroke="#FF69B4" strokeWidth={1} style={{ width: size, height: size }} />
    </motion.div>
  )
}

function FloatingSparkle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', zIndex: 1 }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, repeatDelay: 2 }}
    >
      <Sparkles className="text-[#87CEFA] stroke-[1.5]" style={{ width: size, height: size }} />
    </motion.div>
  )
}

function ProgressBar({ slide, progress }: { slide: number; progress: number }) {
  return (
    <div style={{
      position: 'absolute', top: 12, left: 0, right: 0,
      display: 'flex', gap: 4, padding: '0 16px', zIndex: 50,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          flex: 1, height: 3,
          background: 'rgba(255, 182, 193, 0.3)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #FF69B4, #87CEFA)', borderRadius: 2 }}
            animate={{ width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%' }}
            transition={{ duration: 0.08, ease: 'linear' }}
          />
        </div>
      ))}
    </div>
  )
}

export function DateInvitationTemplate({ data, onDataChange }: DateInvitationTemplateProps) {
  const [slide, setSlide]       = useState(0)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted]   = useState(false)
  const isEditable = !!onDataChange

  // ─── NO BUTTON STATE ───
  const [noCount, setNoCount] = useState(0)
  const [noPos, setNoPos]     = useState({ left: '50%', top: '4px', transform: 'translateX(-50%)' })
  const [noText, setNoText]   = useState("Yo'q, kela olmayman")
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEdit = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  const DURATIONS = [5000, 6000, 0] // ms; 0 = manual

  useEffect(() => {
    if (slide >= 3 || DURATIONS[slide] === 0 || isEditable) return
    setProgress(0)
    const dur = DURATIONS[slide]
    const interval = 60
    const step = 100 / (dur / interval)
    let pct = 0

    const id = setInterval(() => {
      pct = Math.min(100, pct + step)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(id)
        setTimeout(() => { setSlide(s => s + 1); setProgress(0) }, 80)
      }
    }, interval)

    return () => clearInterval(id)
  }, [slide, isEditable])

  const goNext = () => {
    if (slide < 3) { setSlide(s => s + 1); setProgress(0) }
  }

  const slideVariants = {
    enter:  { opacity: 0, filter: 'blur(10px)', scale: 1.05 },
    center: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
    exit:   { opacity: 0, filter: 'blur(10px)', scale: 0.95, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  }

  // Client-side random elements for visuals
  const clientHearts = React.useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 90 + 5,
      delay: Math.random() * 5,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 4 + 6
    }))
  }, [mounted])

  const clientSparkles = React.useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 3,
      size: Math.random() * 8 + 6
    }))
  }, [mounted])

  // Content fallbacks
  const herName = data.names || "Malika"
  const dateText = data.date || "14-iyun 2025"
  const timeText = data.time || "19:00"
  const venueText = data.venue || "Besh Qo'ng'ir Café"
  const quoteText = data.welcomeMessage || "Siz bilan qahva ustida\ndildan suhbatlashgim keldi..."
  const closingText = data.closingMessage || "Kutaman!"
  const closingSubText = data.closingSub || "Yaxshi kayfiyat olib kelish esdan chiqmasin ✨"
  const asloText = data.aslo || "Ajoyib xotiralarga boy kun bo'ladi... ☕️"

  function renderSlide1() {
    return (
      <div
        onClick={!isEditable ? goNext : undefined}
        style={{ position: 'absolute', inset: 0, cursor: isEditable ? 'default' : 'pointer' }}
        className="flex flex-col items-center justify-center p-4 sm:p-8 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-xl shadow-pink-100/30 flex flex-col items-center justify-center relative overflow-hidden max-w-[340px] sm:max-w-sm w-full mx-auto"
        >
          {/* Top cute bow icon decoration */}
          <div className="mb-4 sm:mb-6 flex justify-center text-pink-400">
            <svg className="w-10 h-7 sm:w-12 sm:h-8" viewBox="0 0 100 60" fill="currentColor">
              <path d="M 50 30 C 35 10, 10 20, 20 40 C 30 55, 45 40, 50 30 Z" />
              <path d="M 50 30 C 65 10, 90 20, 80 40 C 70 55, 55 40, 50 30 Z" />
              <circle cx="50" cy="30" r="8" className="text-pink-500" />
              <path d="M 48 35 Q 40 55, 30 58" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 52 35 Q 60 55, 70 58" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <p className="tracking-[0.4em] uppercase text-[10px] text-pink-500 font-semibold mb-4 sm:mb-6" style={montserrat.style}>
            Senga atab
          </p>

          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("names", e.currentTarget.textContent || "")}
            className="outline-none text-center text-4xl sm:text-5xl md:text-6xl text-[#D26488] leading-tight mb-4 sm:mb-6 font-bold cursor-text"
            style={caveat.style}
          >
            {herName}
          </h1>

          <div className="flex items-center gap-3 w-full max-w-[160px] justify-center mb-4 sm:mb-6">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-pink-300/80" />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-200" />
            </motion.div>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-pink-300/80" />
          </div>

          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("subMessage", e.currentTarget.textContent || "")}
            className="outline-none text-center text-[#4A607A] text-lg sm:text-xl font-medium cursor-text"
            style={cormorant.style}
          >
            {data.subMessage || "Senga gapim bor 🤭"}
          </p>
        </motion.div>

        <motion.p
          onClick={goNext}
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 sm:bottom-12 cursor-pointer tracking-[0.3em] uppercase text-[9px] text-pink-500 font-bold flex items-center gap-1.5"
          style={montserrat.style}
        >
          Bosing <Heart className="w-3 h-3 fill-pink-400 stroke-pink-400" />
        </motion.p>
      </div>
    )
  }

  function renderSlide2() {
    return (
      <div
        onClick={!isEditable ? goNext : undefined}
        style={{ position: 'absolute', inset: 0, cursor: isEditable ? 'default' : 'pointer' }}
        className="flex flex-col items-center justify-center p-4 sm:p-8 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-xl shadow-pink-100/30 w-full max-w-[340px] sm:max-w-sm mx-auto flex flex-col items-center"
        >
          {/* Top quote bubble */}
          <div className="bg-white/60 border border-white/80 rounded-2xl p-3 sm:p-4 text-center mb-4 sm:mb-6 shadow-sm w-full max-w-[280px]">
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit("welcomeMessage", e.currentTarget.innerText || "")}
              className="outline-none text-center text-lg sm:text-xl text-[#3A4E68] font-medium leading-relaxed cursor-text whitespace-pre-line"
              style={caveat.style}
            >
              {quoteText}
            </p>
          </div>

          {/* Cards for Details */}
          <div className="w-full flex flex-col gap-3 sm:gap-4">
            {/* Sana */}
            <div className="flex items-center gap-3 sm:gap-4 bg-white/70 border border-pink-100/50 rounded-2xl p-2.5 sm:p-3 shadow-sm w-full transition-all duration-300 hover:scale-[1.02] hover:bg-white/90">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 stroke-[1.8]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-pink-400 font-semibold" style={montserrat.style}>Sana</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("date", e.currentTarget.textContent || "")}
                  className="outline-none text-[#3A4E68] text-sm sm:text-base font-semibold truncate cursor-text leading-normal"
                  style={montserrat.style}
                >
                  {dateText}
                </span>
              </div>
            </div>

            {/* Vaqt */}
            <div className="flex items-center gap-3 sm:gap-4 bg-white/70 border border-blue-100/50 rounded-2xl p-2.5 sm:p-3 shadow-sm w-full transition-all duration-300 hover:scale-[1.02] hover:bg-white/90">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 stroke-[1.8]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-blue-400 font-semibold" style={montserrat.style}>Vaqt</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("time", e.currentTarget.textContent || "")}
                  className="outline-none text-[#3A4E68] text-sm sm:text-base font-semibold truncate cursor-text leading-normal"
                  style={montserrat.style}
                >
                  {timeText}
                </span>
              </div>
            </div>

            {/* Manzil */}
            <div className="flex items-center gap-3 sm:gap-4 bg-white/70 border border-purple-100/50 rounded-2xl p-2.5 sm:p-3 shadow-sm w-full transition-all duration-300 hover:scale-[1.02] hover:bg-white/90">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 stroke-[1.8]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-purple-400 font-semibold" style={montserrat.style}>Manzil</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit("venue", e.currentTarget.textContent || "")}
                  className="outline-none text-[#3A4E68] text-sm sm:text-base font-semibold cursor-text leading-snug"
                  style={montserrat.style}
                >
                  {venueText}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          onClick={goNext}
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 sm:bottom-12 cursor-pointer tracking-[0.3em] uppercase text-[9px] text-pink-500 font-bold flex items-center gap-1.5"
          style={montserrat.style}
        >
          Keyingisi <Heart className="w-3 h-3 fill-pink-400 stroke-pink-400" />
        </motion.p>
      </div>
    )
  }

  function renderSlide3() {
    const runAway = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      const count = noCount + 1
      setNoCount(count)

      const wrap = wrapRef.current
      if (!wrap) return
      const wW = wrap.offsetWidth
      const bW = 200 // matching the fixed button width

      const positions = [
        { left: '0px',             top: '-46px', transform: 'none' },
        { left: `${wW - bW}px`,   top: '0px',   transform: 'none' },
        { left: '10px',            top: '-50px', transform: 'none' },
        { left: `${wW - bW}px`,   top: '-34px', transform: 'none' },
        { left: '20px',            top: '-48px', transform: 'none' },
        { left: `${(wW-bW)*0.5}px`, top: '-52px', transform: 'none' },
        { left: `${wW - bW}px`,   top: '-42px', transform: 'none' },
      ]
      const pos = positions[(count - 1) % positions.length]
      setNoPos(pos as any)
      setNoText(NO_TAUNTS[Math.min(count - 1, NO_TAUNTS.length - 1)])
    }

    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 absolute inset-0 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-xl shadow-pink-100/30 w-full max-w-[340px] sm:max-w-sm mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl sm:text-5xl text-[#D26488] mb-3 sm:mb-4 text-center font-bold" style={caveat.style}>
            Kelasanmi? 🥺
          </h2>
          
          <div className="flex items-center gap-3 w-full max-w-[120px] justify-center mb-6 sm:mb-8">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-pink-300" />
            <Heart className="w-4 h-4 text-pink-400 animate-pulse fill-pink-100" />
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-pink-300" />
          </div>

          <div className="w-full max-w-[260px] flex flex-col gap-4 relative z-10">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSlide(3)}
              className="w-full py-4 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white text-[11px] uppercase tracking-[0.2em] transition-all rounded-2xl font-bold shadow-lg shadow-pink-200/50 hover:shadow-pink-300/80 font-montserrat"
              style={montserrat.style}
            >
              Ha, albatta kelaman 💖
            </motion.button>

            <div ref={wrapRef} className="relative w-full h-[52px] flex justify-center">
              <motion.button
                onMouseOver={runAway}
                onTouchStart={runAway as any}
                animate={{ left: noPos.left, top: noPos.top }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute py-3.5 border border-blue-200 text-blue-400 text-[11px] uppercase tracking-[0.15em] bg-white/95 hover:bg-blue-50/50 transition-colors rounded-2xl shadow-sm font-semibold"
                style={{ ...montserrat.style, transform: noPos.transform, width: '200px' }}
              >
                {noText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  function renderSlide4() {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 absolute inset-0 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-xl shadow-pink-100/30 w-full max-w-[340px] sm:max-w-sm mx-auto flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 sm:w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mb-4 sm:mb-6 shadow-sm border border-pink-100"
          >
            <Heart className="w-6 h-6 sm:w-7 h-7 text-pink-500 fill-pink-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("closingMessage", e.currentTarget.textContent || "")}
            className="outline-none text-4xl sm:text-5xl text-[#D26488] mb-3 sm:mb-4 text-center font-bold cursor-text"
            style={caveat.style}
          >
            {closingText}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("closingSub", e.currentTarget.textContent || "")}
            className="outline-none text-center text-[#4A607A] italic text-base sm:text-lg mb-6 sm:mb-8 font-medium cursor-text"
            style={cormorant.style}
          >
            {closingSubText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-16 h-[1px] bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-6 sm:mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit("aslo", e.currentTarget.textContent || "")}
            className="outline-none text-center text-[#6C829D] text-[10px] uppercase tracking-[0.2em] px-4 leading-relaxed font-semibold cursor-text"
            style={montserrat.style}
          >
            {asloText}
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Adjust container height dynamically based on editor or public view to avoid vertical scrolling
  const containerStyle = isEditable
    ? {
        position: 'absolute' as const,
        inset: 0,
        background: 'linear-gradient(135deg, #FFF0F5 0%, #EBF4FC 50%, #FFF5F7 100%)'
      }
    : {
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        background: 'linear-gradient(135deg, #FFF0F5 0%, #EBF4FC 50%, #FFF5F7 100%)'
      }

  return (
    <div
      className="w-full overflow-hidden relative shadow-2xl flex flex-col font-sans select-none"
      style={containerStyle}
    >
      {/* Dynamic background light blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-pink-200/40 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[60%] rounded-full bg-blue-200/30 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[35%] left-[20%] w-[50%] h-[40%] rounded-full bg-white/80 blur-[80px]" />
      </div>

      {/* Twinkling sparkles in background */}
      {clientSparkles.map((s, i) => (
        <FloatingSparkle key={`sparkle-${i}`} {...s} />
      ))}

      {/* Floating hearts drifting up */}
      {clientHearts.map((h, i) => (
        <FloatingHeart key={`heart-${i}`} {...h} />
      ))}

      {slide < 3 && !isEditable && (
        <ProgressBar slide={slide} progress={progress} />
      )}

      <AnimatePresence mode="wait">
        {slide === 0 && (
          <motion.div key="s0" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            {renderSlide1()}
          </motion.div>
        )}
        {slide === 1 && (
          <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            {renderSlide2()}
          </motion.div>
        )}
        {slide === 2 && (
          <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            {renderSlide3()}
          </motion.div>
        )}
        {slide === 3 && (
          <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            {renderSlide4()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
