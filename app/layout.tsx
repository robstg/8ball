'use client'

import { usePathname } from 'next/navigation'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from "@/components/header" // We are putting this back!
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        
        {/* 1. Show Header on every page EXCEPT the Sanity Studio */}
        {!isStudio && <Header />}
        
        {/* 2. Add pt-20 ONLY if we aren't in the Studio. 
               This stops the "Double Header" and keeps the Publish button visible. */}
        <div className={!isStudio ? "pt-20 min-h-screen" : "h-screen overflow-hidden"}>
          {children}
        </div>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}