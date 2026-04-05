"use client"

import { motion } from "framer-motion"

export function Masthead() {
  return (
    <header className="relative px-6 pt-6 md:px-12 lg:px-20">
      {/* Top navigation */}
      <motion.nav 
        className="flex items-center justify-between py-4 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-8">
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">
            RACK.
          </span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Techniques</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rules</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gear</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-medium text-primary">Live</span>
          </div>
          <button className="hidden sm:block text-sm px-4 py-2 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
            Get started
          </button>
        </div>
      </motion.nav>

      {/* Hero section */}
      <div className="py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
              Master the
              <br />
              <span className="text-primary">table.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Your complete platform for 8-ball pool mastery. AI-powered analysis, pro techniques, and precision gear.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
                Start analyzing
              </button>
              <button className="px-6 py-3 rounded-full border border-white/10 font-medium hover:bg-white/5 transition-colors">
                Explore techniques
              </button>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div 
            className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { value: "50K+", label: "Active players", sublabel: "worldwide" },
              { value: "98%", label: "Shot accuracy", sublabel: "improvement" },
              { value: "2.1M", label: "Shots analyzed", sublabel: "this month" },
              { value: "6x", label: "Faster", sublabel: "skill growth" }
            ].map((stat, i) => (
              <div key={i} className="bg-background p-6 md:p-8">
                <div className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{stat.label}</span>
                  <br />
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  )
}
