'use client'

import React, { useState, useEffect, useRef } from 'react'

const MARBLE_BG = "/textures/wed-photo.avif"
const ROSES_TOP = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=85"
const ROSES_BOTTOM = "https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=600&q=85"
const DARK_ROSES = "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=85"

const textShadow = '0 1px 10px rgba(0,0,0,0.5), 0 2px 20px rgba(0,0,0,0.3)'
const goldTextShadow = '0 1px 6px rgba(180,140,40,0.4)'

export default function WeddingInvitation({ data = {}, onDataChange }: { data?: any, onDataChange?: any }) {
  const [slide, setSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const d = {
    names: data.names || "Zulfiddin & Mashhura",
    verse: data.verse || "Alloh ularning qalbini sevgi ila birlashtirdi\nAnfol surasi 63-oyat",
    message: data.message || "Hurmatli aziz mehmonimiz\nSizni hayotimizning eng go'zal va baxtli\nonlarida biz bilan bo'lishingiz istagida\nnikoh shodiyonamizga taklif qilamiz",
    date: data.date || "08 | 08 | 2026",
    time: data.time || "18:00",
    venue: data.venue || '"Oqshom" restaurant',
    closing: data.closing || "Qalblar ezgulikka to'la ushbu kunda do'stlar yonida bo'ling",
  }

  const nameParts = d.names.split(/\s+(?:va|and|и)\s+|(?:\s*&\s*)/i).map((n: string) => n.trim()).filter(Boolean)

  const DELAYS = [4000, 6000, 7000]

  const goToSlide = (next: number) => {
    if (animating || next === slide) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setAnimating(true)
    setPrevSlide(slide)
    setTimeout(() => {
      setSlide(next)
      setPrevSlide(null)
      setAnimating(false)
    }, 700)
  }

  const nextSlide = () => goToSlide((slide + 1) % 3)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goToSlide((slide + 1) % 3)
    }, DELAYS[slide])
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [slide, animating])

  const GoldDivider = ({ width = 60, style = {}, className = "" }: { width?: number, style?: any, className?: string }) => (
    <div className={className} style={{
      width, height: 1,
      background: 'linear-gradient(90deg, transparent, #d4a840, #f0cc60, #d4a840, transparent)',
      margin: '0 auto', ...style
    }} />
  )

  const GoldBorder = () => (
    <>
      {/* Outer gold border */}
      <div style={{
        position: 'absolute', inset: 8, pointerEvents: 'none', zIndex: 10,
        border: '1.5px solid',
        borderImage: 'linear-gradient(135deg,#f0d060,#c9a030,#f0cc50,#a87820,#e8c040,#f0d060) 1',
      }} />
      {/* Inner thin border */}
      <div style={{
        position: 'absolute', inset: 14, pointerEvents: 'none', zIndex: 10,
        border: '0.5px solid rgba(212,168,64,0.45)',
      }} />
    </>
  )

  const CornerLeaf = ({ pos }: { pos: string }) => {
    return (
      <div style={{
        position: 'absolute',
        ...(pos === 'tl' ? { top: 4, left: 4 } : pos === 'tr' ? { top: 4, right: 4 } : pos === 'bl' ? { bottom: 4, left: 4 } : { bottom: 4, right: 4 }),
        width: 48, height: 48,
        zIndex: 11, pointerEvents: 'none',
        transform: pos === 'tr' ? 'scaleX(-1)' : pos === 'bl' ? 'scaleY(-1)' : pos === 'br' ? 'scale(-1)' : 'none',
      }}>
        <svg viewBox="0 0 48 48" width="48" height="48">
          <defs>
            <linearGradient id={`cg${pos}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0d060" />
              <stop offset="50%" stopColor="#c9a030" />
              <stop offset="100%" stopColor="#a87820" />
            </linearGradient>
          </defs>
          <path d="M4 44 L4 12 Q4 4 12 4 L44 4" stroke={`url(#cg${pos})`} strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="8" r="2.5" fill="#c9a030" opacity="0.8" />
          <path d="M16 4 Q20 14 14 20" stroke="#c9a030" strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M4 16 Q14 20 20 14" stroke="#c9a030" strokeWidth="0.8" fill="none" opacity="0.7" />
          <circle cx="20" cy="4" r="1.5" fill="#d4a840" opacity="0.5" />
          <circle cx="4" cy="20" r="1.5" fill="#d4a840" opacity="0.5" />
        </svg>
      </div>
    )
  }

  const slideStyle = (isActive: boolean, isOut: boolean) => ({
    position: 'absolute' as const, inset: 0,
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'scale(1)' : isOut ? 'scale(1.04)' : 'scale(0.97)',
    pointerEvents: isActive ? 'auto' as const : 'none' as const,
    zIndex: isActive ? 2 : 1,
  })

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif", maxWidth: 380, margin: '0 auto', padding: '16px 0' }}>


      {/* Main Card */}
      <div
        onClick={nextSlide}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9/16',
          maxHeight: '85vh',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* BACKGROUND */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={MARBLE_BG}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Subtle warm overlay for better text contrast */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(245,238,225,0.45)', // Slightly increased for readability of dark text on photos
          }} />
        </div>

        {/* Gold Borders */}
        <GoldBorder />

        {/* Corner decorations */}
        <CornerLeaf pos="tl" />
        <CornerLeaf pos="tr" />
        <CornerLeaf pos="bl" />
        <CornerLeaf pos="br" />

        {/* Floating petals */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="petal-anim"
              style={{
                position: 'absolute',
                bottom: -10,
                left: `${10 + i * 15}%`,
                width: 6 + (i % 3) * 3,
                height: 4 + (i % 2) * 2,
                borderRadius: '50% 50% 50% 0',
                background: `rgba(200,168,64,${0.15 + (i % 3) * 0.1})`,
                animationDuration: `${7 + i * 2}s`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

        {/* ─── SLIDE 0: Cover with roses ─── */}
        <div style={{ ...slideStyle(slide === 0, prevSlide === 0) }}>
          {/* Top roses image */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '42%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1508182314998-3bd49473002b?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '130%',
                objectFit: 'cover', objectPosition: 'center top',
                filter: 'saturate(0.3) brightness(0.55) sepia(0.3)',
                mixBlendMode: 'multiply',
              }}
            />
            {/* Fade to background */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(245,238,225,0.85) 100%)',
            }} />
          </div>

          {/* Bottom roses image */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1508182314998-3bd49473002b?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '130%',
                objectFit: 'cover', objectPosition: 'center bottom',
                filter: 'saturate(0.3) brightness(0.5) sepia(0.3)',
                mixBlendMode: 'multiply',
                transform: 'scaleY(-1)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0) 40%, rgba(245,238,225,0.85) 100%)',
            }} />
          </div>

          {/* Center content */}
          <div style={{
            position: 'relative', zIndex: 3,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', padding: '0 24px',
            textAlign: 'center',
          }}>
            {/* Verse */}
            <div style={{
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#4a3820', lineHeight: 1.8, marginBottom: 10,
              textShadow: '0 1px 4px rgba(255,255,255,0.8)',
            }}>
              Nikoh to'yi
            </div>
            <GoldDivider width={50} style={{ marginBottom: 20 }} className="gold-shimmer" />

            {/* Circle golden frame */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="gr0" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f0d060" />
                    <stop offset="40%" stopColor="#c9a030" />
                    <stop offset="100%" stopColor="#a07020" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="86" stroke="url(#gr0)" strokeWidth="2" fill="rgba(245,240,230,0.65)" />
                <circle cx="100" cy="100" r="80" stroke="url(#gr0)" strokeWidth="0.6" fill="none" opacity="0.5" />
                {/* Small gold dots around ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                  <circle
                    key={i}
                    cx={100 + 87 * Math.cos(a * Math.PI / 180)}
                    cy={100 + 87 * Math.sin(a * Math.PI / 180)}
                    r="2.5" fill="#c9a030" opacity="0.7"
                  />
                ))}
              </svg>
              {/* Names inside circle */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '24px',
              }}>
                <span style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: nameParts[0]?.length > 8 ? 40 : 46,
                  color: '#2c1e08', lineHeight: 1.1,
                  textShadow: goldTextShadow,
                  textTransform: 'capitalize'
                }}>
                  {nameParts[0]}
                </span>
                <span style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: 30, color: '#a87820', lineHeight: 1.2,
                  textShadow: goldTextShadow,
                }}>
                  &
                </span>
                <span style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: nameParts[1]?.length > 8 ? 38 : 44,
                  color: '#2c1e08', lineHeight: 1.1,
                  textShadow: goldTextShadow,
                  textTransform: 'capitalize'
                }}>
                  {nameParts[1]}
                </span>
              </div>
            </div>

            <GoldDivider width={50} style={{ marginTop: 4, marginBottom: 10 }} />
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 10, letterSpacing: '0.32em',
              textTransform: 'uppercase', color: '#7a5c28',
              textShadow: '0 1px 4px rgba(255,255,255,0.8)',
            }}>
              Taklifnoma
            </div>
          </div>
        </div>

        {/* ─── SLIDE 1: Message ─── */}
        <div style={{ ...slideStyle(slide === 1, prevSlide === 1) }}>
          {/* Top bouquet */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '150%',
                objectFit: 'cover', objectPosition: 'center 20%',
                filter: 'saturate(0.2) brightness(0.45) sepia(0.4)',
                mixBlendMode: 'multiply',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(245,238,225,0.1) 0%, rgba(245,238,225,0.85) 90%)',
            }} />
          </div>

          {/* Bottom bouquet */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '150%',
                objectFit: 'cover', objectPosition: 'center 80%',
                filter: 'saturate(0.2) brightness(0.45) sepia(0.4)',
                mixBlendMode: 'multiply',
                transform: 'scaleY(-1)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(245,238,225,0.1) 0%, rgba(245,238,225,0.85) 90%)',
            }} />
          </div>

          {/* Arch content */}
          <div style={{
            position: 'relative', zIndex: 3,
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 28px',
          }}>
            {/* Arch border */}
            <div style={{
              width: '100%', maxWidth: 280,
              padding: '28px 20px 24px',
              background: 'rgba(245,240,228,0.7)',
              border: '1px solid rgba(212,168,64,0.4)',
              borderRadius: '50% 50% 6px 6px / 20% 20% 6px 6px',
              backdropFilter: 'blur(2px)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 10.5, letterSpacing: '0.06em',
                color: '#6a4e22', lineHeight: 1.7, marginBottom: 8,
              }}>
                {d.verse.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}
              </div>
              <GoldDivider width={70} style={{ marginBottom: 14 }} />
              <span style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 48, color: '#2c1e08',
                display: 'block', lineHeight: 1.05,
                textShadow: goldTextShadow,
                textTransform: 'capitalize'
              }}>
                {nameParts[0]}
              </span>
              <span style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 34, color: '#a87820',
                display: 'block', lineHeight: 1.1,
              }}>
                &
              </span>
              <span style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 44, color: '#2c1e08',
                display: 'block', lineHeight: 1.05,
                textShadow: goldTextShadow,
                textTransform: 'capitalize'
              }}>
                {nameParts[1]}
              </span>
              <GoldDivider width={60} style={{ margin: '14px auto 14px' }} />
              <div style={{
                fontSize: 13.5, color: '#3a2c10',
                lineHeight: 1.75, fontWeight: 400,
              }}>
                {d.message.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SLIDE 2: Details ─── */}
        <div style={{ ...slideStyle(slide === 2, prevSlide === 2) }}>
          {/* Top roses */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '36%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '140%',
                objectFit: 'cover', objectPosition: 'center 30%',
                filter: 'saturate(0.2) brightness(0.45) sepia(0.35)',
                mixBlendMode: 'multiply',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(245,238,225,0.05) 20%, rgba(245,238,225,0.95) 100%)',
            }} />
          </div>

          {/* Bottom roses */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=700&q=85"
              alt=""
              style={{
                width: '100%', height: '140%',
                objectFit: 'cover', objectPosition: 'center',
                filter: 'saturate(0.2) brightness(0.45) sepia(0.35)',
                mixBlendMode: 'multiply',
                transform: 'scaleY(-1)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(245,238,225,0.05) 20%, rgba(245,238,225,0.95) 100%)',
            }} />
          </div>

          {/* Content */}
          <div style={{
            position: 'relative', zIndex: 3,
            width: '100%', height: '97%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 28px',
            gap: 0,
          }}>
            <div style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 26, color: '#2c1e08',
              lineHeight: 1.5, textAlign: 'center',
              maxWidth: 250, marginBottom: 14,
              textShadow: goldTextShadow,
            }}>
              {d.closing}
            </div>

            <GoldDivider width={70} style={{ marginBottom: 16 }} />

            {/* Details box */}
            <div style={{
              background: 'rgba(245,240,228,0.7)',
              border: '1px solid rgba(212,168,64,0.4)',
              borderRadius: 4,
              padding: '18px 28px 20px',
              width: '100%', maxWidth: 270,
              textAlign: 'center',
              backdropFilter: 'blur(2px)',
            }}>
              {/* Date */}
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26, fontWeight: 600,
                letterSpacing: '0.18em', color: '#2c1e08',
                marginBottom: 4,
              }}>
                {d.date}
              </div>

              <GoldDivider width={50} style={{ margin: '10px auto' }} />

              {/* Time */}
              <div style={{
                fontSize: 10, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: '#8a6030',
                marginBottom: 2,
              }}>
                Soat
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20, fontWeight: 600, color: '#2c1e08',
                marginBottom: 10,
              }}>
                {d.time}
              </div>

              {/* Venue */}
              <div style={{
                fontSize: 10, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: '#8a6030',
                marginBottom: 2,
              }}>
                Manzil
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 16, fontWeight: 400, color: '#2c1e08',
              }}>
                {d.venue}
              </div>
            </div>

            {/* Gold rings SVG */}
            <svg width="70" height="40" viewBox="0 0 70 40" style={{ marginTop: 16 }}>
              <defs>
                <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0d060" />
                  <stop offset="100%" stopColor="#a07020" />
                </linearGradient>
              </defs>
              <circle cx="27" cy="20" r="14" fill="none" stroke="url(#rg1)" strokeWidth="3" />
              <circle cx="43" cy="20" r="14" fill="none" stroke="url(#rg1)" strokeWidth="3" />
              {/* Shine highlights */}
              <path d="M18 13 Q20 10 24 11" stroke="#f0e080" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
              <path d="M46 13 Q48 10 52 11" stroke="#f0e080" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* Dot navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
        {[0, 1, 2].map(i => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goToSlide(i) }}
            style={{
              width: slide === i ? 22 : 7,
              height: 7,
              borderRadius: 4,
              border: 'none',
              background: slide === i
                ? 'linear-gradient(90deg, #c9a030, #f0d060)'
                : 'rgba(180,140,40,0.3)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
      <div style={{
        textAlign: 'center', marginTop: 6,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 11, color: '#8a6c40',
        letterSpacing: '0.1em',
      }}>
        bosish orqali o'tish
      </div>
    </div>
  )
}
