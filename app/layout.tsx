'use client'

import { usePathname } from 'next/navigation'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google' // Optimized GA
import { Header } from "@/components/header"
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-950 text-slate-50`}>
        
        {!isStudio && <Header />}
        
        <div className={!isStudio ? "pt-20 min-h-screen" : "h-screen overflow-hidden"}>
          {children}
        </div>

        {/* Vercel Speed Insights/Analytics */}
        {process.env.NODE_ENV === 'production' && <Analytics />}

        {/* Google Analytics - Only runs on client, perfectly timed */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}