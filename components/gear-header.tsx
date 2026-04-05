"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"

export function GearHeader() {
  return (
    <header className="px-6 pt-6 md:px-12 lg:px-20">
      {/* Top navigation */}
      <motion.nav 
        className="flex items-center justify-between py-4 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight hover:text-primary transition-colors">
            RACK.
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/gear" className="text-sm text-foreground font-medium">Gear</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rules</a>
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

      {/* Page header */}
      <div className="py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Pro <span className="text-primary">Gear</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Curated selection of tournament-grade equipment. From precision cues to premium accessories.
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
