'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Menu, X } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkStyle = (path: string) => 
    pathname === path 
      ? "text-white border-b-2 border-green-400 pb-1 px-1 whitespace-nowrap" 
      : "text-white/80 hover:text-green-400 transition-colors pb-1 px-1 whitespace-nowrap border-b-2 border-transparent hover:border-green-400/40"

  const mobileLinkStyle = (path: string) =>
    pathname === path
      ? "text-white border-l-2 border-green-400 pl-4 py-3 block"
      : "text-white/80 hover:text-green-400 transition-colors pl-4 py-3 block border-l-2 border-transparent"

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMenuOpen(false)
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pool', label: 'Pool' },
    { href: '/snooker', label: 'Snooker' },
    { href: '/9-ball', label: '9-Ball' },
    { href: '/rules', label: 'Rules' },
    { href: '/news', label: 'News' },
    { href: '/about-us', label: 'About' },
  ]

  return (
    <header className="w-full z-50 font-sans sticky top-0">
      <div 
        className={`relative px-4 md:px-6 shadow-inner border-b-4 border-[#3d2b1f] bg-[#004d33] transition-all duration-300 ${
          scrolled ? "pt-4 pb-10" : "pt-8 pb-16"
        }`}
        style={{
          background: "radial-gradient(circle at center, #007a53 0%, #004d33 70%, #002e1f 100%)"
        }}
      >
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/felt.png')` }} 
        />

        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Mobile menu toggle — top right */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden absolute top-0 right-4 text-white p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Centered Logo / Site Name — shrinks slightly on scroll */}
          <div className={`flex flex-col items-center transition-all duration-300 ${scrolled ? "mb-3 md:mb-4" : "mb-6 md:mb-8"}`}>
            <Link 
              href="/" 
              className={`relative transition-all duration-300 hover:scale-105 ${
                scrolled ? "w-14 h-14 md:w-20 md:h-20" : "w-24 h-24 md:w-40 md:h-40"
              }`}
            > 
              <Image 
                src="/headerlogo.png" 
                alt="Pot The Black Logo"
                fill
                className="object-contain" 
                priority
              />
            </Link>
            <span className={`text-white font-black italic uppercase tracking-tighter mt-2 transition-all duration-300 ${
              scrolled ? "text-base md:text-lg" : "text-xl md:text-2xl"
            }`}>
              Pot The Black
            </span>
          </div>

          {/* Desktop Navigation — font size bumped from 11px to 13px, more breathing room */}
          <nav className="hidden md:block w-full max-w-3xl">
            <div className="flex items-center justify-center gap-8 lg:gap-10 text-[13px] font-black uppercase tracking-[0.15em] text-center">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Navigation — dropdown panel, only rendered on small screens */}
          {menuOpen && (
            <nav className="md:hidden w-full max-w-sm mt-6 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={mobileLinkStyle(link.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-[13px] font-black uppercase tracking-[0.15em]">{link.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* The "Floating" Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-10"
        >
          <div className="bg-[#1a1a1a] p-1.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-2 border border-white/10">
            <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-2.5">
              <input 
                type="text" 
                placeholder="Search cues, tips, or masterclasses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-black placeholder:text-gray-400 font-medium"
              />
              <button type="submit" className="text-[#004d33] hover:scale-110 transition-transform">
                <Search size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="h-4 w-full" />
    </header>
  )
}