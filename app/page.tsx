'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, ArrowRight, Share2, Palette, Globe, Gift, Wallet, Users } from 'lucide-react'
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
  const [invitations, setInvitations] = useState<any[]>([])

  useEffect(() => {
    async function fetchLatest() {
      try {
        const q = query(collection(db, "invitations"), orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          const category = d.category || "wedding";
          let title = d.names || "Taklifnoma";
          if (category === "business") {
            title = d.eventTitle || d.companyName || d.names || "Biznes Tadbiri";
          } else if (category === "birthday") {
            title = d.names ? `${d.names} Tug'ilgan kuni` : "Tug'ilgan kun";
          } else if (category === "farewell") {
            title = d.names ? `${d.names} Qiz uzatish marosimi` : "Qiz uzatish";
          }

          let catLabel = "To'y taklifnomasi";
          if (category === "business") catLabel = "Biznes tadbiri";
          if (category === "birthday") catLabel = "Tug'ilgan kun";
          if (category === "farewell") catLabel = "Qiz uzatish";

          return {
            id: doc.id,
            slug: doc.id,
            title: title,
            category: catLabel,
            price: "",
            image: (d.images && d.images[0]) || d.imageUrl || "https://taklif-go.vercel.app/placeholder-logo.png"
          }
        });
        setInvitations(data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    }
    fetchLatest();
  }, [])

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
      <section className="relative pt-36 md:pt-48 pb-20 md:pb-32 px-6 text-center overflow-hidden min-h-[90vh] flex flex-col justify-center items-center w-full">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury background"
            fill
            priority
            className="object-cover opacity-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/10 via-[#faf9f6]/40 to-[#faf9f6] pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center space-y-8 md:space-y-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-[#98a08d]/20 rounded-full text-[#7a8270] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-[#d4a373]" />
            {t.futureOfInvitations}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.2] md:leading-tight text-[#3a4030] max-w-5xl mx-auto [text-wrap:balance]"
          >
            {t.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'italic text-[#7a8270]' : ''}> {word} </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative z-10 text-base md:text-xl text-[#7c6a5a] max-w-2xl mx-auto font-light leading-relaxed px-2 md:px-6"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 w-full px-4 sm:px-0"
          >
            <Link href="/templates" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#7a8270] to-[#98a08d] hover:from-[#6a7260] hover:to-[#8a927d] text-white rounded-full px-10 py-7 md:py-8 text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#98a08d]/30 hover:shadow-2xl hover:scale-105 group border-0">
                {t.startCreating}
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard?tab=referrals" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-10 py-7 md:py-8 text-xs md:text-sm font-bold tracking-[0.2em] uppercase border-2 border-[#98a08d]/20 text-[#6a7060] bg-white/50 backdrop-blur-md hover:bg-[#98a08d] hover:text-white transition-all hover:scale-105 shadow-sm hover:shadow-xl">
                {t.viewTemplates}
              </Button>
            </Link>
          </motion.div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-1/3 left-[-10%] w-64 h-64 bg-[#d4a373]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-2/3 right-[-10%] w-72 h-72 bg-[#98a08d]/10 rounded-full blur-[80px] pointer-events-none" />
        </div>
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


      {/* created invitations */}
      {/* <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h1 className="text-3xl md:text-5xl font-serif text-[#5c6352] max-w-xl mx-auto leading-tight">Yaratilgan Taklifnomalar</h1>
          <motion.div initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {invitations.map((invitation) => (
              <Link key={invitation.id} href={`/invitation/${invitation.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img src={invitation.image} alt={invitation.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{invitation.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{invitation.category}</span>
                      <span>{invitation.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section> */}
      {/* Referal Section */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-10 md:p-16 shadow-xl border border-[#98a08d]/10 text-center"
        >
          <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-[#5c6352] max-w-xl mx-auto leading-tight">
            Do'stlaringizni taklif qiling, <br /><span className="text-[#98a08d]">Bonus oling</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[#7b8272] mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Taklif-Go saytini do'stlaringizga tavsiya qiling. Ular taklifnoma sotib olganida, sizning hisobingizga <b>5,000 UZS</b> bonus tushadi. Har 5-chi taklif uchun esa qo'shimcha bonus yoziladi!
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-12">
            <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#98a08d]/10 text-[#98a08d] flex items-center justify-center">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#5c6352]">1. Havola ulashing</h3>
              <p className="text-sm text-[#7b8272] max-w-[200px]">Shaxsiy referal havolangizni do'stlaringiz bilan ulashing</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#5c6352]">2. Buyurtma qilsin</h3>
              <p className="text-sm text-[#7b8272] max-w-[200px]">Do'stingiz sizning havolangiz orqali saytga kirib buyurtma beradi</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#5c6352]">3. Bonus oling</h3>
              <p className="text-sm text-[#7b8272] max-w-[200px]">Har bir muvaffaqiyatli buyurtma uchun balansingizga pul tushadi</p>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp}>
            <Link href="/dashboard?tab=referrals" className="inline-flex items-center gap-2 bg-[#98a08d] text-white px-8 py-4 rounded-full font-bold hover:bg-[#868d7c] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Gift className="w-5 h-5" />
              Shaxsiy havolani olish
            </Link>
          </motion.div>
        </motion.div>
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
          <p className="text-[10px] md:text-xs text-[#98a08d]/60 font-medium italic">© 2024 Modern Invitations • Crafted for your special moments</p>
          <div className="w-12 h-1 bg-[#98a08d]/20 mx-auto rounded-full" />
        </div>
      </motion.footer>
    </div>
  )
}
