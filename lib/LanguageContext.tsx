'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, translations } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof translations.uz
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('uz')

  // Load language from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language
    if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
      setLang(saved)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const value = {
    lang,
    setLang: handleSetLang,
    t: translations[lang]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
