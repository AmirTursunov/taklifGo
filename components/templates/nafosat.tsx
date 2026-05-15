'use client'

import { Calendar, MapPin, Camera, Gift, ArrowDown, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface InvitationData {
  names: string
  date: string
  location: string
  venue: string
  images: string[]
  musicUrl?: string
  mapUrl?: string
  greeting?: string
}

// ── GIRIH GEOMETRIC PATTERN SVG ───────────────────────────────
function GirihPattern({ opacity = 0.06, color = '#1a56a0' }: { opacity?: number; color?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="girih" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* 10-pointed star Girih tile */}
          <g stroke={color} strokeWidth="0.8" fill="none">
            <polygon points="40,4 48,18 64,18 72,30 64,42 72,54 64,66 48,66 40,76 32,66 16,66 8,54 16,42 8,30 16,18 32,18" />
            <polygon points="40,14 46,24 58,24 64,34 58,44 64,54 58,62 46,62 40,70 34,62 22,62 16,54 22,44 16,34 22,24 34,24" />
            <line x1="40" y1="4" x2="40" y2="14" />
            <line x1="64" y1="18" x2="58" y2="24" />
            <line x1="72" y1="54" x2="64" y2="54" />
            <line x1="40" y1="76" x2="40" y2="70" />
            <line x1="8" y1="54" x2="16" y2="54" />
            <line x1="16" y1="18" x2="22" y2="24" />
          </g>
        </pattern>
        <pattern id="girih2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="0.5" fill="none">
            <rect x="10" y="10" width="40" height="40" transform="rotate(45 30 30)" />
            <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" />
            <circle cx="30" cy="30" r="8" />
            <line x1="30" y1="0" x2="30" y2="60" />
            <line x1="0" y1="30" x2="60" y2="30" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  )
}

// ── ISLIMIY CORNER ORNAMENT ────────────────────────────────────
function IslimiyCorner({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`absolute ${className} w-28 sm:w-36 md:w-44 pointer-events-none`}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, opacity: 0.55 }}
      fill="none"
    >
      {/* Main stem */}
      <path d="M8 8 Q8 60 60 112" stroke="#1a56a0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Branch 1 */}
      <path d="M8 8 Q30 20 45 15 Q55 10 50 25 Q44 40 30 35 Q18 30 8 8Z" fill="#1a56a0" opacity="0.18" stroke="#1a56a0" strokeWidth="0.8" />
      {/* Branch 2 */}
      <path d="M20 35 Q40 30 55 40 Q65 50 50 58 Q35 65 25 52 Q15 42 20 35Z" fill="#4a90d9" opacity="0.13" stroke="#1a56a0" strokeWidth="0.7" />
      {/* Branch 3 */}
      <path d="M38 65 Q55 60 68 72 Q76 82 62 88 Q48 93 40 80 Q33 70 38 65Z" fill="#1a56a0" opacity="0.15" stroke="#1a56a0" strokeWidth="0.7" />
      {/* Small flowers */}
      <circle cx="50" cy="16" r="3.5" fill="#4a90d9" opacity="0.5" />
      <circle cx="50" cy="16" r="1.5" fill="#1a56a0" opacity="0.8" />
      <circle cx="52" cy="50" r="3" fill="#4a90d9" opacity="0.45" />
      <circle cx="52" cy="50" r="1.2" fill="#1a56a0" opacity="0.8" />
      <circle cx="65" cy="80" r="3" fill="#4a90d9" opacity="0.45" />
      <circle cx="65" cy="80" r="1.2" fill="#1a56a0" opacity="0.8" />
      {/* Leaf dots */}
      <circle cx="30" cy="42" r="2" fill="#1a56a0" opacity="0.3" />
      <circle cx="45" cy="72" r="2" fill="#1a56a0" opacity="0.3" />
    </svg>
  )
}

// ── SILVER DIVIDER ────────────────────────────────────────────
function SilverDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #a8c4e0, #c9d8e8)' }} />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 1L13.2 8.2L20.5 8.2L14.9 12.8L17.1 20L11 15.4L4.9 20L7.1 12.8L1.5 8.2L8.8 8.2Z" fill="#4a90d9" opacity="0.7" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L8.4 5.2L12.7 5.2L9.3 7.8L10.7 12L7 9.4L3.3 12L4.7 7.8L1.3 5.2L5.6 5.2Z" fill="#a8c4e0" opacity="0.6" />
      </svg>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 1L13.2 8.2L20.5 8.2L14.9 12.8L17.1 20L11 15.4L4.9 20L7.1 12.8L1.5 8.2L8.8 8.2Z" fill="#4a90d9" opacity="0.7" />
      </svg>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #a8c4e0, #c9d8e8)' }} />
    </div>
  )
}

// ── COUNTDOWN ─────────────────────────────────────────────────
function CountdownTimer({ dateStr }: { dateStr: string }) {
  const getTimeLeft = () => {
    const diff = new Date(dateStr).getTime() - Date.now()
    if (isNaN(diff) || diff <= 0) return null
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [tl, setTl] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [dateStr])

  const units = tl
    ? [{ v: tl.days, l: 'Kun' }, { v: tl.hours, l: 'Soat' }, { v: tl.minutes, l: 'Daqiqa' }, { v: tl.seconds, l: 'Soniya' }]
    : null

  if (!units) return (
    <p className="text-sm tracking-widest text-[#4a90d9] uppercase font-semibold">To'y muborak bo'lsin! 🎊</p>
  )

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <motion.div
            key={u.v}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="relative w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center"
            style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, #ffffff 0%, #eef4fb 100%)',
              border: '1px solid #c9d8e8',
              boxShadow: '0 4px 16px rgba(26,86,160,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {/* Girih corner marks */}
            {[['top-1 left-1', 'tl'], ['top-1 right-1', 'tr'], ['bottom-1 left-1', 'bl'], ['bottom-1 right-1', 'br']].map(([c, k]) => (
              <div key={k} className={`absolute ${c} w-2 h-2`}
                style={{
                  borderTop: k[0] === 't' ? '1.5px solid #a8c4e0' : 'none',
                  borderBottom: k[0] === 'b' ? '1.5px solid #a8c4e0' : 'none',
                  borderLeft: k[1] === 'l' ? '1.5px solid #a8c4e0' : 'none',
                  borderRight: k[1] === 'r' ? '1.5px solid #a8c4e0' : 'none',
                }} />
            ))}
            <span className="text-2xl font-bold tabular-nums" style={{ color: '#1a3a6b', fontFamily: "'Playfair Display', serif" }}>
              {String(u.v).padStart(2, '0')}
            </span>
          </motion.div>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#7aafd4' }}>{u.l}</span>
        </div>
      ))}
    </div>
  )
}

// ── MAP EMBED ──────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const src = mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(location || 'Tashkent')}&output=embed&z=15`
  return (
    <div className="w-full h-64 sm:h-80 overflow-hidden"
      style={{ border: '1px solid #c9d8e8', boxShadow: '0 8px 32px rgba(26,86,160,0.08)' }}>
      <iframe src={src} width="100%" height="100%"
        style={{ border: 0 }} allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" title="Manzil" />
    </div>
  )
}

// ── FLOATING PARTICLES ────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            left: `${5 + (i * 37) % 90}%`,
            top: `${5 + (i * 53) % 90}%`,
            background: i % 3 === 0 ? '#4a90d9' : i % 3 === 1 ? '#a8c4e0' : '#c9d8e8',
          }}
          animate={{
            y: [0, -20 - (i % 3) * 10, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── MAIN TEMPLATE ──────────────────────────────────────────────
export function NafosatTemplate({
  data,
  onDataChange,
}: {
  data: InvitationData
  onDataChange?: (d: Partial<InvitationData>) => void
}) {
  const { t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const handleEdit = (field: keyof InvitationData, value: string) => {
    if (onDataChange) onDataChange({ [field]: value })
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onDataChange) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const imgs = [...data.images]
        imgs[index] = ev.target?.result as string
        onDataChange({ images: imgs })
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause()
    }
  }, [isPlaying, data.musicUrl])

  return (
    <div className="w-full min-h-screen overflow-x-hidden"
      style={{ background: '#f7fafd', color: '#1a2a4a', fontFamily: "'Cormorant Garamond', serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
        .cinzel   { font-family: 'Cinzel', serif; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }

        ${!onDataChange ? `
          [contenteditable="false"] {
            outline: none !important;
            cursor: default !important;
          }
        ` : ''}

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .silver-shimmer {
          background: linear-gradient(90deg, #a8c4e0, #dceaf5, #ffffff, #c9d8e8, #4a90d9, #a8c4e0);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(74,144,217,0.2); }
          50%       { box-shadow: 0 0 40px rgba(74,144,217,0.45), 0 0 80px rgba(74,144,217,0.15); }
        }
        .glow-border { animation: borderGlow 3s ease-in-out infinite; }

        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        .draw-line {
          stroke-dasharray: 1000;
          animation: drawLine 2s ease forwards;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #f0f6ff 0%, #e8f1fb 40%, #f7fafd 100%)' }}
      >
        <GirihPattern opacity={0.055} color="#1a56a0" />
        <FloatingParticles />

        {/* Islimiy corner ornaments */}
        <IslimiyCorner className="top-0 left-0" />
        <IslimiyCorner className="top-0 right-0" flip />
        <IslimiyCorner className="bottom-0 left-0" style={{ transform: 'scaleY(-1)' } as any} />
        <IslimiyCorner className="bottom-0 right-0" style={{ transform: 'scale(-1,-1)' } as any} />

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(74,144,217,0.08) 0%, transparent 70%)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-6">

          {/* Arabic bismillah-style top label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Girih star decoration */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-60">
              <path d="M24 2L28 16L42 12L34 24L42 36L28 32L24 46L20 32L6 36L14 24L6 12L20 16Z"
                fill="none" stroke="#4a90d9" strokeWidth="1.2" />
              <path d="M24 10L27 19L36 17L30 24L36 31L27 29L24 38L21 29L12 31L18 24L12 17L21 19Z"
                fill="#4a90d9" opacity="0.15" stroke="#4a90d9" strokeWidth="0.8" />
              <circle cx="24" cy="24" r="4" fill="#4a90d9" opacity="0.3" />
            </svg>
            <p 
              className="cinzel text-[9px] sm:text-[11px] tracking-[0.55em] uppercase outline-none focus:outline-dashed focus:outline-[#4a90d9] px-2 rounded-lg"
              style={{ color: '#7aafd4' }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => onDataChange?.({ greeting: e.currentTarget.textContent || "" })}
            >
              {data.greeting || "Nikoh Ziyofatiga Taklif"}
            </p>
          </motion.div>

          {/* Names — main centrepiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="playfair font-black leading-none outline-none focus:outline-dashed focus:outline-[#4a90d9] px-4 rounded-xl"
              style={{
                fontSize: 'clamp(2.8rem, 9vw, 7rem)',
                background: 'linear-gradient(135deg, #1a3a6b 0%, #1a56a0 35%, #4a90d9 55%, #a8c4e0 70%, #1a56a0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                letterSpacing: '-0.02em',
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || 'Sarvinoz & Jasur'}
            </h1>
          </motion.div>

          {/* Animated SVG divider line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="max-w-md mx-auto"
          >
            <svg viewBox="0 0 400 20" className="w-full" fill="none">
              <path
                className="draw-line"
                d="M10 10 Q100 4 200 10 Q300 16 390 10"
                stroke="url(#lineGrad)" strokeWidth="1.2" strokeLinecap="round"
                style={{ animationDelay: '1.2s' }}
              />
              <circle cx="200" cy="10" r="3.5" fill="#4a90d9" opacity="0.7" />
              <circle cx="100" cy="7" r="2" fill="#a8c4e0" opacity="0.6" />
              <circle cx="300" cy="13" r="2" fill="#a8c4e0" opacity="0.6" />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="#a8c4e0" />
                  <stop offset="50%" stopColor="#4a90d9" />
                  <stop offset="70%" stopColor="#a8c4e0" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="cormorant italic text-xl sm:text-2xl outline-none focus:outline-dashed focus:outline-[#4a90d9] px-4 rounded-xl"
            style={{ color: '#4a78a8' }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
          >
            {data.date || '15 Iyun, 2025'}
          </motion.p>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase outline-none focus:outline-dashed focus:outline-[#4a90d9] px-4 rounded-xl"
            style={{ color: '#7aafd4' }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('venue', e.currentTarget.textContent || '')}
          >
            {data.venue || 'Grand Palace'} · {data.location || 'Toshkent'}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="glow-border relative px-10 py-3.5 cinzel text-[10px] tracking-[0.4em] uppercase transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1a3a6b 0%, #1a56a0 100%)',
                color: '#e8f1fb',
                border: '1px solid rgba(74,144,217,0.4)',
              }}
            >
              <span className="relative z-10">✦ Taklifnomani Ko'rish ✦</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4" style={{ color: '#a8c4e0' }} />
          </motion.div>
          <p className="cinzel text-[7px] tracking-[0.5em] uppercase" style={{ color: '#a8c4e0' }}>Pastga</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WELCOME + COUNTDOWN
      ══════════════════════════════════════════ */}
      <motion.section
        id="details-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f7fafd 0%, #eef4fb 100%)' }}
      >
        <GirihPattern opacity={0.04} color="#1a56a0" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <p className="cinzel text-[9px] tracking-[0.6em] uppercase" style={{ color: '#7aafd4' }}>
              Aziz Mehmonlar
            </p>
            <h2
              className="playfair font-bold leading-tight outline-none focus:outline-dashed focus:outline-[#4a90d9] px-4 rounded-xl"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#1a3a6b',
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || 'Sarvinoz & Jasur'}
            </h2>
            <p className="cormorant italic text-lg sm:text-xl max-w-lg mx-auto leading-relaxed"
              style={{ color: '#4a78a8' }}>
              Nikoh to'yimizga tashrif buyurishingizni so'raymiz — bu kunni siz bilan birga nishonlamoqchimiz.
            </p>
          </motion.div>

          <SilverDivider />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="cinzel text-[9px] tracking-[0.5em] uppercase mb-6" style={{ color: '#7aafd4' }}>
              To'yga qadar
            </p>
            <CountdownTimer dateStr={data.date || ''} />
          </motion.div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
        style={{ background: '#f0f6ff' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Camera className="w-5 h-5 mx-auto opacity-40" style={{ color: '#4a90d9' }} />
            <h2 className="playfair text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a6b' }}>
              Bizning Albom
            </h2>
            <SilverDivider className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.images.map((url, i) => {
              const isEditable = !!onDataChange

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className={`group relative overflow-hidden ${isEditable ? 'cursor-pointer' : ''}`}
                  style={{
                    border: '1px solid #c9d8e8',
                    boxShadow: '0 4px 20px rgba(26,86,160,0.07)',
                    minHeight: '220px',
                    aspectRatio: '3/4',
                  }}
                >
                  {isEditable && (
                    <label className="absolute inset-0 cursor-pointer z-10">
                      <input type="file" className="hidden" accept="image/*"
                        onChange={(e) => handleImageUpload(i, e)} />
                    </label>
                  )}
                  <img src={url} alt={`Rasm ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transform: 'scale(1)', transition: 'transform 0.7s ease' }}
                  />
                  {/* Blue overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(26,56,107,0.35) 100%)' }} />
                  {/* Girih corner on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 1L12 7L18 7L13.5 10.5L15.5 16.5L10 13L4.5 16.5L6.5 10.5L2 7L8 7Z"
                        fill="none" stroke="white" strokeWidth="0.8" />
                    </svg>
                  </div>
                  {isEditable && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{ background: 'rgba(26,56,107,0.5)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          EVENT DETAILS
      ══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #eef4fb 0%, #f7fafd 100%)' }}
      >
        <GirihPattern opacity={0.05} color="#1a56a0" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="cinzel text-[9px] tracking-[0.6em] uppercase" style={{ color: '#7aafd4' }}>To'y Tafsilotlari</p>
            <h2 className="playfair text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a6b' }}>Muhim Ma'lumotlar</h2>
            <SilverDivider className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { id: 'date', icon: Calendar, title: 'Sana', sub_title: "To'y kuni", desc: data.date || '15 Iyun, 2025', sub: 'Soat 18:00 dan' },
              { id: 'venue', icon: MapPin, title: 'Manzil', sub_title: 'Ziyofat joyi', desc: data.venue || 'Grand Palace', sub: data.location || 'Toshkent' },
              { id: 'gift', icon: Gift, title: "Sovg'a", sub_title: 'Eng yaxshi tilaklaringiz', desc: 'Tashrif buyurishingiz', sub: "bizning eng katta sovg'amiz" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="relative p-8 text-center group transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #c9d8e8',
                  boxShadow: '0 4px 24px rgba(26,86,160,0.06)',
                }}
              >
                {/* Islimiy corner micro-ornaments */}
                {[['top-0 left-0', false, false], ['top-0 right-0', true, false], ['bottom-0 left-0', false, true], ['bottom-0 right-0', true, true]].map(([c, fx, fy], j) => (
                  <svg key={j} className={`absolute ${c} w-8 h-8 opacity-20 group-hover:opacity-50 transition-opacity duration-300`}
                    viewBox="0 0 30 30" fill="none"
                    style={{ transform: `scale(${fx ? -1 : 1}, ${fy ? -1 : 1})` }}>
                    <path d="M2 2 Q2 15 15 28" stroke="#1a56a0" strokeWidth="1" strokeLinecap="round" />
                    <path d="M2 2 Q12 4 14 10 Q10 16 4 12 Q-1 8 2 2Z" fill="#4a90d9" opacity="0.4" />
                    <circle cx="14" cy="9" r="2" fill="#4a90d9" opacity="0.5" />
                  </svg>
                ))}

                <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #eef4fb, #dce8f5)', border: '1px solid #c9d8e8' }}>
                  <item.icon className="w-5 h-5" style={{ color: '#4a90d9' }} />
                </div>
                <p className="cinzel text-[7px] tracking-[0.4em] uppercase mb-1" style={{ color: '#a8c4e0' }}>{item.sub_title}</p>
                <p className="cinzel text-[9px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4a78a8' }}>{item.title}</p>
                <p
                  className="playfair text-lg font-bold leading-tight mb-1 outline-none focus:outline-dashed focus:outline-[#4a90d9] rounded-md px-1"
                  style={{ color: '#1a3a6b' }}
                  contentEditable={!!onDataChange && item.id !== 'gift'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof InvitationData, e.currentTarget.textContent || '')}
                >
                  {item.desc}
                </p>
                <p
                  className="cormorant italic text-sm outline-none focus:outline-dashed focus:outline-[#4a90d9] rounded-md px-1"
                  style={{ color: '#7aafd4' }}
                  contentEditable={!!onDataChange && item.id === 'venue'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('location', e.currentTarget.textContent || '')}
                >
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          MAP
      ══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 space-y-2">
          <MapPin className="w-5 h-5 mx-auto opacity-40" style={{ color: '#4a90d9' }} />
          <h2 className="playfair text-xl font-bold" style={{ color: '#1a3a6b' }}>
            {data.venue || 'Grand Palace'}
          </h2>
          <p
            className="cormorant italic outline-none focus:outline-dashed focus:outline-[#4a90d9] px-2 rounded-md"
            style={{ color: '#7aafd4' }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('location', e.currentTarget.textContent || '')}
          >
            {data.location || 'Toshkent'}
          </p>
        </div>
        <MapEmbed location={data.location} mapUrl={data.mapUrl} />
      </motion.section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative py-28 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a6b 0%, #1a56a0 50%, #1a3a6b 100%)' }}
      >
        <GirihPattern opacity={0.08} color="#ffffff" />

        {/* Large decorative star */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="600" height="600" viewBox="0 0 600 600" className="opacity-[0.04]">
            <path d="M300 20L340 180L500 140L400 280L520 380L360 360L300 520L240 360L80 380L200 280L100 140L260 180Z"
              fill="white" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Islimiy corners white */}
        <svg className="absolute top-0 left-0 w-32 sm:w-44 opacity-20" viewBox="0 0 120 120" fill="none">
          <path d="M8 8 Q8 60 60 112" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 8 Q30 20 45 15 Q55 10 50 25 Q44 40 30 35 Q18 30 8 8Z" fill="white" opacity="0.3" stroke="white" strokeWidth="0.8" />
          <path d="M20 35 Q40 30 55 40 Q65 50 50 58 Q35 65 25 52 Q15 42 20 35Z" fill="white" opacity="0.2" />
          <circle cx="50" cy="16" r="3" fill="white" opacity="0.5" />
          <circle cx="52" cy="50" r="2.5" fill="white" opacity="0.4" />
        </svg>
        <svg className="absolute top-0 right-0 w-32 sm:w-44 opacity-20" viewBox="0 0 120 120" fill="none"
          style={{ transform: 'scaleX(-1)' }}>
          <path d="M8 8 Q8 60 60 112" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 8 Q30 20 45 15 Q55 10 50 25 Q44 40 30 35 Q18 30 8 8Z" fill="white" opacity="0.3" stroke="white" strokeWidth="0.8" />
          <circle cx="50" cy="16" r="3" fill="white" opacity="0.5" />
        </svg>

        <div className="relative z-10 space-y-8 px-6">
          <SilverDivider className="max-w-sm mx-auto [&>div]:bg-gradient-to-r [&>div]:from-transparent [&>div]:to-white/30" />

          <div className="space-y-3">
            <p className="cinzel text-[8px] tracking-[0.6em] uppercase text-blue-200/60">
              Muborak Bo'lsin
            </p>
            <h2
              className="playfair font-black leading-none outline-none focus:outline-dashed focus:outline-white/50 px-4 rounded-xl"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #c9d8e8 40%, #a8c4e0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || 'Sarvinoz & Jasur'}
            </h2>
            <p className="cormorant italic text-blue-200/70 text-lg tracking-widest">
              {data.date || '15 Iyun, 2025'} · Abadiyatga
            </p>
          </div>

          {/* Girih star row */}
          <div className="flex items-center justify-center gap-4">
            {[20, 14, 20].map((s, i) => (
              <svg key={i} width={s} height={s} viewBox="0 0 20 20" fill="none" className="opacity-40">
                <path d="M10 1L12 7L18 7L13.5 10.5L15.5 16.5L10 13L4.5 16.5L6.5 10.5L2 7L8 7Z"
                  fill="white" stroke="white" strokeWidth="0.5" />
              </svg>
            ))}
          </div>

          <SilverDivider className="max-w-sm mx-auto" />
        </div>
      </motion.footer>

      {/* ══════════════════════════════════════════
          MUSIC
      ══════════════════════════════════════════ */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 flex items-center justify-center transition-all duration-400"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #1a3a6b, #1a56a0)'
                : 'rgba(247,250,253,0.95)',
              border: '1px solid #c9d8e8',
              boxShadow: isPlaying
                ? '0 0 24px rgba(74,144,217,0.4)'
                : '0 4px 16px rgba(26,86,160,0.1)',
            }}
          >
            {isPlaying
              ? <Volume2 className="w-5 h-5 text-blue-100 animate-pulse" />
              : <VolumeX className="w-5 h-5" style={{ color: '#4a90d9' }} />
            }
          </motion.button>
          <audio ref={audioRef} src={data.musicUrl || ''} loop />
        </div>
      )}
    </div>
  )
}
