'use client'

import { Calendar, MapPin, Camera, Gift, ArrowDown, Volume2, VolumeX, Sparkles } from 'lucide-react'
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

// ── LUXURY GIRIH PATTERN ───────────────────────────────────────
function LuxuryGirih({ opacity = 0.05, color = '#D4AF37' }: { opacity?: number; color?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="luxuryGirih" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="0.5" fill="none">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
            <path d="M0 0 L100 100 M100 0 L0 100" />
            <circle cx="50" cy="50" r="25" />
            <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#luxuryGirih)" />
    </svg>
  )
}

// ── LUXURY CORNER ORNAMENT ────────────────────────────────────
function LuxuryCorner({ className = '', flipX = false, flipY = false }: { className?: string; flipX?: boolean; flipY?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`absolute ${className} w-32 sm:w-48 md:w-56 pointer-events-none`}
      style={{ 
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        opacity: 0.8 
      }}
      fill="none"
    >
      <path d="M10 10 Q10 60 60 110" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 10 Q40 20 50 10 Q60 0 55 20 Q50 40 30 35 Q15 30 10 10Z" fill="#D4AF37" opacity="0.15" />
      <path d="M25 40 Q45 35 55 45 Q65 55 50 65 Q35 75 25 55 Q15 45 25 40Z" fill="#B8860B" opacity="0.12" />
      <circle cx="55" cy="15" r="3" fill="#D4AF37" opacity="0.5" />
      <circle cx="65" cy="55" r="2.5" fill="#D4AF37" opacity="0.4" />
      {/* Decorative dots */}
      <circle cx="15" cy="45" r="1.5" fill="#D4AF37" opacity="0.3" />
      <circle cx="45" cy="85" r="1.5" fill="#D4AF37" opacity="0.3" />
    </svg>
  )
}

// ── GOLDEN DIVIDER ────────────────────────────────────────────
function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, #B8860B)' }} />
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37]" />
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
      </div>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #D4AF37, #B8860B)' }} />
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
    <p className="text-base tracking-[0.2em] text-[#B8860B] uppercase font-bold">Nikoh Muborak Bo'lsin! 💍</p>
  )

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <motion.div
            key={u.v}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #fffcf0 100%)',
              border: '1.5px solid #D4AF37',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(212,175,55,0.12)',
            }}
          >
            <span className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: '#8B6B23', fontFamily: "'Playfair Display', serif" }}>
              {String(u.v).padStart(2, '0')}
            </span>
            <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }} />
            <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }} />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#B8860B' }}>{u.l}</span>
        </div>
      ))}
    </div>
  )
}

// ── MAIN TEMPLATE ──────────────────────────────────────────────
export function GoldenWeddingTemplate({
  data,
  onDataChange,
}: {
  data: InvitationData
  onDataChange?: (d: Partial<InvitationData>) => void
}) {
  const { t, lang } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

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
      style={{ background: '#fffcf0', color: '#43341b', fontFamily: "'Playfair Display', serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
        .montserrat { font-family: 'Montserrat', sans-serif; }
        .great-vibes { font-family: 'Great Vibes', cursive; }

        ${!onDataChange ? `
          [contenteditable="false"] {
            outline: none !important;
            cursor: default !important;
          }
        ` : ''}

        @keyframes shimmerGold {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #D4AF37, #F9F295, #E6B800, #F9F295, #D4AF37);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 4s linear infinite;
        }
        @keyframes glowGold {
          0%, 100% { box-shadow: 0 0 15px rgba(212,175,55,0.2); }
          50%       { box-shadow: 0 0 35px rgba(212,175,55,0.4), 0 0 70px rgba(212,175,55,0.1); }
        }
        .glow-gold { animation: glowGold 3s ease-in-out infinite; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════ */}
      <section ref={heroRef}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #ffffff 0%, #fffbf0 50%, #fff9e6 100%)' }}
      >
        <LuxuryGirih opacity={0.06} color="#D4AF37" />
        
        {/* Ornaments */}
        <LuxuryCorner className="top-0 left-0" />
        <LuxuryCorner className="top-0 right-0" flipX />
        <LuxuryCorner className="bottom-0 left-0" flipY />
        <LuxuryCorner className="bottom-0 right-0" flipX flipY />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-10">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border border-[#D4AF37] rotate-45 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#D4AF37] -rotate-45" />
            </div>
            <p className="montserrat text-[10px] tracking-[0.6em] uppercase font-bold text-[#B8860B] outline-none"
               contentEditable={!!onDataChange}
               suppressContentEditableWarning
               onBlur={(e) => onDataChange?.({ greeting: e.currentTarget.textContent || "" })}>
              {data.greeting || "NIKOH TO'YIGA TAKLIFNOMA"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h1
              className="great-vibes leading-tight outline-none focus:outline-dashed focus:outline-[#D4AF37] px-4 rounded-2xl"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 8.5rem)',
                color: '#8B6B23',
                textShadow: '0 4px 12px rgba(212,175,55,0.15)',
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || 'Jasur & Malika'}
            </h1>
          </motion.div>

          <GoldDivider className="max-w-xs mx-auto" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="playfair text-2xl sm:text-3xl font-bold tracking-widest text-[#B8860B] outline-none"
               contentEditable={!!onDataChange}
               suppressContentEditableWarning
               onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}>
              {data.date || '15 Iyun, 2028'}
            </p>
            <p className="montserrat text-[11px] tracking-[0.4em] uppercase font-black text-[#8B6B23] outline-none"
               contentEditable={!!onDataChange}
               suppressContentEditableWarning
               onBlur={(e) => handleEdit('venue', e.currentTarget.textContent || '')}>
              {data.venue || 'Luxury Grand Ballroom'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="pt-6"
          >
            <button
              onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="glow-gold px-12 py-4 bg-[#8B6B23] text-white montserrat text-[10px] tracking-[0.5em] uppercase font-black hover:bg-[#D4AF37] transition-colors"
            >
              Tafsilotlar
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5 text-[#D4AF37]" />
          </motion.div>
        </div>
      </section>

      {/* ══ STORY ═══════════════════════════════════ */}
      <motion.section
        id="story-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 text-center relative"
        style={{ background: '#fffdf5' }}
      >
        <LuxuryGirih opacity={0.04} color="#D4AF37" />
        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-16 h-16 border-2 border-[#D4AF37] rounded-full mx-auto flex items-center justify-center"
          >
            <Gift className="w-8 h-8 text-[#D4AF37]" />
          </motion.div>
          <div className="space-y-6">
            <h2 className="playfair text-3xl sm:text-4xl font-black text-[#8B6B23]">Hurmatli Mehmonlar!</h2>
            <p className="montserrat text-lg sm:text-xl leading-relaxed text-[#5c4a26] italic px-4 outline-none"
               contentEditable={!!onDataChange}
               suppressContentEditableWarning
               onBlur={(e) => handleEdit('message', e.currentTarget.textContent || '')}>
              "Hayotimizning eng hayajonli va unutilmas kunini siz — biz uchun eng qadrli bo'lgan insonlar bilan birga nishonlashdan baxtiyormiz. Tashrifingiz davramizga yanada fayz va ko'rk bag'ishlaydi."
            </p>
          </div>
          
          <GoldDivider />
          
          <div className="space-y-6">
            <p className="montserrat text-[10px] tracking-[0.4em] uppercase font-bold text-[#B8860B]">To'yga qadar qoldi</p>
            <CountdownTimer dateStr={data.date || '2028-06-15'} />
          </div>
        </div>
      </motion.section>

      {/* ══ GALLERY ═══════════════════════════════════ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="great-vibes text-5xl text-[#8B6B23]">Baxtli Lahzalar</h2>
            <GoldDivider className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.images.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="relative aspect-[3/4] overflow-hidden group shadow-2xl"
                style={{ border: '4px solid white', outline: '1px solid #D4AF37' }}
              >
                {onDataChange && (
                  <label className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                    <Camera className="w-10 h-10 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                  </label>
                )}
                <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DETAILS ═══════════════════════════════════ */}
      <section className="py-24 px-6 relative" style={{ background: 'linear-gradient(180deg, #fff9e6 0%, #ffffff 100%)' }}>
        <LuxuryGirih opacity={0.06} color="#D4AF37" />
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="playfair text-4xl font-black text-[#8B6B23]">Sana & Joy</h2>
              <GoldDivider className="w-32" />
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Calendar className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="montserrat font-bold text-[#8B6B23] tracking-widest uppercase text-xs mb-2">Tadbir Sanasi</h4>
                  <p className="playfair text-xl font-bold">{data.date}</p>
                  <p className="montserrat text-sm text-[#B8860B] mt-1">Soat 18:00 dan boshlab</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="montserrat font-bold text-[#8B6B23] tracking-widest uppercase text-xs mb-2">Manzil</h4>
                  <p className="playfair text-xl font-bold">{data.venue}</p>
                  <p className="montserrat text-sm text-[#B8860B] mt-1">{data.location}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.open(data.mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(data.location)}`, '_blank')}
              className="w-full py-5 bg-[#8B6B23] text-white montserrat text-[10px] tracking-[0.5em] uppercase font-black shadow-2xl hover:bg-[#D4AF37] transition-all"
            >
              Xaritada Ko'rish
            </button>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white">
            <iframe
              src={data.mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(data.location || 'Tashkent')}&output=embed`}
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-[#D4AF37]/30 rounded-[3.3rem]" />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════ */}
      <footer className="py-32 text-center relative overflow-hidden" style={{ background: '#2d2516' }}>
        <LuxuryGirih opacity={0.12} color="#D4AF37" />
        <div className="relative z-10 space-y-12 px-6">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-[#D4AF37]/50" />
            <Sparkles className="text-[#D4AF37] w-6 h-6" />
            <div className="h-px w-16 bg-[#D4AF37]/50" />
          </div>
          
          <div className="space-y-4">
            <p className="great-vibes text-6xl sm:text-8xl text-[#F9F295] gold-shimmer">
              {data.names || 'Jasur & Malika'}
            </p>
            <p className="montserrat text-[10px] tracking-[0.8em] uppercase font-bold text-[#D4AF37]/80">
              BAXTIMIZGA SHERIK BO'LING
            </p>
          </div>

          <GoldDivider className="max-w-md mx-auto opacity-30" />
        </div>
      </footer>

      {/* MUSIC */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 ${
              isPlaying ? 'bg-[#8B6B23] border-white scale-110' : 'bg-white border-[#D4AF37] hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-7 h-7 text-white animate-pulse" />
            ) : (
              <VolumeX className="w-7 h-7 text-[#D4AF37]" />
            )}
          </button>
          <audio ref={audioRef} src={data.musicUrl} loop />
        </div>
      )}
    </div>
  )
}
