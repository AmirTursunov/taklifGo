'use client'

import { useEffect, useState } from 'react'
import { EternalBondTemplate } from '@/components/templates/eternal-bond'
import { GoldenNightTemplate } from '@/components/templates/golden-night'
import { NafosatTemplate } from '@/components/templates/nafosat'
import { GoldenWeddingTemplate } from '@/components/templates/golden-wedding'
import { ElegantBirthdayTemplate } from '@/components/templates/elegant-birthday'
import { GirlBirthdayTemplate } from '@/components/templates/girl-birthday'
import { RoyalTealTemplate } from '@/components/templates/royal-teal'
import { CorporateEventTemplate } from '@/components/templates/corporate-event'
import { IslamicWeddingTemplate } from '@/components/templates/islamic-wedding'
import { StoryWeddingTemplate } from '@/components/templates/story-wedding'
import { DateInvitationTemplate } from '@/components/templates/date-invitation'
import ClassicWeddingTemplate from '@/components/templates/classic-wedding'
import BirthdayGreeting from '@/components/templates/birthday-greeting'
import SecretBirthday from '@/components/templates/secret-birthday'
import { Loader2 } from 'lucide-react'

export default function InvitationClient({ data, id }: { data: any, id: string }) {
  const [showNotice, setShowNotice] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 5000)
    
    // Increment views
    const updateViews = async () => {
      if (data.status === 'active') {
        try {
          await fetch('/api/stats/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
        } catch (e) {
          console.error("View increment failed", e);
        }
      }
    }
    updateViews();

    // Handle Image Download
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('download') === 'true') {
      setShowNotice(false); // hide notice in screenshot
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => {
        setTimeout(() => {
          (window as any).html2canvas(document.body, { 
            useCORS: true, 
            scale: 2, 
            backgroundColor: null 
          }).then((canvas: any) => {
            const url = canvas.toDataURL('image/jpeg', 0.9);
            setDownloadUrl(url); // Show it to the user

            try {
              const link = document.createElement('a');
              link.download = `taklifnoma-${id}.jpg`;
              link.href = url;
              link.click();
              // Do not automatically close window so they can manually save if click() fails
            } catch (err) {
              console.error("Auto download failed", err);
            }
          });
        }, 1500); // Wait for fonts and images to fully render
      };
      document.body.appendChild(script);
    }
    
    return () => clearTimeout(timer)
  }, [id, data.status])

  const noticeText = {
    uz: "Ushbu havola faqat ko'rish uchun mo'ljallangan.",
    ru: "Эта ссылка предназначена только для просмотра.",
    en: "This link is for viewing purposes only."
  }

  if (downloadUrl) {
    return (
      <div className="fixed inset-0 bg-[#f4f4f5] z-[999] flex flex-col items-center justify-center p-6">
        <h3 className="font-bold text-center mb-4 text-[#5c6352] text-xl">Tayyor!</h3>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6 border-4 border-white max-w-sm w-full">
          <img src={downloadUrl} alt="Taklifnoma" className="w-full h-auto object-contain max-h-[60vh]" />
        </div>
        <p className="text-sm text-center text-[#98a08d] mb-6 max-w-xs font-medium">
          Rasm ustiga barmog'ingizni uzoq bosib turing va <b>"Rasmni saqlash" (Save Image)</b> orqali telefoningizga yuklab oling.
        </p>
        <button 
          onClick={() => window.close()} 
          className="bg-[#98a08d] hover:bg-[#868d7c] text-white px-8 py-3 rounded-full font-bold transition-colors"
        >
          Yopish
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative">
      {data.templateId === "nafosat" ? (
        <NafosatTemplate data={data} />
      ) : data.templateId === "girl-birthday" ? (
        <GirlBirthdayTemplate data={{
          ...data,
          name: data.names,
          time: data.time || "19:00",
          age: data.age || "21"
        }} />
      ) : data.templateId === "elegant-birthday" ? (
        <ElegantBirthdayTemplate data={{
          ...data,
          name: data.names,
          time: data.time || "19:00",
          age: data.age || "30"
        }} />
      ) : data.templateId === "golden-wedding" ? (
        <GoldenWeddingTemplate data={data} />
      ) : data.templateId === "golden-night" ? (
        <GoldenNightTemplate data={data} />
      ) : data.templateId === "royal-teal" ? (
        <RoyalTealTemplate data={data} />
      ) : data.templateId === "islamic-wedding" ? (
        <IslamicWeddingTemplate data={data} />
      ) : data.templateId === "story-wedding" ? (
        <StoryWeddingTemplate data={data} />
      ) : data.templateId === "date-invitation" ? (
        <DateInvitationTemplate data={data} />
      ) : data.templateId === "corporate-event" ? (
        <CorporateEventTemplate data={data} />
      ) : data.templateId === "classic-wedding" ? (
        <ClassicWeddingTemplate data={data} />
      ) : data.templateId === "birthday-greeting" ? (
        <BirthdayGreeting data={data} />
      ) : data.templateId === "secret-birthday" ? (
        <SecretBirthday data={data} />
      ) : (
        <EternalBondTemplate data={data} />
      )}
    </main>
  )
}
