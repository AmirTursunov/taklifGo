'use client'

import { Calendar, MapPin, Clock, Users, ArrowDown, Volume2, VolumeX, Globe, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BusinessEventData {
  companyName: string
  eventTitle: string
  eventType: string
  date: string
  time: string
  location: string
  venue: string
  description: string
  speakers?: { name: string; role: string }[]
  agenda?: { time: string; title: string }[]
  logoUrl?: string
  images: string[]
  musicUrl?: string
  mapUrl?: string
  website?: string
  capacity?: string
  registrationUrl?: string
}

// ── GRID PATTERN ───────────────────────────────────────────────
function GridPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.035 }}>
      <defs>
        <pattern id="bgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 L0 40" stroke="#0a4a8f" strokeWidth="0.8" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgrid)" />
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
  const [tl, setTl] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [dateStr])

  if (!tl) return <p className="text-blue-600 tracking-widest text-sm font-semibold uppercase">Tadbir boshlandi!</p>

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {[{ v: tl.days, l: 'Days' }, { v: tl.hours, l: 'Hours' }, { v: tl.minutes, l: 'Min' }, { v: tl.seconds, l: 'Sec' }].map((u, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <motion.div
            key={u.v}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative"
            style={{
              background: '#f0f5ff',
              border: '1.5px solid #c2d4f0',
              boxShadow: '0 2px 12px rgba(10,74,143,0.08)',
            }}
          >
            <span className="text-2xl sm:text-3xl font-black tabular-nums"
              style={{ color: '#0a3a7a', fontFamily: "'Inter', sans-serif", fontFeatureSettings: "'tnum'" }}>
              {String(u.v).padStart(2, '0')}
            </span>
          </motion.div>
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#7a9ac5' }}>{u.l}</span>
        </div>
      ))}
    </div>
  )
}

// ── MAP ───────────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const src = mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(location || 'Tashkent')}&output=embed&z=15`
  return (
    <div className="w-full h-56 sm:h-64 overflow-hidden"
      style={{ border: '1.5px solid #c2d4f0', boxShadow: '0 4px 20px rgba(10,74,143,0.07)' }}>
      <iframe src={src} width="100%" height="100%"
        style={{ border: 0, filter: 'grayscale(0.2) contrast(1.05)' }}
        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Manzil" />
    </div>
  )
}

// ── BLUE DIVIDER ──────────────────────────────────────────────
function BlueDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #c2d4f0)' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0a4a8f' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #c2d4f0)' }} />
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────
export function CorporateEventTemplate({
  data,
  onDataChange,
}: {
  data: BusinessEventData
  onDataChange?: (d: Partial<BusinessEventData>) => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  const handleEdit = (field: keyof BusinessEventData, value: string) => {
    if (onDataChange) onDataChange({ [field]: value })
  }

  const handleRegistrationClick = () => {
    if (!data.registrationUrl) return
    let url = data.registrationUrl.trim()
    if (url.startsWith('@')) {
      url = `https://t.me/${url.substring(1)}`
    } else if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`
    }
    window.open(url, '_blank')
  }

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause()
    }
  }, [isPlaying, data.musicUrl])

  const defaultAgenda = [
    { time: '09:00', title: 'Ro\'yxatdan o\'tish va qabul' },
    { time: '10:00', title: 'Ochilish marosimi' },
    { time: '11:00', title: 'Asosiy ma\'ruza' },
    { time: '13:00', title: 'Tushlik tanaffus' },
    { time: '14:00', title: 'Panel muhokamasi' },
    { time: '16:00', title: 'Yakuniy sessiya' },
  ]

  const agenda = data.agenda?.length ? data.agenda : defaultAgenda

  const defaultSpeakers = [
    { name: 'Alisher Umarov', role: 'CEO, TechCorp Uzbekistan' },
    { name: 'Nilufar Hasanova', role: 'Innovatsiya direktori' },
    { name: 'Bobur Xolmatov', role: 'Bosh ma\'ruzachi' },
  ]

  const speakers = data.speakers?.length ? data.speakers : defaultSpeakers

  return (
    <div className="w-full min-h-screen overflow-x-hidden"
      style={{
        background: '#f8fbff',
        color: '#0a1a2e',
        fontFamily: "'Inter', sans-serif",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .inter  { font-family: 'Inter', sans-serif; }
        .space  { font-family: 'Space Grotesk', sans-serif; }
        @keyframes slideRight {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .slide-in { animation: slideRight 1s cubic-bezier(0.77,0,0.175,1) forwards; transform-origin: left; }
      `}</style>

      {/* HERO */}
      <section ref={heroRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ position: 'relative', background: 'linear-gradient(145deg, #f0f6ff 0%, #e8f0fb 40%, #f8fbff 100%)' }}>
        <GridPattern />

        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 slide-in"
          style={{ background: 'linear-gradient(180deg, #0a4a8f, #4a8fd4, #0a4a8f)' }} />

        {/* Top right accent */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(10,74,143,0.07) 0%, transparent 70%)',
          }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 px-8 sm:px-16 max-w-5xl mx-auto w-full">

          {/* Top row */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-10"
          >
            {data.logoUrl && (
              <img src={data.logoUrl} alt="Logo" className="h-10 object-contain" />
            )}
            <div className="h-6 w-px bg-blue-200" />
            <span
              className="space text-xs font-semibold uppercase tracking-[0.35em] outline-none focus:outline-dashed focus:outline-blue-400 px-2 rounded"
              style={{ color: '#4a7ab5' }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('companyName', e.currentTarget.textContent || '')}
            >
              {data.companyName || 'TechCorp Uzbekistan'}
            </span>
          </motion.div>

          {/* Event type badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
            style={{
              background: 'rgba(10,74,143,0.08)',
              border: '1px solid rgba(10,74,143,0.15)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span
              className="space text-xs font-semibold uppercase tracking-[0.3em] outline-none focus:outline-dashed focus:outline-blue-400 px-1 rounded"
              style={{ color: '#0a4a8f' }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('eventType', e.currentTarget.textContent || '')}
            >
              {data.eventType || 'Annual Conference 2025'}
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="space font-black leading-none mb-6 outline-none focus:outline-dashed focus:outline-blue-400 rounded-xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              color: '#0a1a2e',
              letterSpacing: '-0.03em',
            }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('eventTitle', e.currentTarget.textContent || '')}
          >
            {data.eventTitle || "Innovation\nSummit '25"}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="h-1 w-24 mb-8 origin-left"
            style={{ background: 'linear-gradient(to right, #0a4a8f, #4a8fd4)' }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="inter text-base sm:text-lg leading-relaxed max-w-2xl mb-10 outline-none focus:outline-dashed focus:outline-blue-400 px-2 rounded-xl"
            style={{ color: '#4a6080', fontWeight: 300 }}
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('description', e.currentTarget.textContent || '')}
          >
            {data.description || "O'zbekistondagi eng yirik texnologiya va innovatsiya forumi. Yetakchi mutaxassislar, startaplar va korporatsiyalar ishtirokida."}
          </motion.p>

          {/* Meta info row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap items-center gap-6 mb-10"
          >
            {[
              { icon: Calendar, text: data.date || '15 Iyun, 2025', id: 'date' },
              { icon: Clock, text: data.time || '09:00 – 18:00', id: 'time' },
              { icon: MapPin, text: data.venue || 'Hyatt Regency Tashkent', id: 'venue' },
              { icon: Users, text: data.capacity || '500+ ishtirokchi', id: 'capacity' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: '#4a8fd4' }} />
                <span
                  className="inter text-sm font-medium outline-none focus:outline-dashed focus:outline-blue-400 px-1 rounded"
                  style={{ color: '#2a4a6a' }}
                  contentEditable={!!onDataChange}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof BusinessEventData, e.currentTarget.textContent || '')}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRegistrationClick}
              className="flex items-center gap-2 px-8 py-3.5 space text-sm font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'linear-gradient(135deg, #0a3a7a, #0a4a8f)',
                color: '#f0f6ff',
                boxShadow: '0 4px 20px rgba(10,74,143,0.3)',
              }}
            >
              Ro'yxatdan O'tish
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            {data.website && (
              <motion.a
                href={data.website} target="_blank"
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 px-8 py-3.5 space text-sm font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: 'transparent',
                  color: '#0a4a8f',
                  border: '1.5px solid #c2d4f0',
                }}
              >
                <Globe className="w-4 h-4" />
                Veb-sayt
              </motion.a>
            )}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4" style={{ color: '#a0b8d4' }} />
          </motion.div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6 text-center relative"
        style={{ background: '#ffffff' }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <BlueDivider />
          <div className="space-y-2">
            <p className="space text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#7a9ac5' }}>
              Tadbir boshlanishiga
            </p>
            <h2 className="space text-2xl sm:text-3xl font-black" style={{ color: '#0a1a2e' }}>
              {data.eventTitle || "Innovation Summit '25"}
            </h2>
          </div>
          <CountdownTimer dateStr={data.date || ''} />
          <BlueDivider />
        </div>
      </motion.section>

      {/* AGENDA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
        style={{ background: '#f0f5ff' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 space-y-3">
            <p className="space text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#7a9ac5' }}>Program</p>
            <h2 className="space text-2xl sm:text-3xl font-black" style={{ color: '#0a1a2e' }}>Kun Tartibi</h2>
            <div className="w-12 h-1" style={{ background: 'linear-gradient(to right, #0a4a8f, #4a8fd4)' }} />
          </div>
          <div className="space-y-3">
            {agenda.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-5 p-5 group transition-all duration-200"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0eaf8',
                  borderLeft: '3px solid #0a4a8f',
                }}
              >
                <span className="space text-sm font-black w-14 flex-shrink-0" style={{ color: '#4a8fd4' }}>
                  {item.time}
                </span>
                <div className="w-px h-8 bg-blue-100 flex-shrink-0" />
                <span className="inter font-medium" style={{ color: '#1a2e4a' }}>
                  {item.title}
                </span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#4a8fd4' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SPEAKERS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
        style={{ background: '#ffffff' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 space-y-3">
            <p className="space text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#7a9ac5' }}>Featured</p>
            <h2 className="space text-2xl sm:text-3xl font-black" style={{ color: '#0a1a2e' }}>Ma'ruzachilar</h2>
            <div className="w-12 h-1" style={{ background: 'linear-gradient(to right, #0a4a8f, #4a8fd4)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {speakers.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 group transition-all"
                style={{
                  background: '#f8fbff',
                  border: '1.5px solid #e0eaf8',
                  boxShadow: '0 2px 16px rgba(10,74,143,0.05)',
                }}
              >
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
                  style={{
                    background: `hsl(${210 + i * 25}, 60%, ${88 + i * 3}%)`,
                    border: '2px solid #c2d4f0',
                  }}>
                  <span className="space font-black text-xl" style={{ color: '#0a4a8f' }}>
                    {s.name[0]}
                  </span>
                </div>
                <p className="space font-bold text-base leading-tight mb-1" style={{ color: '#0a1a2e' }}>
                  {s.name}
                </p>
                <p className="inter text-xs font-medium" style={{ color: '#7a9ac5' }}>
                  {s.role}
                </p>
                <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(to right, #0a4a8f, #4a8fd4)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DETAILS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
        style={{ background: '#f0f5ff' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 space-y-3">
            <p className="space text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#7a9ac5' }}>Logistics</p>
            <h2 className="space text-2xl sm:text-3xl font-black" style={{ color: '#0a1a2e' }}>Tadbir Ma'lumotlari</h2>
            <div className="w-12 h-1" style={{ background: 'linear-gradient(to right, #0a4a8f, #4a8fd4)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: 'Sana', value: data.date || '15 Iyun, 2025', id: 'date' },
              { icon: Clock, label: 'Vaqt', value: data.time || '09:00 – 18:00', id: 'time' },
              { icon: MapPin, label: 'Joy', value: data.venue || 'Hyatt Regency', id: 'venue' },
              { icon: Users, label: 'Ishtirokchilar', value: data.capacity || '500+', id: 'capacity' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0eaf8',
                  boxShadow: '0 2px 12px rgba(10,74,143,0.05)',
                }}
              >
                <div className="w-10 h-10 rounded-full mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(10,74,143,0.07)', border: '1px solid #c2d4f0' }}>
                  <item.icon className="w-5 h-5" style={{ color: '#4a8fd4' }} />
                </div>
                <p className="space text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#7a9ac5' }}>
                  {item.label}
                </p>
                <p
                  className="space font-bold text-base leading-tight outline-none focus:outline-dashed focus:outline-blue-400 rounded px-0.5"
                  style={{ color: '#0a1a2e' }}
                  contentEditable={!!onDataChange && item.id !== 'capacity'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit(item.id as keyof BusinessEventData, e.currentTarget.textContent || '')}
                >
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* MAP */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-6 max-w-5xl mx-auto"
      >
        <div className="mb-8 space-y-2">
          <p className="space text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#7a9ac5' }}>Location</p>
          <h2 className="space text-xl font-black" style={{ color: '#0a1a2e' }}>{data.venue || 'Hyatt Regency Tashkent'}</h2>
          <p className="inter text-sm" style={{ color: '#7a9ac5' }}>{data.location || 'Toshkent, O\'zbekiston'}</p>
        </div>
        <MapEmbed location={data.location} mapUrl={data.mapUrl} />
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a1a2e 0%, #0a2a4a 50%, #0a1a2e 100%)' }}
      >
        <GridPattern />
        {/* Left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ background: 'linear-gradient(180deg, #0a4a8f, #4a8fd4, #0a4a8f)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-8 sm:px-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-3">
              <p className="space text-[9px] font-semibold uppercase tracking-[0.5em]" style={{ color: '#4a6080' }}>
                {data.companyName || 'TechCorp Uzbekistan'}
              </p>
              <h2 className="space font-black text-2xl sm:text-3xl leading-tight"
                style={{ color: '#e8f0fb' }}>
                {data.eventTitle || "Innovation Summit '25"}
              </h2>
              <p className="inter text-sm" style={{ color: '#4a6080' }}>
                {data.date || '15 Iyun, 2025'} · {data.venue || 'Hyatt Regency Tashkent'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRegistrationClick}
              className="flex items-center gap-2 px-8 py-4 space text-sm font-semibold uppercase tracking-wider flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #0a4a8f, #4a8fd4)',
                color: '#f0f6ff',
                boxShadow: '0 4px 20px rgba(74,143,212,0.3)',
              }}
            >
              Ro'yxatdan O'tish
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(74,144,212,0.15)' }}>
            <p className="inter text-xs" style={{ color: '#2a4060' }}>
              © 2025 {data.companyName || 'TechCorp Uzbekistan'}. Barcha huquqlar himoyalangan.
            </p>
            {data.website && (
              <a href={data.website} className="inter text-xs flex items-center gap-1 hover:text-blue-400 transition-colors"
                style={{ color: '#2a4060' }}>
                <Globe className="w-3 h-3" />
                {data.website}
              </a>
            )}
          </div>
        </div>
      </motion.footer>

      {/* MUSIC */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 flex items-center justify-center transition-all"
            style={{
              background: isPlaying ? 'linear-gradient(135deg, #0a3a7a, #4a8fd4)' : '#ffffff',
              border: '1.5px solid #c2d4f0',
              boxShadow: isPlaying ? '0 0 24px rgba(74,143,212,0.4)' : '0 4px 16px rgba(10,74,143,0.1)',
            }}>
            {isPlaying
              ? <Volume2 className="w-5 h-5 text-white animate-pulse" />
              : <VolumeX className="w-5 h-5" style={{ color: '#4a8fd4' }} />}
          </motion.button>
          <audio ref={audioRef} src={data.musicUrl || undefined} loop />
        </div>
      )}
    </div>
  )
}
