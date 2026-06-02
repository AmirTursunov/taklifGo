'use client'

import React, { useState, useEffect, useRef } from 'react'

const DEFAULT_CONFIG = {
  from: 'Yaqinlaringiz',
  relation: "do'stim",
  wishes: [
    { icon: '🌸', text: "Hayoting doim bahor kabi gullab yashnаsin" },
    { icon: '⭐', text: "Har bir orzuing ro'yobga chiqsin" },
    { icon: '💜', text: "Quvonch va sog'lik hech tark etmasin" },
    { icon: '✨', text: "Baxtingiz chegara bilmasin!" },
    { icon: '🎀', text: "Umr yo'lingiz nurli bo'lsin" },
  ],
  photos: [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    'https://images.unsplash.com/photo-1527515545081-5db817172677?w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  ],
}

const SCAN_MESSAGES = [
  "Ma'lumotlar yuklanmoqda...",
  "Shaxs tasdiqlanmoqda...",
  "Maxfiy fayl ochilmoqda...",
  "Ruxsat berildi ✓",
]

function StarField({ count = 70 }) {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      dur: 2 + Math.random() * 3,
      del: Math.random() * 4,
    }))
  )
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.current.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${s.top}%`, left: `${s.left}%`,
          width: s.size, height: s.size,
          borderRadius: '50%', background: 'white',
          opacity: s.opacity,
          animation: `sb-twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

function ScreenLock({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')
  const [err, setErr] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) { setErr(true); setTimeout(() => setErr(false), 2000); return }
    onSubmit(name.trim())
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg,#0d0d1a 0%,#130018 50%,#0a0f0d 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 28px',
    }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1px solid rgba(168,85,247,.2)', animation: 'sb-ring 2s ease-in-out .4s infinite' }} />
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1.5px solid rgba(168,85,247,.4)', animation: 'sb-ring 2s ease-in-out infinite' }} />
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,.3),transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="3" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1.5" fill="rgba(168,85,247,1)" />
            </svg>
          </div>
        </div>

        <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(168,85,247,.85)', marginBottom: 12, fontWeight: 700 }}>
          🎂 Secret Birthday Access
        </div>
        <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 30, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 8 }}>
          Maxfiy eshik
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginBottom: 36, lineHeight: 1.65 }}>
          Bu link maxsus siz uchun yaratilgan.<br />Kirishingizni tasdiqlang.
        </div>

        <div style={{ width: '100%', maxWidth: 290, marginBottom: 12 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ismingizni kiriting..."
            maxLength={24}
            autoComplete="off"
            style={{
              width: '100%', padding: '14px 18px',
              borderRadius: 14, outline: 'none',
              border: `1.5px solid ${err ? 'rgba(255,80,80,.6)' : 'rgba(168,85,247,.35)'}`,
              background: 'rgba(255,255,255,.06)',
              color: '#fff', fontSize: 15, fontWeight: 600,
              fontFamily: "'Nunito',sans-serif",
              transition: 'border-color .3s, background .3s',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', maxWidth: 290, padding: '15px',
            borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)',
            color: '#fff', fontSize: 15, fontWeight: 800,
            fontFamily: "'Nunito',sans-serif", letterSpacing: '.05em',
            position: 'relative', overflow: 'hidden',
            transition: 'transform .15s, opacity .15s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)', animation: 'sb-shine 3s ease-in-out infinite' }} />
          Kirish →
        </button>

        {err && (
          <div style={{ fontSize: 12, color: 'rgba(255,80,80,.8)', marginTop: 10, fontWeight: 600 }}>
            Iltimos ismingizni kiriting
          </div>
        )}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 14, textAlign: 'center' }}>
          🔒 Bu ma'lumot hech qayerga saqlanmaydi
        </div>
      </div>
    </div>
  )
}

function ScreenScan({ name, onDone }: { name: string, onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    let p = 0
    const iv = setInterval(() => {
      p = Math.min(p + Math.random() * 4.5 + 1, 100)
      setProgress(p)
      setMsgIdx(Math.min(Math.floor(p / 25), SCAN_MESSAGES.length - 1))
      if (p >= 100) { clearInterval(iv); setTimeout(onDone, 700) }
    }, 55)
    return () => clearInterval(iv)
  }, [onDone])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(168,85,247,.25)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#a855f7', animation: 'sb-spin .8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1.5px solid transparent', borderBottomColor: '#ec4899', animation: 'sb-spin 1.2s linear infinite reverse' }} />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,.8)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>

        <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(168,85,247,.9)', marginBottom: 8, fontWeight: 700 }}>
          Tekshirilmoqda...
        </div>
        <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 30, color: '#fff', marginBottom: 28 }}>
          {name}
        </div>

        <div style={{ width: 220, height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 10, background: 'linear-gradient(90deg,#7c3aed,#ec4899)', width: `${progress}%`, transition: 'width .1s linear' }} />
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>
          {SCAN_MESSAGES[msgIdx]}
        </div>
      </div>
    </div>
  )
}

function ScreenBirthday({ name, config }: { name: string, config: any }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = config.photos?.length ? config.photos : DEFAULT_CONFIG.photos

  useEffect(() => {
    const iv = setInterval(() => setPhotoIdx(p => (p + 1) % photos.length), 3500)
    return () => clearInterval(iv)
  }, [photos.length])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {photos.map((url: string, i: number) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === photoIdx ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }} />
      ))}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.15) 40%,rgba(0,0,0,.72) 100%)' }} />
      <ConfettiLayer />
      <HeartsLayer />

      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '44px 22px 32px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,.22)', borderRadius: 50,
            padding: '7px 16px 7px 10px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'sb-blink 1.5s ease-in-out infinite' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.85)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Access Granted ✓</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 6, fontWeight: 700 }}>
              Tug'ilgan kuningiz bilan
            </div>
            <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 52, color: '#fff', textShadow: '0 2px 30px rgba(168,85,247,.65)', lineHeight: 1.05, animation: 'sb-namepop .7s cubic-bezier(.34,1.56,.64,1) both' }}>
              {name}!
            </div>
            <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: 22, color: '#f9a8d4', marginTop: 4, fontWeight: 700 }}>
              Aziz {config.relation || "do'stim"} 🎂
            </div>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', textAlign: 'center', marginBottom: 10, fontWeight: 700 }}>
            ✦ &nbsp; Tilaklarim &nbsp; ✦
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(config.wishes || DEFAULT_CONFIG.wishes).map((w: any, i: number) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.15)', borderRadius: 16,
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                animation: `sb-wishslide .5s ${i * 0.13}s ease both`,
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 600, lineHeight: 1.4 }}>{w.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: 16, color: 'rgba(255,255,255,.55)', fontWeight: 600 }}>
            — Sevgi bilan, <span style={{ color: '#f9a8d4' }}>{config.from || DEFAULT_CONFIG.from}</span> 💖
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {photos.map((_: any, i: any) => (
              <div key={i} style={{
                width: i === photoIdx ? 18 : 5, height: 5, borderRadius: 3,
                background: i === photoIdx ? '#fff' : 'rgba(255,255,255,.3)',
                transition: 'all .4s ease',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CONF_COLORS = ['#f9a8d4', '#c4b5fd', '#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#a5f3fc']
function ConfettiLayer() {
  const items = useRef(Array.from({ length: 22 }, (_, i) => ({
    left: Math.random() * 100,
    color: CONF_COLORS[i % CONF_COLORS.length],
    w: 5 + Math.random() * 7,
    h: 4 + Math.random() * 5,
    pill: Math.random() > .5,
    dur: 4 + Math.random() * 5,
    del: Math.random() * 4,
  })))
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {items.current.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: -10, left: `${c.left}%`,
          width: c.w, height: c.h, borderRadius: c.pill ? '50%' : 2,
          background: c.color, opacity: .8,
          animation: `sb-confetti ${c.dur}s ${c.del}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

const HEART_EMOJIS = ['💜', '💖', '🌸', '✨', '💫', '🎉', '🎀', '⭐']
function HeartsLayer() {
  const [hearts, setHearts] = useState<{ id: number, left: number, emoji: string, size: number, dur: number }[]>([])
  useEffect(() => {
    const iv = setInterval(() => {
      const id = Date.now()
      setHearts(h => [...h.slice(-12), {
        id, left: 10 + Math.random() * 80,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        size: 16 + Math.random() * 14,
        dur: 2 + Math.random() * 2,
      }])
    }, 900)
    return () => clearInterval(iv)
  }, [])
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute', bottom: '15%', left: `${h.left}%`,
          fontSize: h.size, animation: `sb-heart ${h.dur}s ease forwards`,
        }}>{h.emoji}</div>
      ))}
    </div>
  )
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;600;700;800&family=Dancing+Script:wght@600;700&display=swap');
      @keyframes sb-twinkle  { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
      @keyframes sb-ring     { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.08);opacity:1} }
      @keyframes sb-shine    { 0%{left:-100%} 50%,100%{left:150%} }
      @keyframes sb-spin     { to{transform:rotate(360deg)} }
      @keyframes sb-blink    { 0%,100%{opacity:1} 50%{opacity:.3} }
      @keyframes sb-confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(720px) rotate(720deg);opacity:.2} }
      @keyframes sb-heart    { 0%{transform:translateY(0) scale(1);opacity:.9} 100%{transform:translateY(-200px) scale(.3);opacity:0} }
      @keyframes sb-wishslide{ from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
      @keyframes sb-namepop  { from{opacity:0;transform:scale(.6)} 70%{transform:scale(1.08)} to{opacity:1;transform:scale(1)} }
      @keyframes sb-fade     { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    `}</style>
  )
}

export default function SecretBirthday({ data }: { data?: any }) {
  const config = {
    from: data?.closingSub || DEFAULT_CONFIG.from,
    relation: data?.subMessage || DEFAULT_CONFIG.relation,
    wishes: data?.message ? [
      { icon: '🌸', text: data.message.split('\\n')[0] || "Hayoting doim bahor kabi gullab yashnаsin" },
      { icon: '⭐', text: data.message.split('\\n')[1] || "Har bir orzuing ro'yobga chiqsin" },
      { icon: '💜', text: data.message.split('\\n')[2] || "Quvonch va sog'lik hech tark etmasin" }
    ] : DEFAULT_CONFIG.wishes,
    photos: data?.images?.length ? data.images : DEFAULT_CONFIG.photos
  }

  const [screen, setScreen] = useState('lock')
  const [userName, setUserName] = useState('')

  const handleNameSubmit = (name: string) => {
    setUserName(name)
    setScreen('scan')
  }

  return (
    <div style={{
      fontFamily: "'Nunito',sans-serif",
      width: '100%', maxWidth: 420,
      margin: '0 auto',
      aspectRatio: '9/16',
      maxHeight: '92vh',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 28,
      boxShadow: '0 20px 80px rgba(0,0,0,.5)',
    }}>
      <GlobalStyles />
      <div style={{ position: 'absolute', inset: 0, animation: screen === 'lock' ? 'sb-fade .6s ease both' : 'none', zIndex: screen === 'lock' ? 10 : 0 }}>
        {screen === 'lock' && <ScreenLock onSubmit={handleNameSubmit} />}
      </div>
      {screen === 'scan' && (
        <ScreenScan name={userName} onDone={() => setScreen('bday')} />
      )}
      {screen === 'bday' && (
        <ScreenBirthday name={userName} config={config} />
      )}
    </div>
  )
}
