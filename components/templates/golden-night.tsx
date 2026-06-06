'use client'

import { InvitationCanvas } from '@/components/invitation-canvas'
import { Calendar, MapPin, Camera, Gift, ArrowDown, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useRef, useEffect, useCallback } from 'react'
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

// ── Confetti Particle ─────────────────────────────────────────
interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  shape: 'rect' | 'circle' | 'diamond'
  rotation: number
  rotationSpeed: number
  opacity: number
  gravity: number
}

function ConfettiCanvas({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  const COLORS = [
    '#FFD700', '#FFC200', '#B8860B', '#FFE066',
    '#FFFFFF', '#F5F5DC', '#C0C0C0',
    '#FF6B6B', '#FF8E53', '#FFF5BA',
  ]

  const spawn = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const newParticles: Particle[] = Array.from({ length: 280 }, (_, i) => {
      const angle = (Math.random() * Math.PI * 2)
      const speed = 6 + Math.random() * 14
      return {
        id: Date.now() + i,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 8,
        shape: (['rect', 'circle', 'diamond'] as const)[Math.floor(Math.random() * 3)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        gravity: 0.18 + Math.random() * 0.12,
      }
    })
    particlesRef.current = newParticles
  }, [])

  useEffect(() => {
    if (!trigger) return
    spawn()
  }, [trigger, spawn])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.01)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.opacity -= 0.008

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'diamond') {
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, 0)
          ctx.lineTo(0, p.size / 2)
          ctx.lineTo(-p.size / 2, 0)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        ctx.restore()
      }
      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
    />
  )
}

// ── Countdown Timer ───────────────────────────────────────────
function CountdownTimer({ dateStr }: { dateStr: string }) {
  const { lang } = useLanguage()
  const labels = {
    uz: { days: 'Kun', hours: 'Soat', minutes: 'Daqiqa', seconds: 'Soniya', passed: "To'y bo'lib o'tdi 🎉" },
    ru: { days: 'Дней', hours: 'Часов', minutes: 'Минут', seconds: 'Секунд', passed: 'Свадьба состоялась 🎉' },
    en: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', passed: 'The wedding has passed 🎉' },
  }
  const l = labels[(lang as keyof typeof labels)] || labels.uz

  const getTimeLeft = () => {
    const target = new Date(dateStr)
    const diff = target.getTime() - Date.now()
    if (isNaN(diff) || diff <= 0) return null
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [dateStr])

  if (!timeLeft) return (
    <p className="text-amber-400 text-sm tracking-widest uppercase font-bold">{l.passed}</p>
  )

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {[
        { v: timeLeft.days, l: l.days },
        { v: timeLeft.hours, l: l.hours },
        { v: timeLeft.minutes, l: l.minutes },
        { v: timeLeft.seconds, l: l.seconds },
      ].map((u, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            {/* Gold border glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/30 to-yellow-600/10 border border-amber-500/40 shadow-[0_0_18px_rgba(212,175,55,0.2)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums" style={{ fontFamily: "'Cinzel', serif" }}>
                {String(u.v).padStart(2, '0')}
              </span>
            </div>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-amber-600/70 font-bold mt-2">{u.l}</span>
        </div>
      ))}
    </div>
  )
}

// ── Map Embed ─────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const query = encodeURIComponent(location || 'Tashkent, Uzbekistan')
  const src = mapUrl || `https://maps.google.com/maps?q=${query}&output=embed&z=15`
  return (
    <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
      <iframe src={src} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Wedding location" />
    </div>
  )
}

// ── Ornament SVG ──────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#D4AF37" opacity="0.8" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
    </div>
  )
}

// ── Main Template ─────────────────────────────────────────────
export function GoldenNightTemplate({
  data,
  onDataChange,
}: {
  data: InvitationData
  onDataChange?: (d: Partial<InvitationData>) => void
}) {
  const { t } = useLanguage()
  const [confetti, setConfetti] = useState(false)
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
      isPlaying
        ? audioRef.current.play().catch(() => { })
        : audioRef.current.pause()
    }
  }, [isPlaying, data.musicUrl])

  const triggerConfetti = () => {
    setConfetti(false)
    requestAnimationFrame(() => setConfetti(true))
  }

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden selection:bg-amber-500/30"
      style={{
        background: '#0B132B',
        color: '#F8F9FA',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        
        .cinzel { font-family: 'Cinzel', serif; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <ConfettiCanvas trigger={confetti} />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden" style={{ position: 'relative' }}>
        {/* Dark radial bg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1C2D5A_0%,_#0B132B_70%)]" />

        {/* Gold dust particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.15 + Math.random() * 0.4,
                boxShadow: '0 0 10px rgba(251,191,36,0.8)',
              }}
              animate={{
                y: [0, -40 - Math.random() * 50, 0],
                x: [0, (Math.random() - 0.5) * 30, 0],
                opacity: [0, 0.8, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Gold corner ornaments */}
        {[
          'top-6 left-6 rotate-0',
          'top-6 right-6 rotate-90',
          'bottom-6 right-6 rotate-180',
          'bottom-6 left-6 -rotate-90',
        ].map((pos, i) => (
          <svg key={i} className={`absolute ${pos} opacity-30`} width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M2 2 L20 2 L2 20" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
            <path d="M2 2 L8 2 L2 8" stroke="#D4AF37" strokeWidth="1" fill="none" />
          </svg>
        ))}

        <motion.div
          className="relative z-10 text-center px-6 space-y-6"
        >
          {/* Top label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="cinzel text-[9px] sm:text-[11px] text-amber-400/70 uppercase tracking-[0.5em] outline-none focus:outline-dashed focus:outline-amber-500/50 px-2 rounded-lg"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('greeting', e.currentTarget.textContent || '')}
          >
            {data.greeting || "The Wedding of"}
          </motion.p>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="cinzel text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight py-2 outline-none focus:bg-amber-400/5 px-4 rounded-xl drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]"
            style={{
              background: 'linear-gradient(135deg, #FFE066 0%, #D4AF37 40%, #B8860B 70%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
          >
            {data.names || 'Sarvinoz & Jasur'}
          </motion.h1>

          {/* Gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-3 mx-auto max-w-xs"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/60" />
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#D4AF37" /></svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/60" />
          </motion.div>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="cormorant text-xl sm:text-2xl text-amber-200/80 italic font-light outline-none focus:bg-amber-400/5 px-4 rounded-xl"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
          >
            {data.date || '15 Iyun, 2025'}
          </motion.p>

          {/* Confetti CTA */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={triggerConfetti}
            className="cinzel mt-4 px-8 py-3 text-[11px] tracking-[0.3em] uppercase border border-amber-500/50 text-amber-300 rounded-full hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            ✦ Tabriklayman ✦
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <p className="cinzel text-[8px] tracking-[0.4em] text-amber-600/50 uppercase">Scroll</p>
            <ArrowDown className="w-3.5 h-3.5 text-amber-600/40" />
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="py-20 px-6 text-center relative"
        style={{ background: 'linear-gradient(180deg, #0B132B 0%, #070B19 100%)' }}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3">
            <p className="cinzel text-[9px] tracking-[0.5em] text-amber-500/60 uppercase">To'yga qadar</p>
            <h2
              className="cormorant text-4xl sm:text-5xl italic text-amber-100/90 font-light outline-none focus:bg-amber-400/5 px-4 rounded-xl"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
            >
              {data.names || 'Sarvinoz & Jasur'}
            </h2>
          </div>
          <GoldDivider />
          <CountdownTimer dateStr={data.date || ''} />
        </div>
      </motion.section>

      {/* ── GALLERY ── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="py-20 px-4 relative"
        style={{ background: '#070B19' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Camera className="w-5 h-5 text-amber-500/50 mx-auto" />
            <h2 className="cinzel text-2xl sm:text-3xl text-amber-200/80 tracking-widest">OUR STORY</h2>
            <GoldDivider />
          </div>

          {/* Masonry-style layout using columns */}
          <div className="columns-2 lg:columns-4 gap-3 space-y-3">
            {data.images.map((url, i) => {
              const isEditable = !!onDataChange
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative mb-3 break-inside-avoid rounded-xl overflow-hidden border border-amber-500/10 group ${isEditable ? 'cursor-pointer' : ''}`}
                >
                  {isEditable && (
                    <label className="absolute inset-0 cursor-pointer z-10">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                    </label>
                  )}
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                  />
                  {/* Gold overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {isEditable && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-5 h-5 text-amber-300" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ── EVENT DETAILS ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="py-20 px-6 relative"
        style={{ background: 'linear-gradient(180deg, #070B19 0%, #04060E 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="cinzel text-2xl sm:text-3xl text-amber-200/80 tracking-widest">THE DETAILS</h2>
            <GoldDivider />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                id: 'date', icon: Calendar,
                title: 'Sana',
                desc: data.date || '15 Iyun, 2025',
                sub: 'Marosim soati 18:00',
              },
              {
                id: 'venue', icon: MapPin,
                title: 'Manzil',
                desc: data.venue || 'Grand Palace',
                sub: data.location || 'Toshkent',
              },
              {
                id: 'registry', icon: Gift,
                title: 'Sovg\'a',
                desc: 'Ishtirokingiz',
                sub: 'eng yaxshi sovg\'a',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                className="relative p-8 rounded-3xl text-center group overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, #122044 0%, #070B19 100%)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(212,175,55,0.05)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: '0 0 40px rgba(212,175,55,0.15)', background: 'radial-gradient(circle at top, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />

                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <item.icon className="w-5 h-5 text-amber-500/70" />
                </div>
                <p className="cinzel text-[8px] tracking-[0.35em] text-amber-600/60 uppercase mb-3">{item.title}</p>
                <p
                  className="cormorant text-xl font-semibold text-amber-100/90 leading-tight outline-none focus:bg-amber-400/5 rounded-md px-1"
                  contentEditable={!!onDataChange && item.id !== 'registry'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof InvitationData, e.currentTarget.textContent || '')}
                >
                  {item.desc}
                </p>
                <p
                  className="cormorant text-sm italic text-amber-400/50 mt-1 outline-none focus:bg-amber-400/5 rounded-md px-1"
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

      {/* ── MAP ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 space-y-2">
          <MapPin className="w-5 h-5 text-amber-500/50 mx-auto" />
          <h2 className="cinzel text-xl text-amber-200/70 tracking-widest">MANZIL</h2>
          <p
            className="cormorant text-lg italic text-amber-400/60 outline-none focus:bg-amber-400/5 px-2 rounded-md"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('location', e.currentTarget.textContent || '')}
          >
            {data.location || 'Toshkent'}
          </p>
        </div>
        <MapEmbed location={data.location} mapUrl={data.mapUrl} />
      </motion.section>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2 }}
        className="py-24 text-center space-y-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #122044 0%, #070B19 100%)', }}

      >
        {/* Large decorative text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <p className="cinzel text-[8vw] font-bold text-amber-400/[0.03] whitespace-nowrap select-none">
            FOREVER
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <GoldDivider />
          <h2
            className="cinzel text-3xl sm:text-4xl font-bold outline-none focus:bg-amber-400/5 px-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #FFE066 0%, #D4AF37 50%, #B8860B 100%)',
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
          <p className="cormorant italic text-amber-400/50 text-sm tracking-widest">
            {data.date || '15 Iyun, 2025'} • Forever & Always
          </p>
          <GoldDivider />
        </div>
      </motion.footer>

      {/* ── MUSIC ── */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-xl group hover:scale-110"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #D4AF37, #B8860B)'
                : 'rgba(11,19,43,0.8)',
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: isPlaying
                ? '0 0 30px rgba(212,175,55,0.5)'
                : '0 0 20px rgba(0,0,0,0.4)',
            }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-black animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-amber-400" />
            )}
          </button>
          <audio ref={audioRef} src={data.musicUrl || undefined} loop />
        </div>
      )}
    </div>
  )
}
