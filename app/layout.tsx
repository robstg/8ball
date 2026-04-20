'use client'

import { usePathname } from 'next/navigation'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Header } from "@/components/header"
import Script from 'next/script' // 1. Added this import
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        
        {/* 2. Google AdSense Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3633851595010615"
          crossOrigin="anonymous"
          strategy="afterInteractive" // Loads after the page is interactive for better performance
        />
        
        {!isStudio && <Header />}
        
        {/* We keep the inner content white so it pops off the faint slate background */}
        <div className={!isStudio ? "pt-20 min-h-screen bg-white shadow-sm max-w-[1600px] mx-auto" : "h-screen overflow-hidden"}>
          {children}
        </div>

        {process.env.NODE_ENV === 'production' && <Analytics />}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}