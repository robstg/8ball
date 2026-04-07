'use client' // Add this at the top to allow the "usePathname" hook

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation' // Hook to find current URL

export function Header() {
  const pathname = usePathname() // This gets the current path (e.g., "/about-us")

  // Helper function to apply styles if the link is active
  const linkStyle = (path: string) => 
    pathname === path 
      ? "text-white underline decoration-green-500 underline-offset-8 decoration-2" 
      : "text-gray-500 hover:text-green-500 transition-colors"

  return (
    <header className="fixed top-0 w-full z-50 bg-black border-b border-white/5 backdrop-blur-md h-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center h-full">
          <div className="relative w-48 h-16"> 
            <Image 
             src="/images/black%20logo.png"
              alt="Pot The Black Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation - Now Dynamic */}
        <nav className="flex gap-10 text-xs font-black uppercase tracking-[0.2em]">
          <Link href="/" className={linkStyle('/')}>
            Home
          </Link>
          <Link href="/about-us" className={linkStyle('/about-us')}>
            About
          </Link>
         </nav>

      </div>
    </header>
  )
}