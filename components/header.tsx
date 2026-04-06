import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic text-green-500">
          Pot The Black
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about-us" className="hover:text-white transition-colors">About</Link>
          <Link href="/rules" className="hover:text-white transition-colors">Rules</Link>
        </nav>
      </div>
    </header>
  )
}