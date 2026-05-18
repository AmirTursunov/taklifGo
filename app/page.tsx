'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, ArrowRight, Share2, Palette, Globe } from 'lucide-react'
import { Header } from '@/components/header'
import { useLanguage } from '@/lib/LanguageContext'

// ── framer-motion ni LAZY import qilamiz ─────────────────────
// Sahifa render bo'lgach yuklanadi, birinchi paint ni bloklmaydi
import dynamic from 'next/dynamic'
const MotionDiv = dynamic(
  () => import('framer-motion').then(m => m.motion.div),
  { ssr: false, loading: () => <div /> }
)

export default function Home() {
  const { t, lang } = useLanguage()

  useEffect(() => {
    // Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp
      tg.ready(); tg.expand()
      tg.setHeaderColor('secondary_bg_color')
      tg.setBackgroundColor('secondary_bg_color')
    }
  }, [])

  const features = [
    { icon: Palette, title: t.premiumDesigns, desc: t.premiumDesc },
    { icon: Share2, title: t.instantSharing, desc: t.instantDesc },
    { icon: Globe, title: t.webMobile, desc: t.webMobileDesc },
  ]

  return (
    <>
      {/*
        ── GLOBAL CSS animatsiyalar ──────────────────────────────
        Pure CSS — JS hydration kutmaydi, birinchi frame da ishlaydi
      */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0);    }
        }

        /* Hero elementlari — sahifa yuklangandan keyin darhol */
        .hero-badge   { animation: fadeUp   0.45s ease-out 0.05s both; }
        .hero-h1      { animation: fadeUp   0.55s ease-out 0.12s both; }
        .hero-sub     { animation: fadeIn   0.55s ease-out 0.20s both; }
        .hero-btns    { animation: fadeUp   0.45s ease-out 0.28s both; }

        /* Scroll sections — Intersection Observer bilan */
        .anim-ready   { opacity: 0; }
        .anim-fadeup  { animation: fadeUp    0.55s ease-out both; }
        .anim-scalein { animation: scaleIn   0.65s ease-out both; }
        .anim-left    { animation: slideLeft 0.65s ease-out both; }
        .anim-right   { animation: slideRight 0.65s ease-out both; }

        /* Rasm hover zoom */
        .img-zoom { transition: transform 2s ease; }
        .img-zoom:hover { transform: scale(1.08); }

        /* Feature card hover */
        .feature-card {
          transition: box-shadow 0.4s ease, transform 0.4s ease;
        }
        .feature-card:hover {
          box-shadow: 0 24px 48px rgba(152,160,141,0.12);
          transform: translateY(-4px);
        }
        .feature-card:hover .feature-icon {
          background: #98a08d;
          color: white;
        }
        .feature-icon {
          transition: background 0.4s ease, color 0.4s ease;
        }
      `}</style>

      <div className="w-full min-h-screen bg-[#faf9f6] text-[#5c6352] selection:bg-[#98a08d]/20 overflow-x-hidden">
        <Header />

        {/* ══ HERO ════════════════════════════════════════════ */}
        <section
          className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-6 text-center space-y-6 md:space-y-8 max-w-5xl mx-auto overflow-hidden"
        >
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-[#98a08d]/10 rounded-full text-[#98a08d] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            {t.futureOfInvitations}
          </div>

          {/* H1 */}
          <h1 className="hero-h1 text-4xl md:text-7xl lg:text-8xl font-serif leading-tight">
            {t.heroTitle.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 1 ? 'italic' : ''}> {word} </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="hero-sub text-lg md:text-xl text-[#7c6a5a] max-w-2xl mx-auto font-light leading-relaxed px-4">
            {t.heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/templates" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-2xl px-12 py-7 md:py-8 text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#98a08d]/20 group">
                {t.startCreating}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-2xl px-12 py-7 md:py-8 text-xs md:text-sm font-bold tracking-[0.2em] uppercase border-[#98a08d]/20 text-[#98a08d] hover:bg-[#98a08d] hover:text-white transition-all">
                {t.viewTemplates}
              </Button>
            </Link>
          </div>

          {/* Blur balls */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-[#98a08d]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-[#98a08d]/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ══ FEATURES ════════════════════════════════════════ */}
        <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card anim-ready space-y-4 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-[#98a08d]/5 shadow-sm group"
                data-anim="fadeup"
                data-delay={i * 100}
              >
                <div className="feature-icon w-12 h-12 md:w-14 md:h-14 bg-[#98a08d]/10 rounded-2xl flex items-center justify-center text-[#98a08d]">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-[#5c6352]">{feature.title}</h3>
                <p className="text-[#7c6a5a] leading-relaxed text-sm md:text-base font-light opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TEMPLATES ═══════════════════════════════════════ */}
        <section className="py-20 md:py-32 px-6 bg-white/40 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">

            <div
              className="anim-ready text-center space-y-4"
              data-anim="scalein"
            >
              <h2 className="text-4xl md:text-7xl font-serif text-[#5c6352]">{t.exquisiteTemplates}</h2>
              <p className="text-[#98a08d] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold">{t.chooseStyle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Card 1 */}
              <div className="anim-ready" data-anim="left" data-delay="100">
                <Card className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-0 aspect-[4/3] sm:aspect-video md:aspect-[16/9] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 bg-[#e8e3da]" />
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"
                    className="img-zoom object-cover w-full h-full"
                    alt="Eternal Bond"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-2 md:space-y-3">
                    <h3 className="text-3xl md:text-4xl font-serif text-white">Eternal Bond</h3>
                    <p className="text-white/70 text-[10px] md:text-sm tracking-[0.2em] uppercase font-bold">
                      {lang === 'uz' ? 'Hozirgi sevimli' : lang === 'ru' ? 'Текущий фаворит' : 'The current favorite'}
                    </p>
                    <Link href="/create">
                      <Button variant="secondary" className="rounded-xl md:rounded-2xl mt-4 md:mt-6 px-6 md:px-8 py-5 md:py-6 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20 transition-all font-bold tracking-widest text-xs md:text-sm">
                        {t.customizeNow}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Card 2 */}
              <div className="anim-ready" data-anim="right" data-delay="200">
                <Card className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-0 aspect-[4/3] sm:aspect-video md:aspect-[16/9] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 bg-[#e8e3da]" />
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
                    className="img-zoom object-cover w-full h-full"
                    alt="Pearl & Sage"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-2 md:space-y-3">
                    <h3 className="text-3xl md:text-4xl font-serif text-white">Pearl & Sage</h3>
                    <p className="text-white/70 text-[10px] md:text-sm tracking-[0.2em] uppercase font-bold">Organic & Minimalist</p>
                    <Button disabled variant="secondary" className="rounded-xl md:rounded-2xl mt-4 md:mt-6 px-6 md:px-8 py-5 md:py-6 bg-white/10 backdrop-blur-xl text-white border border-white/10 opacity-50 cursor-not-allowed font-bold tracking-widest text-xs md:text-sm">
                      {t.comingSoon}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer
          className="anim-ready py-20 md:py-32 border-t border-[#98a08d]/10 text-center space-y-10 md:space-y-12 px-6"
          data-anim="fadein"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-[#5c6352] max-w-xl mx-auto leading-tight">{t.startForever}</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {['Instagram', 'Telegram', 'Support'].map((link) => (
              <a key={link} href="#" className="text-[10px] md:text-sm text-[#98a08d] hover:text-[#5c6352] transition-all tracking-[0.3em] uppercase font-bold hover:scale-110">{link}</a>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] md:text-xs text-[#98a08d]/60 font-medium italic">© 2024 3D Invitations • Crafted for your special moments</p>
            <div className="w-12 h-1 bg-[#98a08d]/20 mx-auto rounded-full" />
          </div>
        </footer>
      </div>

      {/* ══ Intersection Observer — scroll animatsiyalar ═════ */}
      <ScrollAnimations />
    </>
  )
}

// ── Pure JS scroll trigger — framer-motion kerak emas ─────────
function ScrollAnimations() {
  useEffect(() => {
    const animMap: Record<string, string> = {
      fadeup: 'anim-fadeup',
      scalein: 'anim-scalein',
      left: 'anim-left',
      right: 'anim-right',
      fadein: 'anim-fadeup',
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const animType = el.dataset.anim || 'fadeup'
          const delay = el.dataset.delay || '0'

          el.style.animationDelay = `${delay}ms`
          el.classList.remove('anim-ready')
          el.classList.add(animMap[animType] || 'anim-fadeup')
          observer.unobserve(el)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.anim-ready').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}