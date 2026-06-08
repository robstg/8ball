"use client"

import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export function Masthead({ latestPost }: { latestPost: any }) {
  // If no post is found, we don't show a Masthead. 
  if (!latestPost) return null;

  return (
    /* THE FIX: Pulled mobile padding back to pt-16 and desktop to md:pt-20 to close the dead space */
    <section className="relative px-6 pt-16 md:pt-20 md:px-12 lg:px-20 pb-16 bg-slate-50">
      
      <div className="max-w-7xl mx-auto">
        {/* flex-col-reverse ensures the image is ON TOP for mobile users */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* 1. Left Column (Text & Buttons) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Latest Masterclass</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.85] uppercase italic text-slate-900">
              {latestPost.title}
            </h1>
            
            {/* Excerpt Text */}
            <p className="mt-8 text-lg text-slate-500 max-w-md leading-relaxed">
              {latestPost.excerpt || "Advanced technical analysis and pro strategies for the modern player."}
            </p>
            
            {/* Navigation Buttons */}
            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link 
                href={`/articles/${latestPost.slug}`} 
                className="px-10 py-5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
              >
                Read Article
              </Link>
              <Link href="/about-us" className="px-10 py-5 rounded-full border border-slate-200 text-slate-900 font-black uppercase tracking-widest hover:bg-white/50 transition-colors">
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* 2. Right Column (Cinematic 16:9 Cover Photo) */}
          <motion.div 
            className="w-full relative aspect-video rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {latestPost.mainImage ? (
              <Image 
                src={urlFor(latestPost.mainImage).url()} 
                alt={latestPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority 
                sizes="(max-w-768px) 100vw, 50vw" 
              />
            ) : (
              <div className="w-full h-full bg-[#004d33] flex flex-col items-center justify-center p-12 text-center">
                 <span className="text-white font-black uppercase tracking-widest text-xs italic">
                   Pot The Black Archive
                 </span>
              </div>
            )}
            
            {/* Subtle Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}