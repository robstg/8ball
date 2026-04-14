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
      {/* Rob's Note: Changed bg-slate-950 to bg-white and text-slate-50 to text-slate-900. 
          This makes "Pot the Black" feel fresh, modern, and readable. 
      */}
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-white text-slate-900`}>
        
        {!isStudio && <Header />}
        
        {/* Added a very light slate tint to the background wrapper for a clean, pro look */}
        <div className={!isStudio ? "pt-20 min-h-screen bg-slate-50/50" : "h-screen overflow-hidden"}>
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