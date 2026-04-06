import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Area - Merged with Header Background */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-40 h-14 transition-transform duration-300 group-hover:scale-105"> 
            <Image 
              src="/images/black logo.png" 
              alt="Pot The Black Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links - Modern Heavy Style */}
        <nav className="flex gap-10 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
          <Link 
            href="/" 
            className="hover:text-green-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="hover:text-green-500 transition-colors duration-200 text-white"
          >
            About
          </Link>
          <Link 
            href="/rules" 
            className="hover:text-green-500 transition-colors duration-200"
          >
            Rules
          </Link>
        </nav>

      </div>
    </header>
  )
}