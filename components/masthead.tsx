"use client"

import { motion } from "framer-motion"
import Link from 'next/link'

export function Masthead({ latestPost }: { latestPost: any }) {
  return (
    // Increased pt-32 to give room for the new Green Header
    <section className="relative px-6 pt-32 md:pt-40 md:px-12 lg:px-20 pb-20">
      
      {/* 1. TOP NAVIGATION REMOVED 
          Your new 'Header' component now handles this globally.
      */}

      {/* Hero section - DYNAMIC DATA START */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* The "New Tip" indicator moved here for a pro look */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Latest Masterclass</span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.85] uppercase italic">
              {latestPost?.title || "Master the table."}
            </h1>
            
            <p className="mt-8 text-lg text-muted-foreground max-w-md leading-relaxed">
              {latestPost?.excerpt || "Your complete platform for 8-ball pool mastery. Expert analysis and pro techniques."}
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Link 
                href={latestPost?.slug ? `/articles/${latestPost.slug}` : "/articles"} 
                className="px-10 py-5 rounded-full bg-green-500 text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                Read Masterclass
              </Link>
              <Link href="/about-us" className="px-10 py-5 rounded-full border border-white/10 font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div 
            className="grid grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { value: "100%", label: "Pro techniques", sublabel: "vetted" },
              { value: "8-Ball", label: "Specialized", sublabel: "strategy" },
              { value: "Daily", label: "New content", sublabel: "Auckland scene" },
              { value: "Expert", label: "Gear reviews", sublabel: "unbiased" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0a]/50 backdrop-blur-md p-8 md:p-10 border border-white/5">
                <div className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-black tracking-tighter text-white italic">
                  {stat.value}
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="text-green-500 font-black">{stat.label}</span>
                  <br />
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}