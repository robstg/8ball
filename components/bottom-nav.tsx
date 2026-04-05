"use client"

import { motion } from "framer-motion"
import { Target, Book, BarChart3, ShoppingBag } from "lucide-react"
import { useState } from "react"

const navItems = [
  { id: "drills", label: "Drills", icon: Target },
  { id: "rules", label: "Rules", icon: Book },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "shop", label: "Shop", icon: ShoppingBag }
]

export function BottomNav() {
  const [active, setActive] = useState("drills")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-4 pointer-events-none">
      <motion.div 
        className="max-w-sm mx-auto rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl p-1.5 pointer-events-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-colors ${
                active === item.id 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10 uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </nav>
  )
}
