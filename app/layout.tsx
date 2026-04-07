'use client'

import { usePathname } from 'next/navigation'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
        
        {/* WE REMOVED <Header /> FROM HERE. 
            The "RACK" header is already inside your page.tsx, so you don't need this one. */}
        
        <div className={!isStudio ? "min-h-screen" : "h-screen overflow-hidden"}>
          {children}
        </div>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}