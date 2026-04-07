'use client' // Added this to allow us to check the URL

import { usePathname } from 'next/navigation'
import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        
        {/* Only show Header if NOT on the studio page */}
        {!isStudio && <Header />}
        
        {/* Only add padding if NOT on the studio page */}
        <div className={!isStudio ? "pt-20 min-h-screen" : "min-h-screen"}>
          {children}
        </div>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}