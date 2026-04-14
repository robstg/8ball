"use client"

import { motion } from "framer-motion"
import Link from 'next/link'

export function Masthead({ latestPost }: { latestPost: any }) {
  return (
    /* Rob's Note: Removed dark relative positioning, letting it sit on the layout's bg-slate-50 */
    <section className="relative px-6 pt-32 md:pt-40 md:px-12 lg:px-20 pb-20">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Latest Masterclass</span>
            </div>

            {/* Title: Now sharp Slate-900 */}
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.85] uppercase italic text-slate-900">
              {latestPost?.title || "Master the table."}
            </h1>
            
            <p className="mt-8 text-lg text-slate-500 max-w-md leading-relaxed">
              {latestPost?.excerpt || "Your complete platform for 8-ball pool mastery. Expert analysis and pro techniques."}
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Link 
                href={latestPost?.slug ? `/articles/${latestPost.slug}` : "/articles"} 
                className="px-10 py-5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
              >
                Read Masterclass
              </Link>
              <Link href="/about-us" className="px-10 py-5 rounded-full border border-slate-200 text-slate-900 font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Stats grid: Flipped to Light Mode */}
          <motion.div 
            className="grid grid-cols-2 gap-px bg-slate-200 rounded-3xl overflow-hidden shadow-xl border border-slate-200"
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
              <div key={i} className="bg-white p-8 md:p-10 hover:bg-slate-50 transition-colors">
                <div className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-black tracking-tighter text-slate-900 italic">
                  {stat.value}
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <span className="text-emerald-600 font-black">{stat.label}</span>
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