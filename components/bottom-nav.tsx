"use client"

import { motion } from "framer-motion"
import { Scale, BookOpen, Microscope, Info } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navItems = [
  { id: "masterclass", label: "Masterclass", icon: BookOpen, href: "/articles" },
  { id: "rules", label: "Rules", icon: Scale, href: "/rules" },
  { id: "gearlab", label: "Gear Lab", icon: Microscope, href: "/guides" },
  { id: "brand", label: "Brand", icon: Info, href: "/about" }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-4 pointer-events-none">
      <motion.div 
        className="max-w-sm mx-auto rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-1.5 pointer-events-auto shadow-2xl shadow-black/40"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center">
          {navItems.map((item) => {
            // Check if the current URL starts with the item's href
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "text-emerald-400" 
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="text-[9px] font-black relative z-10 uppercase tracking-[0.1em]">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </nav>
  )
}