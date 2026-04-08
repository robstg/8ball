'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, ShoppingCart, User, Phone } from 'lucide-react' // Run: npm install lucide-react

export function Header() {
  const pathname = usePathname()

  const linkStyle = (path: string) => 
    pathname === path 
      ? "text-white border-b-2 border-white pb-1" 
      : "text-white/70 hover:text-white transition-colors pb-1"

  return (
    <header className="w-full z-50 font-sans">
      {/* 1. Top Utility Bar (White) */}
      <div className="bg-white py-2 px-6 border-b flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#801010]">
        <div className="flex items-center gap-2">
          <Phone size={12} />
          <span>Questions? Call 0800-POT-BLACK</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/account" className="hover:opacity-70 flex items-center gap-1">
            <User size={12} /> My Account
          </Link>
          <span className="text-gray-200">|</span>
          <Link href="/wishlist" className="hover:opacity-70">Wishlist</Link>
        </div>
      </div>

      {/* 2. Main Brand Bar (Red Gradient) */}
      <div className="bg-gradient-to-r from-[#600a0a] via-[#801010] to-[#600a0a] pt-8 pb-14 px-6 relative shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Logo Area */}
          <Link href="/" className="relative w-56 h-14 transition-transform hover:scale-105"> 
            <Image 
              src="/images/black%20logo.png" // Tip: If this is dark, add "invert" to className
              alt="Pot The Black Logo"
              fill
              className="object-contain object-left brightness-0 invert" 
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex gap-8 text-[11px] font-black uppercase tracking-[0.15em]">
            <Link href="/" className={linkStyle('/')}>Home</Link>
            <Link href="/pool-cues" className={linkStyle('/pool-cues')}>Pool Cues</Link>
            <Link href="/articles" className={linkStyle('/articles')}>Masterclasses</Link>
            <Link href="/about-us" className={linkStyle('/about-us')}>About</Link>
            <Link href="/clearance" className="text-yellow-400 hover:text-yellow-300 italic">Clearance</Link>
          </nav>
        </div>

        {/* 3. The "Floating" Search Bar */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-10">
          <div className="bg-[#1a1a1a] p-1.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 border border-white/10">
            <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-2.5">
              <input 
                type="text" 
                placeholder="Search cues, tips, or videos..." 
                className="w-full text-sm outline-none text-black placeholder:text-gray-400 font-medium"
              />
              <button className="text-[#801010] hover:scale-110 transition-transform">
                <Search size={20} strokeWidth={3} />
              </button>
            </div>
            
            {/* Cart Button */}
            <button className="px-4 py-2 text-white hover:text-green-500 transition-colors relative group">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-green-500 text-[9px] text-black font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. Bottom Spacer */}
      {/* This ensures your page content doesn't get covered by the floating search bar */}
      <div className="h-10 w-full" />
    </header>
  )
}