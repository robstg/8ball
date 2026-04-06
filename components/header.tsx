import Link from 'next/link'
import Image from 'next/image' // Don't forget to import this

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center">
          <div className="relative w-32 h-12 md:w-40 md:h-14"> 
            <Image 
              src="/images/black logo.png" 
              alt="Pot The Black Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about-us" className="hover:text-white transition-colors">About</Link>
          <Link href="/rules" className="hover:text-white transition-colors">Rules</Link>
        </nav>
      </div>
    </header>
  )
}