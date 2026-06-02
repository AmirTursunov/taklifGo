import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Taklif Time - Interaktiv Taklifnomalar',
  description: 'Barcha turdagi marosimlar uchun zamonaviy taklifnomalar yaratish platformasi',
  generator: 'Taklif Time',

}

import Script from 'next/script'
import { LanguageProvider } from '@/lib/LanguageContext'
import { AuthProvider } from '@/lib/AuthContext'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { ReferralTracker } from '@/components/ReferralTracker'
import { MaintenanceGuard } from '@/components/MaintenanceGuard'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { 
  cinzel, cormorant, dancingScript, montserrat, quicksand, 
  greatVibes, lato, inter, spaceGrotesk, lilitaOne, pacifico, 
  playfair, nunito, amiri 
} from '@/lib/fonts'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVars = `${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorant.variable} ${dancingScript.variable} ${montserrat.variable} ${quicksand.variable} ${greatVibes.variable} ${lato.variable} ${inter.variable} ${spaceGrotesk.variable} ${lilitaOne.variable} ${pacifico.variable} ${playfair.variable} ${nunito.variable} ${amiri.variable}`
  return (
    <html lang="en" className={`${fontVars} bg-background`} suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
        <NextAuthProvider>
          <AuthProvider>
            <LanguageProvider>
              <MaintenanceGuard>
                {children}
              </MaintenanceGuard>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </LanguageProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
