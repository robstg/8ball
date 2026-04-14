'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation' // Added useRouter
import { useState } from 'react' // Added useState for the search input
import { Search, User, Phone } from 'lucide-react' // Removed ShoppingCart

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('') // State to hold search text

  const linkStyle = (path: string) => 
    pathname === path 
      ? "text-white border-b-2 border-green-400 pb-1" 
      : "text-white/80 hover:text-green-400 transition-colors pb-1"

  // This handles the actual search redirection
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="w-full z-50 font-sans">
      {/* 1. Top Utility Bar (Pure White) */}
      <div className="bg-white py-2 px-6 border-b flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#004d33]">
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

      {/* 2. Main Brand Bar (Tournament Green Felt Style) */}
      <div 
        className="relative pt-6 pb-16 px-6 shadow-inner border-b-4 border-[#3d2b1f]" 
        style={{
          background: "radial-gradient(circle at center, #007a53 0%, #004d33 70%, #002e1f 100%)"
        }}
      >
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/felt.png')` }} 
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <Link href="/" className="relative w-32 h-32 md:w-40 md:h-40 -my-4 transition-transform hover:scale-105"> 
            <Image 
              src="/headerlogo.png" 
              alt="Pot The Black Logo"
              fill
              className="object-contain" 
              priority
            />
          </Link>

          <nav className="flex gap-8 text-[11px] font-black uppercase tracking-[0.15em]">
            <Link href="/" className={linkStyle('/')}>Home</Link>
            <Link href="/pool" className={linkStyle('/pool')}>Pool</Link>
            <Link href="/snooker" className={linkStyle('/snooker')}>Snooker</Link>
            <Link href="/about-us" className={linkStyle('/about-us')}>About</Link>
            <Link href="/clearance" className="text-yellow-400 hover:text-yellow-300 italic">Clearance</Link>
          </nav>
        </div>

        {/* 3. The "Floating" Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-10"
        >
          <div className="bg-[#1a1a1a] p-1.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-2 border border-white/10">
            <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-2.5">
              <input 
                type="text" 
                placeholder="Search cues, tips, or videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-black placeholder:text-gray-400 font-medium"
              />
              <button 
                type="submit"
                className="text-[#004d33] hover:scale-110 transition-transform"
              >
                <Search size={20} strokeWidth={3} />
              </button>
            </div>
            {/* Shopping Cart button removed */}
          </div>
        </form>
      </div>
      
      <div className="h-2 w-full" />
    </header>
  )
}