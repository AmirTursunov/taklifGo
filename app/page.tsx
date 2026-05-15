'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, ArrowRight, Share2, Palette, Globe } from 'lucide-react'
import { Header } from '@/components/header'
import { useLanguage } from '@/lib/LanguageContext'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  },
  viewport: { once: true }
}

export default function Home() {
  const { t, lang } = useLanguage()

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      // @ts-ignore
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('secondary_bg_color');
      tg.setBackgroundColor('secondary_bg_color');
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] text-[#5c6352] selection:bg-[#98a08d]/20 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-6 text-center space-y-6 md:space-y-8 max-w-5xl mx-auto overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#98a08d]/10 rounded-full text-[#98a08d] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
        >
          <Sparkles className="w-3 h-3" />
          {t.futureOfInvitations}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl lg:text-8xl font-serif leading-tight"
        >
          {t.heroTitle.split(' ').map((word, i) => (
            <span key={i} className={i === 1 ? 'italic' : ''}> {word} </span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-[#7c6a5a] max-w-2xl mx-auto font-light leading-relaxed px-4"
        >
          {t.heroSubtitle}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
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
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-[#98a08d]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-[#98a08d]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {[
            { icon: Palette, title: t.premiumDesigns, desc: t.premiumDesc },
            { icon: Share2, title: t.instantSharing, desc: t.instantDesc },
            { icon: Globe, title: t.webMobile, desc: t.webMobileDesc }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              className="space-y-4 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-[#98a08d]/5 shadow-sm hover:shadow-2xl hover:shadow-[#98a08d]/10 transition-all duration-500 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#98a08d]/10 rounded-2xl flex items-center justify-center text-[#98a08d] group-hover:bg-[#98a08d] group-hover:text-white transition-all duration-500">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-[#5c6352]">{feature.title}</h3>
              <p className="text-[#7c6a5a] leading-relaxed text-sm md:text-base font-light opacity-80">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-20 md:py-32 px-6 bg-white/40 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-7xl font-serif text-[#5c6352]">{t.exquisiteTemplates}</h2>
            <p className="text-[#98a08d] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold">{t.chooseStyle}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-0 aspect-[4/3] sm:aspect-video md:aspect-[16/9] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2000ms]" alt="Eternal Bond" />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-2 md:space-y-3">
                  <h3 className="text-3xl md:text-4xl font-serif text-white">Eternal Bond</h3>
                  <p className="text-white/70 text-[10px] md:text-sm tracking-[0.2em] uppercase font-bold">{lang === 'uz' ? 'Hozirgi sevimli' : lang === 'ru' ? 'Текущий фаворит' : 'The current favorite'}</p>
                  <Link href="/create">
                    <Button variant="secondary" className="rounded-xl md:rounded-2xl mt-4 md:mt-6 px-6 md:px-8 py-5 md:py-6 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20 transition-all font-bold tracking-widest text-xs md:text-sm">{t.customizeNow}</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-0 aspect-[4/3] sm:aspect-video md:aspect-[16/9] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2000ms]" alt="Pearl & Sage" />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-2 md:space-y-3">
                  <h3 className="text-3xl md:text-4xl font-serif text-white">Pearl & Sage</h3>
                  <p className="text-white/70 text-[10px] md:text-sm tracking-[0.2em] uppercase font-bold">Organic & Minimalist</p>
                  <Button disabled variant="secondary" className="rounded-xl md:rounded-2xl mt-4 md:mt-6 px-6 md:px-8 py-5 md:py-6 bg-white/10 backdrop-blur-xl text-white border border-white/10 opacity-50 cursor-not-allowed font-bold tracking-widest text-xs md:text-sm">{t.comingSoon}</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-20 md:py-32 border-t border-[#98a08d]/10 text-center space-y-10 md:space-y-12 px-6"
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
      </motion.footer>
    </div>
  )
}
