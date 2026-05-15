'use client'

import { Calendar, MapPin, Camera, ArrowDown, Volume2, VolumeX, Sparkles, Gift } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useRef, useEffect } from 'react'
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
}


// ── CONFETTI RAIN ───────────────────────────────────────────
function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          initial={{ top: -20, left: `${Math.random() * 100}%`, rotate: 0 }}
          animate={{
            top: '100%',
            left: `${Math.random() * 100}%`,
            rotate: 360
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          style={{
            backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c', '#3498db', '#2ecc71'][i % 5],
            opacity: 0.6
          }}
        />
      ))}
    </div>
  )
}

// ── CAKE CANDLE COUNTER ───────────────────────────────────────
function CandleAge({ age }: { age: string }) {
  const num = parseInt(age) || 0
  const candles = Math.min(num, 15)
  return (
    <div className="flex items-end justify-center gap-1.5 h-20">
      {Array.from({ length: candles }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.05 * i, duration: 0.4, ease: 'backOut' }}
          className="flex flex-col items-center"
          style={{ transformOrigin: 'bottom' }}
        >
          <motion.div
            animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
            transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity }}
            className="w-1.5 h-2.5 rounded-full mb-0.5 shadow-[0_0_8px_rgba(255,165,0,0.8)]"
            style={{ background: 'linear-gradient(180deg, #fff 0%, #ffd700 40%, #ff4500 100%)' }}
          />
          <div className="w-2.5 rounded-t-full shadow-md"
            style={{
              height: `${30 + (i % 3) * 8}px`,
              background: `linear-gradient(to bottom, hsl(${(i * 45) % 360}, 75%, 70%), hsl(${(i * 45) % 360}, 75%, 50%))`,
              border: '1px solid rgba(255,255,255,0.3)'
            }} />
        </motion.div>
      ))}
      {num > 15 && (
        <div className="text-pink-500 font-bold text-xl ml-2 animate-bounce">
          +{num - 15}
        </div>
      )}
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

  if (!tl) return <p className="text-pink-500 tracking-widest text-lg font-bold">🎉 {t.happyMoments}!</p>

  return (
    <div className="flex items-center justify-center gap-3">
      {[{ v: tl.days, l: t.days }, { v: tl.hours, l: t.hours }, { v: tl.minutes, l: t.minutes }, { v: tl.seconds, l: t.seconds }].map((u, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-white shadow-xl border border-pink-100">
            <span className="text-xl sm:text-2xl font-bold text-pink-500 tabular-nums">{String(u.v).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 font-bold">{u.l}</span>
        </div>
      ))}
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────
export function ElegantBirthdayTemplate({
  data,
  onDataChange,
}: {
  data: BirthdayData
  onDataChange?: (d: Partial<BirthdayData>) => void
}) {
  const { t, lang } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  
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

  return (
    <div className="w-full min-h-screen bg-[#fffdfa] text-gray-800 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;700;900&family=Quicksand:wght@500;700&display=swap');
        .dancing { font-family: 'Dancing Script', cursive; }
        .montserrat { font-family: 'Montserrat', sans-serif; }
        .quicksand { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50 via-white to-blue-50 opacity-60" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30" />
        
        <Confetti />

        <div className="relative z-10 text-center px-6 space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block p-4 rounded-3xl bg-white/50 backdrop-blur-md border border-white shadow-2xl mb-4"
          >
             <Gift className="w-10 h-10 text-pink-500 mx-auto" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dancing text-3xl sm:text-4xl text-pink-500"
          >
            {t.youAreInvited}!
          </motion.h2>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <span
              className="montserrat font-black text-[120px] sm:text-[200px] leading-none tracking-tighter"
              style={{
                background: 'linear-gradient(to bottom, #FF6B6B, #FF9F43)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block'
              }}
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('age', e.currentTarget.textContent || '')}
            >
              {data.age || '25'}
            </span>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full">
               <CandleAge age={data.age || '25'} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-12"
          >
            <h1
              className="quicksand font-bold text-4xl sm:text-6xl text-gray-800 outline-none focus:bg-pink-50 rounded-2xl px-4"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('name', e.currentTarget.textContent || '')}
            >
              {data.name || (lang === 'uz' ? 'Lola Akramova' : lang === 'ru' ? 'Лола Акрамова' : 'Lola Akramova')}
            </h1>
            <p className="dancing text-2xl text-pink-400 mt-2">
              {t.birthdayOf}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-4 text-gray-500 font-bold uppercase tracking-[0.2em] text-xs pt-4"
          >
            <div className="h-px w-8 bg-pink-200" />
            <span
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
            >
              {data.date || (lang === 'uz' ? '20 Oktyabr, 2024' : lang === 'ru' ? '20 Октября, 2024' : 'October 20, 2024')}
            </span>
            <div className="h-px w-8 bg-pink-200" />
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 text-pink-300" />
        </motion.div>
      </section>

      {/* MESSAGE SECTION */}
      <section className="py-24 px-6 text-center bg-white relative">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="relative">
            <div className="absolute -top-10 -left-10 text-pink-100 text-9xl font-serif opacity-50">"</div>
            <p
              className="quicksand italic text-xl sm:text-2xl text-gray-600 leading-relaxed relative z-10 outline-none focus:bg-pink-50 rounded-2xl p-6"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('message', e.currentTarget.textContent || '')}
            >
              {data.message || (lang === 'uz' 
                ? 'Hayotning eng go\'zal damlarini siz azizlar bilan birgalikda nishonlashdan baxtiyorman. Bayram kechasida barchangizni kutaman!' 
                : lang === 'ru' 
                ? 'Я буду рад отпраздновать самые прекрасные моменты жизни вместе с вами. Жду всех вас на праздничном вечере!' 
                : 'I am happy to celebrate the most beautiful moments of life together with you. I am waiting for all of you at the celebration evening!')}
            </p>
          </div>
          <CountdownTimer dateStr={data.date || ''} />
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-4 bg-[#fffaf5]">
        <div className="max-w-5xl mx-auto">
          <h2 className="dancing text-4xl text-center text-pink-500 mb-12">{t.happyMoments}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.images.map((url, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img src={url} className="w-full h-full object-cover" alt="" />
                {onDataChange && (
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                  </label>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILS & MAP */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="quicksand font-black text-4xl text-gray-800">{t.whereAndWhen}</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-pink-500 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t.dateTime}</h4>
                  <p className="text-gray-500">{data.date} · {data.time}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-500 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t.address}</h4>
                  <p className="text-gray-500">{data.venue} · {data.location}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => window.open(data.mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(data.location)}`, '_blank')}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-pink-500 transition-colors shadow-lg uppercase tracking-widest text-xs"
            >
              {t.viewOnMap}
            </button>
          </div>

          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-96">
             <iframe 
                src={data.mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(data.location || 'Toshkent')}&output=embed`}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
             />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 text-center bg-gradient-to-t from-pink-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <Confetti />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="dancing text-5xl text-pink-500">{data.name}</h2>
          <p className="quicksand font-bold text-gray-400 tracking-[0.3em] uppercase">{t.waitingForYou}</p>
          <div className="pt-8">
             <div className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
               {data.age} {t.turningAge} · {data.date}
             </div>
          </div>
        </div>
      </footer>

      {/* MUSIC BUTTON */}
      {data.musicUrl !== 'none' && (
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors ${isPlaying ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`}
          >
            {isPlaying ? <Volume2 className="animate-pulse" /> : <VolumeX />}
          </motion.button>
          <audio ref={audioRef} src={data.musicUrl} loop />
        </div>
      )}
    </div>
  )
}
