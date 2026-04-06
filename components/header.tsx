import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a] border-b border-white/5 backdrop-blur-md h-24">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo Area - FIXED BLENDING */}
        <Link href="/" className="flex items-center h-full">
          <div className="relative w-48 h-16 mix-blend-screen brightness-110"> 
            <Image 
              src="/images/black logo.png" 
              alt="Pot The Black Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation - FIXED LINKS */}
        <nav className="flex gap-10 text-xs font-black uppercase tracking-[0.2em]">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-green-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/about-us" 
            className="text-white hover:text-green-500 transition-colors duration-200 underline decoration-green-500 underline-offset-8"
          >
            About
          </Link>
          <Link 
            href="/rules" 
            className="text-gray-500 hover:text-green-500 transition-colors duration-200"
          >
            Rules
          </Link>
        </nav>

      </div>
    </header>
  )
}