'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import { Camera, MapPin } from 'lucide-react'
import Image from 'next/image'
import { greatVibes, cormorant, lato } from '@/lib/fonts'

// ─── CONFETTI PIECE ───────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#f9c0d0','#fad4e8','#fce0a0','#c8e0f8','#d0f0c8','#e8c8f8','#f8d8a0','#a8d8f0']
const CONFETTI_SHAPES = ['circle','rect','star']

function ConfettiPiece({ x, delay, color, shape, size }: {
  x: number; delay: number; color: string; shape: string; size: number
}) {
  const renderShape = () => {
    if (shape === 'circle') return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: color, opacity: 0.85 }} />
    )
    if (shape === 'star') return (
      <div style={{ fontSize: size + 4, lineHeight: 1, color, opacity: 0.85 }}>★</div>
    )
    return (
      <div style={{ width: size * 1.4, height: size * 0.7, borderRadius: 2, background: color, opacity: 0.85 }} />
    )
  }
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: 0, pointerEvents: 'none', zIndex: 5 }}
      initial={{ y: -20, opacity: 0, rotate: 0, x: 0 }}
      animate={{
        y: '110vh',
        opacity: [0, 1, 0.8, 0],
        rotate: [0, 180 + Math.random() * 360],
        x: [0, (Math.random() - 0.5) * 120],
      }}
      transition={{ duration: 3.5 + Math.random() * 3, delay, repeat: Infinity, ease: 'linear' }}
    >
      {renderShape()}
    </motion.div>
  )
}

// ─── PETAL ────────────────────────────────────────────────────────────────────
function Petal({ x, delay, dur }: { x: number; delay: number; dur: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: 0, pointerEvents: 'none', zIndex: 4 }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{ y: '108vh', opacity: [0, 0.7, 0.5, 0], rotate: 360, x: [0, 20, -10, 15, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="14" height="18" viewBox="0 0 14 18">
        <ellipse cx="7" cy="9" rx="5.5" ry="9" fill="#f9c0d0" opacity="0.8" transform="rotate(-10 7 9)" />
        <ellipse cx="7" cy="9" rx="2" ry="6" fill="white" opacity="0.3" transform="rotate(-10 7 9)" />
      </svg>
    </motion.div>
  )
}

// ─── STAR SPARKLE ─────────────────────────────────────────────────────────────
function Sparkle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', zIndex: 3 }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 4 }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
          fill="#d4a840" opacity="0.8" />
      </svg>
    </motion.div>
  )
}

// ─── MAP EMBED ──────────────────────────────────────────────────
function MapEmbed({ location, mapUrl }: { location: string; mapUrl?: string }) {
  const src = mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(location || 'Tashkent')}&output=embed&z=15`
  return (
    <div className="w-full aspect-video min-h-[200px] overflow-hidden rounded-xl relative z-10"
      style={{ border: '0.5px solid rgba(212,168,64,0.3)', boxShadow: '0 4px 20px rgba(200,120,140,0.15)' }}>
      <iframe src={src} width="100%" height="100%"
        style={{ border: 0 }} allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" title="Manzil" />
    </div>
  )
}

// ─── FLOWER HEADER (pure CSS + SVG, no external image) ───────────────────────
function FlowerHeader({ height = 140 }: { height?: number }) {
  return (
    <div style={{
      height,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #fce8f0 0%, #fdf4e8 40%, #fce8d8 70%, #fce0d0 100%)',
    }}>
      {/* SVG floral decoration */}
      <svg width="100%" height="100%" viewBox="0 0 480 170" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}>
        {/* Left peony */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse key={i}
            cx="80" cy={height * 0.55}
            rx="38" ry="18"
            fill={i % 2 === 0 ? '#f9c0d0' : '#fad4e8'}
            opacity={0.55 - i * 0.03}
            transform={`rotate(${angle} 80 ${height * 0.55})`}
          />
        ))}
        <circle cx="80" cy={height * 0.55} r="14" fill="#f07890" opacity="0.4" />
        <circle cx="80" cy={height * 0.55} r="7" fill="#fde0a0" opacity="0.7" />
        {/* Right peony */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse key={i}
            cx="400" cy={height * 0.45}
            rx="34" ry="16"
            fill={i % 2 === 0 ? '#fce8c0' : '#f9c0d0'}
            opacity={0.5 - i * 0.025}
            transform={`rotate(${angle} 400 ${height * 0.45})`}
          />
        ))}
        <circle cx="400" cy={height * 0.45} r="12" fill="#f0a060" opacity="0.4" />
        <circle cx="400" cy={height * 0.45} r="6" fill="#fde0a0" opacity="0.7" />
        {/* Small flowers */}
        {[[160, 30, '#f9c0d0', 18], [240, 50, '#fce8c0', 14], [320, 25, '#fad4e8', 16]].map(([cx, cy, fill, r], i) => (
          <g key={i}>
            {[0, 60, 120, 180, 240, 300].map((a, j) => (
              <ellipse key={j} cx={cx as number} cy={cy as number}
                rx={(r as number) * 0.5} ry={(r as number) * 0.25}
                fill={fill as string} opacity="0.55"
                transform={`rotate(${a} ${cx} ${cy})`}
              />
            ))}
            <circle cx={cx as number} cy={cy as number} r={(r as number) * 0.18} fill="#fde0a0" opacity="0.8" />
          </g>
        ))}
        {/* Leaves */}
        <ellipse cx="115" cy="130" rx="22" ry="10" fill="#a8d8a0" opacity="0.35" transform="rotate(-30 115 130)" />
        <ellipse cx="360" cy="120" rx="20" ry="9" fill="#a8d8a0" opacity="0.3" transform="rotate(20 360 120)" />
        {/* Fade bottom */}
        <defs>
          <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.92)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#fadeBottom)" />
      </svg>
      {/* Soft overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.88) 100%)',
      }} />
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function MagicBirthdayTemplate({ data, onDataChange }: { data: any; onDataChange?: (data: any) => void }) {
  const { lang } = useLanguage()
  const [opened, setOpened] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isEditable = !!onDataChange

  useEffect(() => { setMounted(true) }, [])

  const handleEdit = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onDataChange) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const imgs = data.images ? [...data.images] : []
        imgs[0] = ev.target?.result as string
        onDataChange({ images: imgs })
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate random elements once on client
  const confetti = mounted ? Array.from({ length: 35 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 4,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: CONFETTI_SHAPES[i % 3],
    size: 5 + Math.random() * 6,
  })) : []

  const petals = mounted ? Array.from({ length: 12 }, (_, i) => ({
    x: 3 + Math.random() * 94,
    delay: i * 0.7 + Math.random() * 2,
    dur: 6 + Math.random() * 5,
  })) : []

  const sparkles = [
    { x: 8,  y: 15, delay: 0,   size: 16 },
    { x: 88, y: 12, delay: 1.2, size: 20 },
    { x: 5,  y: 55, delay: 2.5, size: 14 },
    { x: 92, y: 50, delay: 0.8, size: 18 },
    { x: 15, y: 80, delay: 3.2, size: 12 },
    { x: 85, y: 78, delay: 1.8, size: 16 },
    { x: 50, y: 5,  delay: 2.0, size: 14 },
  ]

  const texts = {
    uz: {
      invited: 'Siz Taklif Etilgansiz',
      special: 'Maxsus',
      birthday: "Tug'ilgan Kun",
      open: "Taklifnomani ochish",
      magic: "Mo'jizani ko'rish uchun bosing ✨",
      celebrating: "Nishonlaymiz",
      defaultName: "Sarvinoz",
      defaultAge: "20",
      defaultDate: "15 Iyun, 2025",
      defaultTime: "18:00",
      defaultVenue: "Grand Palace",
      defaultAddress: "Toshkent shahri, Amir Temur ko'chasi",
      defaultMessage: "Ushbu maxsus kunni nishonlar ekanmiz, sizni mehr, kulgu va go'zal xotiralarga boy oqshomga taklif qilamiz!",
      location: 'Manzil'
    },
    ru: {
      invited: 'Вы Приглашены',
      special: 'Особенный',
      birthday: 'День Рождения',
      open: 'Открыть Приглашение',
      magic: 'Нажмите, чтобы увидеть волшебство ✨',
      celebrating: 'Празднуем',
      defaultName: "Сарвиноз",
      defaultAge: "20",
      defaultDate: "15 Июня, 2025",
      defaultTime: "18:00",
      defaultVenue: "Grand Palace",
      defaultAddress: "г. Ташкент, ул. Амира Темура",
      defaultMessage: "Приглашаем вас на вечер, полный любви, смеха и прекрасных воспоминаний, чтобы отпраздновать этот особенный день!",
      location: 'Локация'
    },
    en: {
      invited: 'You Are Invited',
      special: 'A Special',
      birthday: 'Birthday Celebration',
      open: 'Open Invitation',
      magic: 'Click to reveal the magic ✨',
      celebrating: 'Celebrating',
      defaultName: "Sarvinoz",
      defaultAge: "20th",
      defaultDate: "June 15, 2025",
      defaultTime: "6:00 PM",
      defaultVenue: "Grand Palace",
      defaultAddress: "Tashkent, Amir Temur street",
      defaultMessage: "Join us for an evening filled with love, laughter, and beautiful memories as we celebrate this special milestone!",
      location: 'Location'
    }
  }

  const t = texts[lang as keyof typeof texts] || texts.uz

  const personImage = (data.images && data.images[0]) ? data.images[0] : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=90&fit=crop'

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #fef6ec 0%, #fce8f0 35%, #fdf4e8 65%, #fce8d8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "var(--font-cormorant), 'Georgia', serif",
    }} className={`${greatVibes.variable} ${cormorant.variable} ${lato.variable}`}>
      <style>{`
        .magic-birthday * { box-sizing: border-box; }
        .magic-birthday input:focus { outline: none; }
        .magic-birthday button:active { transform: scale(0.97); }
      `}</style>

      {/* BG large peony flowers (corners) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Bottom left large pink flower */}
        <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 260, height: 260,
            borderRadius: '50%', overflow: 'hidden',
            opacity: 0.35, filter: 'saturate(1.2)',
          }}>
          <Image
            src="https://images.unsplash.com/photo-1490750967868-88df5691cc6b?w=500&q=80&fit=crop"
            alt=""
            fill sizes="260px" priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Top right flower */}
        <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 220, height: 220,
            borderRadius: '50%', overflow: 'hidden',
            opacity: 0.28, filter: 'saturate(1.1) hue-rotate(330deg)',
          }}>
          <Image
            src="https://images.unsplash.com/photo-1487530811015-780780c73be6?w=400&q=80&fit=crop"
            alt=""
            fill sizes="220px" priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Hearts */}
        {[
          { left: '4%',  top: '20%',  size: 28, rot: -20 },
          { right: '3%', top: '30%',  size: 22, rot: 15  },
          { left: '7%',  top: '65%',  size: 18, rot: -10 },
          { right: '6%', top: '70%',  size: 24, rot: 20  },
          { left: '3%',  bottom: '25%', size: 20, rot: -5 },
        ].map((h, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', ...h,
              fontSize: h.size, color: '#f9a0b8', opacity: 0.5,
              rotate: h.rot,
            }}
            animate={{ y: [0, -8, 0], opacity: [0.4, 0.65, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          >♥</motion.div>
        ))}
        {/* BG sparkle shapes */}
        {[
          { left: '2%',  top: '45%',  size: 50, color: '#fde0a0', rot: 15  },
          { right: '2%', top: '55%',  size: 60, color: '#fce8c8', rot: -20 },
          { left: '5%',  bottom: '10%', size: 45, color: '#fdd0e0', rot: 30 },
          { right: '4%', bottom: '15%', size: 55, color: '#fde0a0', rot: -10 },
          { right: '1%', top: '10%',  size: 65, color: '#fce0d0', rot: 5   },
        ].map((s, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', ...s,
              width: s.size, height: s.size,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              background: s.color,
              rotate: s.rot, opacity: 0.55,
            }}
            animate={{ rotate: [s.rot, s.rot + 20, s.rot], scale: [1, 1.08, 1] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Sparkles */}
      {sparkles.map((s, i) => <Sparkle key={i} {...s} />)}

      {/* Petals (always) */}
      {petals.map((p, i) => <Petal key={i} {...p} />)}

      {/* Confetti (only after opened) */}
      <AnimatePresence>
        {opened && confetti.map((c, i) => <ConfettiPiece key={i} {...c} />)}
      </AnimatePresence>

      {/* ── CARD ── */}
      <AnimatePresence mode="wait">
        {!opened ? (
          /* ── COVER SCREEN ── */
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(12px)',
              borderRadius: 20,
              width: '100%',
              maxWidth: 480,
              overflow: 'hidden',
              boxShadow: '0 8px 60px rgba(200,120,140,0.18), 0 2px 20px rgba(200,120,140,0.1)',
              border: '1px solid rgba(249,192,208,0.4)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Flower header image */}
            <div style={{ position: 'relative' }}>
              <FlowerHeader height={140} />
              {/* YOU ARE INVITED badge */}
              <div style={{
                position: 'absolute', bottom: 14, left: 0, right: 0,
                textAlign: 'center', zIndex: 2,
              }}>
                <div style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-lato), sans-serif',
                  fontSize: 11, fontWeight: 400,
                  letterSpacing: '0.38em',
                  color: '#b8832a',
                  textTransform: 'uppercase',
                  borderBottom: '0.5px solid rgba(184,131,42,0.4)',
                  paddingBottom: 3,
                }}>
                  {t.invited}
                </div>
              </div>
            </div>

            {/* Cover content */}
            <div style={{ padding: '28px 32px 36px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 30, fontWeight: 300,
                color: '#3a2010', lineHeight: 1.25, marginBottom: 6,
              }}>
                {t.special}
              </div>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 38, fontStyle: 'italic', fontWeight: 600,
                color: '#c85a30', lineHeight: 1.1, marginBottom: 28,
              }}>
                {t.birthday}
              </div>

              {/* Gold star */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontSize: 32, marginBottom: 28 }}
              >
                ★
              </motion.div>

              {/* Open button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpened(true)}
                style={{
                  background: 'linear-gradient(135deg, #d4a840, #e8c060, #c49030)',
                  border: 'none',
                  borderRadius: 50,
                  padding: '14px 44px',
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 18, fontWeight: 400,
                  color: '#fff',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 20px rgba(180,140,40,0.35)',
                  marginBottom: 14,
                }}
              >
                {t.open}
              </motion.button>

              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 14, fontStyle: 'italic',
                color: '#c49030', opacity: 0.7,
              }}>
                {t.magic}
              </div>
            </div>
          </motion.div>

        ) : (
          /* ── FULL INVITATION ── */
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(14px)',
              borderRadius: 20,
              width: '100%',
              maxWidth: 480,
              overflow: 'hidden',
              boxShadow: '0 12px 80px rgba(200,120,140,0.22), 0 2px 20px rgba(200,120,140,0.1)',
              border: '1px solid rgba(249,192,208,0.4)',
              position: 'relative',
              zIndex: 10,
              paddingBottom: 20
            }}
          >
            {/* Flower header */}
            <div style={{ position: 'relative' }}>
              <FlowerHeader height={170} />
              {/* Gold star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', bottom: 10, left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 18, color: '#d4a840',
                  zIndex: 3,
                }}
              >
                ✦
              </motion.div>
            </div>

            {/* Card body */}
            <div style={{ padding: '8px 28px 36px', textAlign: 'center' }}>

              {/* CELEBRATING label */}
              <div style={{
                fontFamily: 'var(--font-lato), sans-serif',
                fontSize: 10, letterSpacing: '0.4em',
                color: '#c49030', textTransform: 'uppercase', marginBottom: 8,
              }}>
                {t.celebrating}
              </div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
                  style={{
                    fontFamily: 'var(--font-great-vibes), cursive',
                    fontSize: 56,
                    color: '#c85a30',
                    lineHeight: 1.1,
                    textShadow: '0 2px 15px rgba(200,90,48,0.2)',
                    marginBottom: 4,
                    outline: 'none',
                    paddingBottom: '8px',
                    paddingTop: '4px'
                  }}
                  className="cursor-text"
                >
                  {data.names || t.defaultName}
                </div>
              </motion.div>

              {/* Age divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '8px 0 4px' }}
              >
                <div style={{ width: 40, height: 0.5, background: 'linear-gradient(90deg, transparent, #d4a840)' }} />
                <div style={{ fontSize: 8, color: '#d4a840', letterSpacing: '0.1em' }}>✦</div>
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('age', e.currentTarget.textContent || '')}
                  className="cursor-text outline-none"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 26, fontWeight: 400,
                    color: '#3a2010',
                  }}>
                  {data.age || t.defaultAge}
                </div>
                <div style={{ fontSize: 8, color: '#d4a840', letterSpacing: '0.1em' }}>✦</div>
                <div style={{ width: 40, height: 0.5, background: 'linear-gradient(90deg, #d4a840, transparent)' }} />
              </motion.div>

              {/* Thin line */}
              <div style={{ width: 60, height: 0.5, background: 'rgba(212,168,64,0.35)', margin: '12px auto' }} />

              {/* Cake / Person image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{
                  position: 'relative',
                  width: 150, height: 150,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 24px',
                  border: '3px solid rgba(249,192,208,0.6)',
                  boxShadow: '0 4px 25px rgba(200,120,140,0.22)',
                }}
                className={isEditable ? "group cursor-pointer" : ""}
              >
                {isEditable && (
                  <label className="absolute inset-0 cursor-pointer z-10" style={{cursor: 'pointer'}}>
                    <input type="file" className="hidden" accept="image/*"
                      onChange={handleImageUpload} />
                  </label>
                )}
                <Image
                  src={personImage}
                  alt="Birthday person or cake"
                  fill sizes="150px"
                  style={{ objectFit: 'cover' }}
                />
                {isEditable && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"
                    style={{ background: 'rgba(200,90,48,0.4)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.6)' }}>
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 16 }}>🗓</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
                  className="cursor-text outline-none"
                  style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 18, fontWeight: 400,
                  color: '#5a3010', letterSpacing: '0.02em',
                }}>{data.date || t.defaultDate}</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.72, duration: 0.6 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 16 }}>🕐</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('time', e.currentTarget.textContent || '')}
                  className="cursor-text outline-none"
                  style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 18, fontWeight: 400,
                  color: '#5a3010', letterSpacing: '0.02em',
                }}>{data.time || t.defaultTime}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.84, duration: 0.6 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 16 }}>📍</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('venue', e.currentTarget.textContent || '')}
                  className="cursor-text outline-none"
                  style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 18, fontWeight: 400,
                  color: '#5a3010', letterSpacing: '0.02em',
                }}>{data.venue || t.defaultVenue}</span>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95, duration: 0.6 }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('address', e.currentTarget.textContent || '')}
                className="cursor-text outline-none"
                style={{
                  fontSize: 13, color: '#a07050', letterSpacing: '0.03em',
                  marginBottom: 22, marginTop: 2,
                }}
              >
                {data.address || t.defaultAddress}
              </motion.div>

              {/* Gold divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 0.5, background: 'linear-gradient(90deg, transparent, rgba(212,168,64,0.4))' }} />
                <div style={{ fontSize: 14, color: '#d4a840' }}>✦ ✦ ✦</div>
                <div style={{ flex: 1, height: 0.5, background: 'linear-gradient(90deg, rgba(212,168,64,0.4), transparent)' }} />
              </div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('message', e.currentTarget.textContent || '')}
                className="cursor-text outline-none"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 16, fontStyle: 'italic', fontWeight: 300,
                  color: '#8a5838', lineHeight: 1.65,
                  marginBottom: 26, padding: '0 8px',
                }}
              >
                "{data.message || t.defaultMessage}"
              </motion.div>

              {/* MAP section instead of RSVP */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(253,240,228,0.8), rgba(252,232,240,0.8))',
                  border: '0.5px solid rgba(212,168,64,0.3)',
                  borderRadius: 16, padding: '24px 20px',
                  marginBottom: 20,
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-great-vibes), cursive',
                  fontSize: 38, color: '#c49030', marginBottom: 4,
                  lineHeight: 1
                }}>
                  {t.location}
                </div>
                <div style={{
                  fontSize: 11, letterSpacing: '0.28em',
                  color: '#c4a070', textTransform: 'uppercase', marginBottom: 18,
                }}>
                  <span className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {data.venue || t.defaultVenue}
                  </span>
                </div>

                <MapEmbed location={data.address || t.defaultAddress} mapUrl={data.mapUrl} />
              </motion.div>

              {/* Footer flowers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 45, height: 0.5, background: 'linear-gradient(90deg, transparent, rgba(249,192,208,0.7))' }} />
                <span style={{ fontSize: 18, opacity: 0.6 }}>🌸</span>
                <span style={{ fontSize: 14, color: '#d4a840', opacity: 0.6 }}>✦</span>
                <span style={{ fontSize: 18, opacity: 0.6 }}>🌸</span>
                <div style={{ width: 45, height: 0.5, background: 'linear-gradient(90deg, rgba(249,192,208,0.7), transparent)' }} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
