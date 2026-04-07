"use client"

import { motion } from "framer-motion"
import Link from 'next/link'

// We add { latestPost } here so the component can use your Sanity data
export function Masthead({ latestPost }: { latestPost: any }) {
  return (
    <header className="relative px-6 pt-6 md:px-12 lg:px-20">
      {/* Top navigation - Cleaned up to match your brand */}
      <motion.nav 
        className="flex items-center justify-between py-4 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-8">
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight uppercase italic">
            Pot The Black.
          </span>
          <div className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-widest">
            <Link href="/category/pool" className="text-muted-foreground hover:text-primary transition-colors">Pool</Link>
            <Link href="/category/snooker" className="text-muted-foreground hover:text-primary transition-colors">Snooker</Link>
            <Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">Masterclasses</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-medium text-primary uppercase tracking-tighter">New Tip Live</span>
          </div>
        </div>
      </motion.nav>

      {/* Hero section - DYNAMIC DATA START */}
      <div className="py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] uppercase italic">
              {/* This shows your Sanity Title, or a fallback if it's empty */}
              {latestPost?.title || "Master the table."}
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              {/* This shows your Sanity excerpt/description */}
              {latestPost?.excerpt || "Your complete platform for 8-ball pool mastery. Expert analysis and pro techniques."}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href={latestPost?.slug ? `/post/${latestPost.slug}` : "/articles"} 
                className="px-8 py-4 rounded-full bg-primary text-background font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Read Masterclass
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-full border border-white/10 font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Stats grid - Left this as is for the "Pro" look, but updated labels */}
          <motion.div 
            className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { value: "100%", label: "Pro techniques", sublabel: "vetted" },
              { value: "8-Ball", label: "Specialized", sublabel: "strategy" },
              { value: "Daily", label: "New content", sublabel: "Auckland scene" },
              { value: "Expert", label: "Gear reviews", sublabel: "unbiased" }
            ].map((stat, i) => (
              <div key={i} className="bg-background/50 backdrop-blur-sm p-6 md:p-8 border border-white/5">
                <div className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <span className="text-foreground font-black">{stat.label}</span>
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