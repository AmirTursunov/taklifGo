'use client'

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
}

// ── INK DROP CANVAS ───────────────────────────────────────────
function InkCanvas({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropsRef = useRef<any[]>([])
  const rafRef = useRef<number>(0)

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
      dropsRef.current = dropsRef.current.filter(d => d.alpha > 0.002)

      for (const d of dropsRef.current) {
        // Main ink circle
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r)
        grad.addColorStop(0, `rgba(10,10,10,${d.alpha * 0.9})`)
        grad.addColorStop(0.6, `rgba(20,15,10,${d.alpha * 0.5})`)
        grad.addColorStop(1, `rgba(30,20,10,0)`)
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Ink tendrils
        for (const t of d.tendrils) {
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.bezierCurveTo(
            d.x + t.cx1, d.y + t.cy1,
            d.x + t.cx2, d.y + t.cy2,
            d.x + t.ex, d.y + t.ey
          )
          ctx.strokeStyle = `rgba(10,10,10,${d.alpha * t.w * 0.4})`
          ctx.lineWidth = t.w * d.r * 0.08
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        d.r += d.speed
        d.speed *= 0.97
        d.alpha -= 0.004
        for (const t of d.tendrils) {
          t.ex += t.dvx
          t.ey += t.dvy
          t.dvx *= 0.96
          t.dvy *= 0.96
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Spawn 3 ink drops at random positions
    for (let k = 0; k < 3; k++) {
      setTimeout(() => {
        const x = canvas.width * (0.2 + Math.random() * 0.6)
        const y = canvas.height * (0.1 + Math.random() * 0.8)
        const tendrils = Array.from({ length: 8 + Math.floor(Math.random() * 6) }, () => {
          const angle = Math.random() * Math.PI * 2
          const len = 40 + Math.random() * 80
          return {
            cx1: Math.cos(angle + 0.5) * len * 0.3,
            cy1: Math.sin(angle + 0.5) * len * 0.3,
            cx2: Math.cos(angle) * len * 0.7,
            cy2: Math.sin(angle) * len * 0.7,
            ex: Math.cos(angle) * len,
            ey: Math.sin(angle) * len,
            dvx: (Math.random() - 0.5) * 2,
            dvy: Math.random() * 1.5,
            w: 0.3 + Math.random() * 0.7,
          }
        })
        dropsRef.current.push({
          x, y, r: 2,
          speed: 3 + Math.random() * 4,
          alpha: 0.55 + Math.random() * 0.3,
          tendrils,
        })
      }, k * 180)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
    />
  )
}

// ── FALLING SAKURA ─────────────────────────────────────────────
function SakuraPetal({ delay }: { delay: number }) {
  const startX = Math.random() * 100
  const duration = 8 + Math.random() * 6
  const size = 8 + Math.random() * 10
  const drift = (Math.random() - 0.5) * 30

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${startX}%`, top: '-20px', fontSize: size }}
      initial={{ y: -20, x: 0, rotate: 0, opacity: 0.9 }}
      animate={{
        y: '110vh',
        x: drift,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        opacity: [0.9, 0.8, 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      🌸
    </motion.div>
  )
}

function SakuraField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 18 }).map((_, i) => (
        <SakuraPetal key={i} delay={i * 1.1} />
      ))}
    </div>
  )
}

// ── JAPANESE BRUSH STROKE SVG ──────────────────────────────────
function BrushStroke({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 18" className={`w-full opacity-20 ${className}`} fill="none">
      <path
        d="M0 9 Q30 3 60 9 Q90 15 120 8 Q150 1 180 9 Q210 17 240 8 Q270 2 300 9"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
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
  const [t, setT] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [dateStr])

  if (!t) return (
    <p className="text-xs tracking-widest text-stone-400 uppercase">
      式典は終了しました
    </p>
  )

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-5">
      {[
        { v: t.days, en: 'Days' },
        { v: t.hours, en: 'Hours' },
        { v: t.minutes, en: 'Min' },
        { v: t.seconds, en: 'Sec' },
      ].map((u, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border border-stone-200 relative"
            style={{
              background: 'rgba(250,248,244,0.8)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04), 2px 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {/* Washi paper corner marks */}
            {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((c, j) => (
              <div key={j} className={`absolute ${c} w-1.5 h-1.5 border-stone-300`}
                style={{
                  borderTop: j < 2 ? '1px solid' : 'none',
                  borderBottom: j >= 2 ? '1px solid' : 'none',
                  borderLeft: j % 2 === 0 ? '1px solid' : 'none',
                  borderRight: j % 2 === 1 ? '1px solid' : 'none',
                }}
              />
            ))}
            <span
              className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums"
            >
              {String(u.v).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[8px] tracking-widest text-stone-400 uppercase">{u.en}</span>
        </div>
      ))}
    </div>
  )
}

// ── MAP EMBED ──────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const query = encodeURIComponent(location || 'Tashkent, Uzbekistan')
  const src = mapUrl || `https://maps.google.com/maps?q=${query}&output=embed&z=15`
  return (
    <div className="w-full h-64 sm:h-80 overflow-hidden border border-stone-200"
      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.06)' }}>
      <iframe
        src={src} width="100%" height="100%"
        style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(1.05)' }}
        allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Wedding location"
      />
    </div>
  )
}


// ── MAIN TEMPLATE ──────────────────────────────────────────────
export function ZenGardenTemplate({
  data,
  onDataChange,
}: {
  data: InvitationData
  onDataChange?: (d: Partial<InvitationData>) => void
}) {
  const { t } = useLanguage()
  const [inkTrigger, setInkTrigger] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

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
        ? audioRef.current.play().catch(() => {})
        : audioRef.current.pause()
    }
  }, [isPlaying, data.musicUrl])

  // Reveal hero after short delay
  useEffect(() => {
    const id = setTimeout(() => setHeroReady(true), 300)
    return () => clearTimeout(id)
  }, [])

  const triggerInk = () => setInkTrigger(n => n + 1)

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden"
      style={{
        background: '#faf8f4',
        color: '#1a1a1a',
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&family=IM+Fell+DW+Pica:ital@0;1&display=swap');
        .shippori { font-family: 'Shippori Mincho', serif; }
        .imfell { font-family: 'IM Fell DW Pica', serif; }

        /* Washi paper texture */
        body { }
        .washi {
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
        }

        /* Ink reveal keyframe */
        @keyframes inkReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; }
          to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
        .ink-reveal {
          animation: inkReveal 1.2s cubic-bezier(0.77,0,0.175,1) forwards;
        }
      `}</style>

      <InkCanvas trigger={inkTrigger} />
      <SakuraField />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden washi"
        style={{ background: '#faf8f4' }}
      >
        {/* Sumi-e ink wash background strokes */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <path d="M-50 200 Q200 180 400 210 Q600 240 850 195" stroke="#1a1a1a" strokeWidth="80" fill="none" strokeLinecap="round" />
          <path d="M-50 420 Q150 400 350 430 Q550 460 850 410" stroke="#1a1a1a" strokeWidth="50" fill="none" strokeLinecap="round" />
        </svg>


        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 text-center px-8 space-y-8 max-w-3xl mx-auto"
        >
          {/* Top small label */}
          <AnimatePresence>
            {heroReady && (
              <motion.p
                className="text-[9px] sm:text-[10px] tracking-[0.6em] text-stone-400 uppercase ink-reveal"
                style={{ animationDelay: '0.2s' }}
              >
                Wedding Invitation
              </motion.p>
            )}
          </AnimatePresence>

          {/* Main names */}
          {heroReady && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 0.6 }}
              className="relative"
            >
              <span
                className="shippori block text-5xl sm:text-7xl lg:text-8xl font-bold leading-none text-stone-900 ink-reveal outline-none focus:bg-stone-100/50 px-4 rounded-xl"
                style={{ animationDelay: '0.6s', letterSpacing: '-0.02em' }}
                contentEditable={!!onDataChange}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
              >
                {data.names || 'Sarvinoz & Jasur'}
              </span>
            </motion.h1>
          )}

          {/* Brush stroke divider */}
          {heroReady && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="origin-left"
            >
              <BrushStroke />
            </motion.div>
          )}

          {/* Date */}
          {heroReady && (
            <motion.p
              className="imfell italic text-xl sm:text-2xl text-stone-500 ink-reveal outline-none focus:bg-stone-100/50 px-4 rounded-xl"
              style={{ animationDelay: '1s' }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
            >
              {data.date || '15 Iyun, 2025'}
            </motion.p>
          )}

          {/* Ink drop CTA + hanko seal */}
          <div className="flex items-center justify-center gap-6">
            {heroReady && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={triggerInk}
                className="group relative noto text-[10px] tracking-[0.4em] uppercase text-stone-600 px-8 py-3 border border-stone-300 hover:border-stone-800 transition-all duration-500 overflow-hidden"
                style={{ background: 'rgba(250,248,244,0.9)' }}
              >
                <span className="absolute inset-0 bg-stone-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]" />
                <span className="relative z-10 group-hover:text-stone-100 transition-colors duration-300">
                  Siyoh tomizish
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-stone-300" />
          </motion.div>
          <p className="text-[7px] tracking-[0.5em] text-stone-300 uppercase">Scroll Down</p>
        </div>
      </section>

      {/* ── WELCOME ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 px-6 text-center relative washi"
        style={{ background: '#f5f3ef' }}
      >

        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-[9px] tracking-[0.5em] text-stone-400 uppercase">Invitation</p>
            <BrushStroke />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="shippori text-3xl sm:text-5xl font-bold text-stone-800 leading-relaxed outline-none focus:bg-stone-100/50 px-4 rounded-xl"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
          >
            {data.names || 'Sarvinoz & Jasur'}
          </motion.h2>

          <p className="imfell italic text-stone-500 text-lg leading-relaxed max-w-md mx-auto">
            "Ikki qalb, bir taqdirda birлашади — siz bilan bu lahzani ulashishni xohlaymiz."
          </p>

          <BrushStroke />

          {/* Countdown */}
          <CountdownTimer dateStr={data.date || ''} />
        </div>
      </motion.section>

      {/* ── GALLERY ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 washi"
        style={{ background: '#faf8f4' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[8px] tracking-[0.6em] text-stone-400 uppercase">GALLERY</p>
            <h2 className="shippori text-2xl sm:text-3xl text-stone-700">Our Album</h2>
            <BrushStroke className="max-w-xs mx-auto" />
          </div>

          {/* Polaroid-style asymmetric grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.images.map((url, i) => {
              const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 1]
              const rot = rotations[i % rotations.length]
              const isEditable = !!onDataChange

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot }}
                  whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="relative group"
                  style={{ transformOrigin: 'center' }}
                >
                  {/* Polaroid frame */}
                  <div
                    className="bg-white p-2 pb-8 shadow-[2px_4px_16px_rgba(0,0,0,0.12)] relative"
                    style={{ boxShadow: `${rot > 0 ? 3 : -3}px 4px 16px rgba(0,0,0,0.12)` }}
                  >
                    {isEditable && (
                      <label className="absolute inset-0 cursor-pointer z-10">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                      </label>
                    )}
                    <div className="aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                      />
                    </div>
                    {/* Polaroid bottom text */}
                    <div className="absolute bottom-1.5 left-0 right-0 text-center">
                      <span
                        className="text-[8px] text-stone-300"
                      >
                        {'★'.repeat(3)}
                      </span>
                    </div>

                    {/* Edit overlay */}
                    {isEditable && (
                      <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <Camera className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ── DETAILS ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 washi"
        style={{ background: '#f0ede7' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[8px] tracking-[0.6em] text-stone-400 uppercase">DETAILS</p>
            <h2 className="shippori text-2xl sm:text-3xl text-stone-700">The Details</h2>
            <BrushStroke className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: 'date', icon: Calendar, en: 'Date', desc: data.date || '15 Iyun, 2025', sub: 'Soat 18:00' },
              { id: 'venue', icon: MapPin, en: 'Venue', desc: data.venue || 'Grand Hall', sub: data.location || 'Toshkent' },
              { id: 'registry', icon: Gift, en: 'Gift', desc: 'Ishtirokingiz', sub: "eng yaxshi sovg'a" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="relative p-8 text-center group"
                style={{
                  background: 'rgba(250,248,244,0.8)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.04)',
                }}
              >
                {/* Corner marks */}
                {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((c, j) => (
                  <div key={j} className={`absolute ${c} w-2 h-2`}
                    style={{
                      borderTop: j < 2 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                      borderBottom: j >= 2 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                      borderLeft: j % 2 === 0 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                      borderRight: j % 2 === 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                    }}
                  />
                ))}

                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 border border-stone-200">
                  <item.icon className="w-4 h-4 text-stone-500" />
                </div>
                <p className="text-[8px] tracking-[0.4em] text-stone-400 uppercase mb-3">DETAILS</p>
                <p
                  className="shippori text-lg font-bold text-stone-800 leading-tight outline-none focus:bg-stone-100/50 rounded-md px-1"
                  contentEditable={!!onDataChange && item.id !== 'registry'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof InvitationData, e.currentTarget.textContent || '')}
                >
                  {item.desc}
                </p>
                <p
                  className="imfell italic text-sm text-stone-400 mt-1 outline-none focus:bg-stone-100/50 rounded-md px-1"
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
          <p className="text-[8px] tracking-[0.6em] text-stone-400 uppercase">LOCATION</p>
          <h2 className="shippori text-xl text-stone-600">
            {data.venue || 'Grand Hall'}
          </h2>
          <p
            className="imfell italic text-stone-400 text-sm outline-none focus:bg-stone-100/50 px-2 rounded-md"
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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-28 text-center space-y-8 relative washi overflow-hidden"
        style={{ background: '#faf8f4' }}
      >

        <div className="relative z-10 space-y-6">
          <BrushStroke className="max-w-sm mx-auto" />
          <div className="flex items-center justify-center gap-6">
            <div className="space-y-2 text-center">
              <h2
                className="shippori text-3xl sm:text-4xl font-bold text-stone-800 outline-none focus:bg-stone-100/50 px-4 rounded-xl"
                contentEditable={!!onDataChange}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
              >
                {data.names || 'Sarvinoz & Jasur'}
              </h2>
              <p
                className="imfell italic text-stone-400 text-sm tracking-widest"
              >
                {data.date || '15 Iyun, 2025'}
              </p>
            </div>
          </div>
          <BrushStroke className="max-w-sm mx-auto" />
          <p className="text-[8px] tracking-[0.5em] text-stone-300 uppercase">
            Best wishes
          </p>
        </div>
      </motion.footer>

      {/* ── MUSIC ── */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 flex items-center justify-center transition-all duration-500"
            style={{
              background: isPlaying ? '#1a1a1a' : 'rgba(250,248,244,0.95)',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: '2px 2px 12px rgba(0,0,0,0.1)',
            }}
          >
            {isPlaying
              ? <Volume2 className="w-5 h-5 text-stone-100 animate-pulse" />
              : <VolumeX className="w-5 h-5 text-stone-500" />
            }
          </motion.button>
          <audio ref={audioRef} src={data.musicUrl || ''} loop />
        </div>
      )}
    </div>
  )
}
