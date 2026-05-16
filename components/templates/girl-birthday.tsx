'use client'

import { Calendar, MapPin, Camera, ArrowDown, Volume2, VolumeX, Heart, Sparkles, Star, Gift } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface BirthdayData {
  name: string
  age: string
  date: string
  time: string
  location: string
  venue: string
  images: string[]
  musicUrl?: string
  message?: string
  mapUrl?: string
  dressCode?: string
}

// ── CONFETTI + BALLOON CANVAS ─────────────────────────────────
function PartyCanvas({ burst }: { burst: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const balloonsRef  = useRef<any[]>([])
  const rafRef = useRef<number>(0)

  const COLORS = [
    '#FF6FB4','#FF85C8','#FFB3DC',   // pinks
    '#C77DFF','#B57BEE','#DDB6FF',   // lavenders
    '#FFD700','#FFE566','#FFC200',   // golds
    '#FF9EC4','#F9A8D4','#ffffff',   // light
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw confetti
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02)
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.99
        p.rotation += p.spin; p.alpha -= 0.006
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        if (p.type === 'heart') {
          ctx.font = `${p.size}px serif`
          ctx.fillText('♥', -p.size/2, p.size/2)
        } else if (p.type === 'star') {
          ctx.font = `${p.size}px serif`
          ctx.fillText('★', -p.size/2, p.size/2)
        } else if (p.type === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill()
        } else {
          ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2)
        }
        ctx.restore()
      }

      // Draw balloons floating up
      balloonsRef.current = balloonsRef.current.filter(b => b.y > -120)
      for (const b of balloonsRef.current) {
        b.y -= b.speed; b.x += Math.sin(b.y * 0.02) * 0.5
        ctx.save()
        ctx.globalAlpha = b.alpha
        ctx.translate(b.x, b.y)
        // Balloon body
        const grad = ctx.createRadialGradient(-b.r*0.3, -b.r*0.3, b.r*0.05, 0, 0, b.r)
        grad.addColorStop(0, 'rgba(255,255,255,0.6)')
        grad.addColorStop(0.4, b.color + 'cc')
        grad.addColorStop(1, b.color + '99')
        ctx.beginPath()
        ctx.ellipse(0, 0, b.r * 0.82, b.r, 0, 0, Math.PI*2)
        ctx.fillStyle = grad
        ctx.fill()
        // Shine
        ctx.beginPath()
        ctx.ellipse(-b.r*0.25, -b.r*0.3, b.r*0.18, b.r*0.12, -0.5, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.fill()
        // Knot
        ctx.beginPath()
        ctx.arc(0, b.r, 3, 0, Math.PI*2)
        ctx.fillStyle = b.color
        ctx.fill()
        // String
        ctx.beginPath()
        ctx.moveTo(0, b.r + 3)
        for (let i = 0; i < 40; i++) {
          ctx.lineTo(Math.sin(i * 0.4) * 3, b.r + 3 + i * 2)
        }
        ctx.strokeStyle = 'rgba(180,180,180,0.4)'
        ctx.lineWidth = 0.8; ctx.stroke()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  // Continuous balloons
  useEffect(() => {
    const balloonColors = ['#FF6FB4','#C77DFF','#FFD700','#FF9EC4','#B57BEE','#FFB3DC']
    const spawnBalloon = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      balloonsRef.current.push({
        x: 60 + Math.random() * (canvas.width - 120),
        y: canvas.height + 60,
        r: 22 + Math.random()*16,
        speed: 0.8 + Math.random()*0.7,
        color: balloonColors[Math.floor(Math.random()*balloonColors.length)],
        alpha: 0.7 + Math.random()*0.2,
      })
    }

    // Initial batch
    for(let i=0; i<6; i++) setTimeout(spawnBalloon, i * 800)
    
    const id = setInterval(spawnBalloon, 2500)
    return () => clearInterval(id)
  }, [])

  // Burst effect (Confetti + Extra Balloons)
  useEffect(() => {
    if (!burst) return
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width / 2, cy = canvas.height * 0.4
    const types = ['heart','star','circle','rect']

    // Confetti burst
    for (let i = 0; i < 220; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 5 + Math.random() * 14
      particlesRef.current.push({
        x: cx + (Math.random()-0.5)*80,
        y: cy,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed - Math.random()*6,
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        size: 6 + Math.random()*10,
        type: types[Math.floor(Math.random()*types.length)],
        rotation: Math.random()*Math.PI*2,
        spin: (Math.random()-0.5)*0.3,
        alpha: 1,
      })
    }

    // Extra Balloons on burst
    const balloonColors = ['#FF6FB4','#C77DFF','#FFD700','#FF9EC4','#B57BEE','#FFB3DC']
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const c = canvasRef.current
        if (!c) return
        balloonsRef.current.push({
          x: 60 + Math.random() * (c.width - 120),
          y: c.height + 60,
          r: 22 + Math.random()*16,
          speed: 1.2 + Math.random()*0.8,
          color: balloonColors[Math.floor(Math.random()*balloonColors.length)],
          alpha: 0.85 + Math.random()*0.15,
        })
      }, i * 150)
    }
  }, [burst])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[200] pointer-events-none" />
}

// ── FLOATING BG HEARTS ────────────────────────────────────────
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200 select-none"
          style={{
            left: `${(i * 38 + 5) % 95}%`,
            fontSize: `${10 + (i % 4) * 5}px`,
            opacity: 0.3 + (i % 3) * 0.1,
          }}
          initial={{ y: '110vh' }}
          animate={{ y: '-10vh' }}
          transition={{
            duration: 10 + (i % 5) * 2,
            repeat: Infinity,
            delay: i * 1.1,
            ease: 'linear',
          }}
        >
          {i % 3 === 0 ? '♥' : i % 3 === 1 ? '✦' : '✿'}
        </motion.div>
      ))}
    </div>
  )
}

function CleanAge({ age, onEdit }: { age: string, onEdit?: (val: string) => void }) {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative flex items-center justify-center px-10 py-4"
        style={{
          borderTop: '1px solid rgba(255,111,180,0.15)',
          borderBottom: '1px solid rgba(255,111,180,0.15)',
        }}
      >
        <span 
          className="lilita text-[5.5rem] sm:text-[7rem] leading-none outline-none focus:bg-pink-50 rounded-lg px-2"
          contentEditable={!!onEdit}
          suppressContentEditableWarning
          onBlur={(e) => onEdit?.(e.currentTarget.textContent || '')}
          style={{
            background: 'linear-gradient(135deg, #FF6FB4 0%, #C77DFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
            fontWeight: 800,
          }}>
          {age || '21'}
        </span>
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 text-[9px] tracking-[0.3em] uppercase font-bold text-pink-300 whitespace-nowrap">
          {t.turningAge}
        </div>
      </motion.div>
    </div>
  )
}

// ── COUNTDOWN ─────────────────────────────────────────────────
function CountdownTimer({ dateStr }: { dateStr: string }) {
  const { t } = useLanguage()
  const getTimeLeft = () => {
    const diff = new Date(dateStr).getTime() - Date.now()
    if (isNaN(diff) || diff <= 0) return null
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [tl, setTl] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [dateStr])

  if (!tl) return (
    <motion.p
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ fontFamily: "'Pacifico', cursive", color: '#FF3D9A', fontSize: '1.3rem' }}
    >
      🎂 {t.happyMoments}! 🎉
    </motion.p>
  )

  const units = [
    { v: tl.days, l: t.days, emoji: '📅' },
    { v: tl.hours, l: t.hours, emoji: '⏰' },
    { v: tl.minutes, l: t.minutes, emoji: '⏱' },
    { v: tl.seconds, l: t.seconds, emoji: '✨' },
  ]

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <motion.div
            key={u.v}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #fdf0f8 100%)',
              border: '2px solid',
              borderColor: i % 2 === 0 ? '#FFB3DC' : '#DDB6FF',
              borderRadius: '16px',
              boxShadow: `0 4px 20px ${i % 2 === 0 ? 'rgba(255,111,180,0.15)' : 'rgba(199,125,255,0.15)'}`,
            }}
          >
            <span style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: '1.7rem',
              color: i % 2 === 0 ? '#FF3D9A' : '#9B4DCA',
              lineHeight: 1,
            }}>
              {String(u.v).padStart(2, '0')}
            </span>
          </motion.div>
          <span className="text-[9px] uppercase tracking-widest font-bold"
            style={{ color: i % 2 === 0 ? '#FF6FB4' : '#C77DFF' }}>
            {u.emoji} {u.l}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── MAP ───────────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const src = mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(location || 'Tashkent')}&output=embed&z=15`
  return (
    <div className="w-full h-64 overflow-hidden"
      style={{
        border: '3px solid #FFB3DC',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(255,111,180,0.15)',
      }}>
      <iframe src={src} width="100%" height="100%"
        style={{ border: 0 }}
        allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" title="Manzil" />
    </div>
  )
}

// ── SQUIGGLY DIVIDER ──────────────────────────────────────────
function SquigglyDivider({ color1 = '#FF6FB4', color2 = '#C77DFF', className = "" }: { color1?: string; color2?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 py-1 ${className}`}>
      <svg viewBox="0 0 200 12" className="flex-1 h-3">
        <defs>
          <linearGradient id={`sq${color1}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <path d="M0 6 Q10 2 20 6 Q30 10 40 6 Q50 2 60 6 Q70 10 80 6 Q90 2 100 6 Q110 10 120 6 Q130 2 140 6 Q150 10 160 6 Q170 2 180 6 Q190 10 200 6"
          stroke={`url(#sq${color1})`} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '14px' }}>🌸</span>
      <svg viewBox="0 0 200 12" className="flex-1 h-3" style={{ transform: 'scaleX(-1)' }}>
        <defs>
          <linearGradient id={`sq2${color2}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor={color2} />
            <stop offset="100%" stopColor={color1} />
          </linearGradient>
        </defs>
        <path d="M0 6 Q10 2 20 6 Q30 10 40 6 Q50 2 60 6 Q70 10 80 6 Q90 2 100 6 Q110 10 120 6 Q130 2 140 6 Q150 10 160 6 Q170 2 180 6 Q190 10 200 6"
          stroke={`url(#sq2${color2})`} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────
export function GirlBirthdayTemplate({
  data,
  onDataChange,
}: {
  data: BirthdayData
  onDataChange?: (d: Partial<BirthdayData>) => void
}) {
  const { t, lang } = useLanguage()
  const [burst, setBurst] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleEdit = (field: keyof BirthdayData, value: string) => {
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

  const triggerParty = () => setBurst(n => n + 1)

  return (
    <div className="w-full min-h-screen overflow-x-hidden"
      style={{
        background: '#fff5fb',
        color: '#2a1a2e',
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,700&display=swap');
        .lilita   { font-family: 'Lilita One', cursive; }
        .pacifico { font-family: 'Pacifico', cursive; }
        .playfair { font-family: 'Playfair Display', serif; }
        .nunito   { font-family: 'Nunito', sans-serif; }

        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .grad-animate {
          background-size: 200% 200%;
          animation: gradientMove 4s ease infinite;
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .wiggle-anim { animation: wiggle 2s ease-in-out infinite; }
        
        /* Disable editing styles when read-only */
        ${!onDataChange ? `
          [contenteditable="false"] {
            outline: none !important;
            cursor: default !important;
          }
          .focus\\:outline-dashed:focus {
            outline: none !important;
          }
        ` : ''}
      `}</style>

      <PartyCanvas burst={burst} />
      <FloatingHearts />

      {/* ══ HERO ══════════════════════════════════════ */}
      <section ref={heroRef}
        className="relative w-full min-h-full flex flex-col items-center justify-center overflow-hidden py-16 px-6"
        style={{
          background: 'linear-gradient(160deg, #fff0f8 0%, #f8f0ff 40%, #fff5fb 70%, #fffbec 100%)',
        }}>

        {/* Minimal mesh blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at 20% 30%, rgba(255,111,180,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(199,125,255,0.08) 0%, transparent 50%)',
          }} />

          {/* Subtle Invite Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-1 py-1"
          >
            <div className="h-[1px] w-8 bg-pink-300" />
            <span className="nunito text-pink-400 font-bold text-[10px] tracking-[0.4em] uppercase">
              {t.youAreInvited}
            </span>
            <div className="h-[1px] w-8 bg-pink-300" />
          </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-2xl mx-auto w-full space-y-6">

          {/* Main name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="playfair float-anim outline-none focus:outline-dashed focus:outline-pink-400 px-4 rounded-2xl"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 7.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#FF3D9A', // Fallback color
                background: 'linear-gradient(135deg, #FF3D9A 0%, #C77DFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
                display: 'block',
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('name', e.currentTarget.textContent || '')}
            >
              {data.name || 'Nilufar'}
            </h1>
          </motion.div>

          {/* ning */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="nunito font-semibold text-base sm:text-lg"
            style={{ color: '#C77DFF' }}
          >
            {lang === 'uz' ? 'ning' : ''}
          </motion.p>

          {/* Typographic Age */}
          <CleanAge 
            age={data.age || '21'} 
            onEdit={onDataChange ? (val) => handleEdit('age', val) : undefined} 
          />

          {/* yoshlik bayrami */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-1"
          >
            <p className="nunito font-bold text-[10px] tracking-[0.5em] uppercase"
              style={{ color: '#FF6FB4' }}>
              {t.birthdayOf}
            </p>
          </motion.div>

          <SquigglyDivider />

          {/* Date + venue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 flex-wrap"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full nunito font-semibold text-sm"
              style={{ background: 'rgba(255,111,180,0.12)', color: '#FF3D9A', border: '1.5px solid #FFB3DC' }}>
              <Calendar className="w-4 h-4" />
              <span
                contentEditable={!!onDataChange}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
                className="outline-none"
              >
                {data.date || '15 Iyun, 2025'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full nunito font-semibold text-sm"
              style={{ background: 'rgba(199,125,255,0.12)', color: '#9B4DCA', border: '1.5px solid #DDB6FF' }}>
              <MapPin className="w-4 h-4" />
              <span
                contentEditable={!!onDataChange}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('venue', e.currentTarget.textContent || '')}
                className="outline-none"
              >
                {data.venue || 'Dream Hall'} · {data.location || 'Toshkent'}
              </span>
            </div>
          </motion.div>

          {/* Party button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
          >
            <motion.button
              whileHover={{ scale: 1.07, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerParty}
              className="relative px-10 py-4 nunito font-extrabold text-white text-base tracking-wide uppercase"
              style={{
                background: 'linear-gradient(135deg, #FF3D9A 0%, #C77DFF 50%, #FFD700 100%)',
                borderRadius: '100px',
                boxShadow: '0 8px 32px rgba(255,61,154,0.4), 0 4px 16px rgba(199,125,255,0.3)',
                border: '3px solid rgba(255,255,255,0.5)',
              }}
            >
              🎊 Party Boshlash! 🎈
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 flex flex-col items-center gap-1 z-10">
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5" style={{ color: '#FFB3DC' }} />
          </motion.div>
        </div>
      </section>

      {/* ══ MESSAGE ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff5fb 0%, #f8f0ff 100%)' }}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <SquigglyDivider />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-5xl mx-auto w-fit"
          >
            💌
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="nunito text-lg sm:text-xl leading-relaxed font-medium outline-none focus:outline-dashed focus:outline-pink-400 px-4 rounded-2xl"
            style={{ color: '#7a4a8a', fontStyle: 'italic' }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('message', e.currentTarget.textContent || '')}
          >
            {data.message || (lang === 'uz' ? '"Hayotimning eng go\'zal onlarini siz — mening eng aziz odamlarim — bilan birga nishonlamoqchiman. Bu kecha unutilmas bo\'ladi, so\'z beraman! 🌸"' : lang === 'ru' ? '"Я хочу отпраздновать самые прекрасные моменты своей жизни вместе с вами — моими самыми дорогими людьми. Эта ночь будет незабываемой, обещаю! 🌸"' : '"I want to celebrate the most beautiful moments of my life together with you — my dearest people. This night will be unforgettable, I promise! 🌸"')}
          </motion.p>
          <SquigglyDivider color1="#C77DFF" color2="#FFD700" />

          {/* Countdown */}
          <div className="space-y-4">
            <p className="nunito font-bold text-sm uppercase tracking-widest" style={{ color: '#FF6FB4' }}>
              ⏳ {lang === 'uz' ? 'Bayramga qadar' : lang === 'ru' ? 'До праздника' : 'Until the party'}
            </p>
            <CountdownTimer dateStr={data.date || ''} />
          </div>
        </div>
      </motion.section>

      {/* ══ GALLERY ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4"
        style={{ background: '#fff5fb' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mx-auto w-fit"
            >
              📸
            </motion.div>
            <h2 className="pacifico text-3xl sm:text-4xl"
              style={{
                background: 'linear-gradient(135deg, #FF3D9A, #C77DFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {t.happyMoments}
            </h2>
            <SquigglyDivider className="max-w-xs mx-auto" />
          </div>

          {/* Scattered polaroid grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.images.map((url, i) => {
              const rots = [-3, 2, -1.5, 3, -2.5, 1.5, -3.5, 2.5]
              const rot = rots[i % rots.length]
              const isEditable = !!onDataChange
              const borderColors = ['#FFB3DC','#DDB6FF','#FFD700','#FF9EC4','#C77DFF','#FFB3DC','#DDB6FF','#FFD700']

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot }}
                  whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className="group relative"
                  style={{ transformOrigin: 'center center' }}
                >
                  {/* Polaroid */}
                  <div className="bg-white p-2 pb-8"
                    style={{
                      boxShadow: `0 4px 24px rgba(255,111,180,0.2), 0 2px 8px rgba(0,0,0,0.08)`,
                      border: `2px solid ${borderColors[i % borderColors.length]}`,
                      borderRadius: '8px',
                    }}>
                    {isEditable && (
                      <label className="absolute inset-0 cursor-pointer z-10 rounded-lg">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                      </label>
                    )}
                    <div className="aspect-square overflow-hidden rounded-sm">
                      <img src={url} alt={`Rasm ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    {/* Polaroid footer */}
                    <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
                      {['♥','✦','♥'].map((s, j) => (
                        <span key={j} style={{ fontSize: '8px', color: borderColors[i % borderColors.length], opacity: 0.7 }}>{s}</span>
                      ))}
                    </div>
                    {isEditable && (
                      <div className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        style={{ background: 'rgba(255,61,154,0.2)' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid #FF6FB4' }}>
                          <Camera className="w-5 h-5" style={{ color: '#FF3D9A' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ══ DETAILS ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
        style={{ background: 'linear-gradient(160deg, #f8f0ff 0%, #fff5fb 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="nunito font-bold text-sm uppercase tracking-widest" style={{ color: '#C77DFF' }}>
              🗓 {lang === 'uz' ? 'Tadbir Tafsilotlari' : lang === 'ru' ? 'Детали Мероприятия' : 'Event Details'}
            </p>
            <h2 className="pacifico text-3xl" style={{ color: '#FF3D9A' }}>{lang === 'uz' ? 'Keling, birga bo\'laylik!' : lang === 'ru' ? 'Приходите, будем вместе!' : 'Come, let\'s be together!'}</h2>
            <SquigglyDivider />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { emoji: '🗓', id: 'date', title: t.dateTime, desc: data.date || '15 Iyun, 2025', sub: data.time || 'Soat 19:00', border: '#FFB3DC', bg: '#fff8fc' },
              { emoji: '📍', id: 'venue', title: t.address, desc: data.venue || 'Dream Hall', sub: data.location || 'Toshkent', border: '#DDB6FF', bg: '#fdf8ff' },
              { emoji: '👗', id: 'dressCode', title: lang === 'uz' ? 'Kiyim' : lang === 'ru' ? 'Дресс-код' : 'Dress-code', desc: data.dressCode || 'Cocktail Dress', sub: lang === 'uz' ? 'Chiroyli keling!' : lang === 'ru' ? 'Будьте красивыми!' : 'Dress to impress!', border: '#FFE566', bg: '#fffdf0' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                whileHover={{ y: -6, rotate: idx % 2 === 0 ? -1 : 1 }}
                className="p-8 text-center transition-all duration-300"
                style={{
                  background: item.bg,
                  border: `2.5px solid ${item.border}`,
                  borderRadius: '24px',
                  boxShadow: `0 4px 24px ${item.border}33`,
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5 + idx, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  {item.emoji}
                </motion.div>
                <p className="nunito text-[9px] uppercase tracking-widest font-bold mb-2"
                  style={{ color: item.border }}>
                  {item.title}
                </p>
                <p
                  className="nunito font-extrabold text-lg leading-tight mb-1 outline-none focus:outline-dashed rounded-md px-1"
                  style={{ color: '#2a1a2e', outlineColor: item.border }}
                  contentEditable={!!onDataChange && item.id !== 'dressCode'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof BirthdayData, e.currentTarget.textContent || '')}
                >
                  {item.desc}
                </p>
                <p className="nunito text-sm font-medium" style={{ color: '#9a7aaa' }}>{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══ MAP ═══════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-6 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 space-y-2">
          <span className="text-3xl">📍</span>
          <h2 className="pacifico text-2xl" style={{ color: '#FF3D9A' }}>{data.venue || 'Dream Hall'}</h2>
          <p className="nunito font-medium" style={{ color: '#C77DFF' }}>{data.location || 'Toshkent'}</p>
        </div>
        <MapEmbed location={data.location} mapUrl={data.mapUrl} />
      </motion.section>

      {/* ══ FOOTER ════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF6FB4 0%, #C77DFF 40%, #FF3D9A 70%, #FFD700 100%)',
        }}
      >
        {/* Glitter overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div key={i}
              className="absolute text-white/30 select-none"
              style={{
                left: `${(i * 67 + 3) % 98}%`,
                top: `${(i * 43 + 5) % 95}%`,
                fontSize: `${8 + (i % 3) * 4}px`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5 + i % 3, repeat: Infinity, delay: i * 0.15 }}
            >
              {i % 4 === 0 ? '✦' : i % 4 === 1 ? '★' : i % 4 === 2 ? '♥' : '✿'}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 space-y-6 px-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-5xl mx-auto w-fit"
          >
            🎂
          </motion.div>
          <h2 
            className="playfair text-3xl sm:text-5xl text-white outline-none focus:bg-white/10 rounded-lg px-4"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('name', e.currentTarget.textContent || '')}
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.2)', fontWeight: 800 }}
          >
            {data.name || 'Nilufar'}
          </h2>
          <p className="nunito font-bold text-white/80 text-lg tracking-widest">
            <span
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('age', e.currentTarget.textContent || '')}
              className="outline-none"
            >
              {data.age || '21'}
            </span> {t.turningAge} · <span
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
              className="outline-none"
            >
              {data.date || '15 Iyun, 2025'}
            </span>
          </p>
          <div className="flex items-center justify-center gap-3 text-2xl">
            {['🎀','🎈','🌸','🎉','💜','🎊','🌷','💛','🎀'].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}>
                {e}
              </motion.span>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerParty}
            className="mx-auto block px-10 py-3.5 nunito font-extrabold text-base uppercase tracking-wider"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '100px',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            🎊 {lang === 'uz' ? 'Yana Confetti!' : lang === 'ru' ? 'Еще Конфетти!' : 'More Confetti!'} 🎊
          </motion.button>
        </div>
      </motion.footer>

      {/* MUSIC */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 flex items-center justify-center"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #FF3D9A, #C77DFF)'
                : 'rgba(255,255,255,0.95)',
              border: '2.5px solid #FFB3DC',
              borderRadius: '50%',
              boxShadow: isPlaying
                ? '0 0 28px rgba(255,61,154,0.5)'
                : '0 4px 16px rgba(255,111,180,0.2)',
            }}
          >
            {isPlaying
              ? <Volume2 className="w-5 h-5 text-white animate-pulse" />
              : <VolumeX className="w-5 h-5" style={{ color: '#FF3D9A' }} />}
          </motion.button>
          <audio ref={audioRef} src={data.musicUrl || ''} loop />
        </div>
      )}
    </div>
  )
}
