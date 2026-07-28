"use client"

import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export function Masthead({ latestPost }: { latestPost: any }) {
  // If no post is found, we don't show a Masthead. 
  if (!latestPost) return null;

  // The headline was a flat text-4xl/6xl/7xl regardless of title length.
  // Fine for a short punchy title, but a long title (this week's is ~130
  // characters) wraps to 5-6 lines at that size and swamps the whole fold.
  // Step the size down as length increases so short titles stay bold and
  // long ones stay balanced against the excerpt/image beside them.
  const getHeadlineSize = (title: string) => {
    const len = title?.length || 0;
    if (len <= 45) return "text-4xl md:text-6xl lg:text-7xl";
    if (len <= 75) return "text-3xl md:text-5xl lg:text-6xl";
    if (len <= 110) return "text-2xl md:text-4xl lg:text-5xl";
    return "text-xl md:text-3xl lg:text-4xl";
  };

  const publishedDate = latestPost._createdAt
    ? new Date(latestPost._createdAt).toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    /* THE FIX: Pulled mobile padding back to pt-16 and desktop to md:pt-20 to close the dead space */

<section className="relative px-6 pt-12 md:pt-16 md:px-12 lg:px-20 pb-16 bg-slate-50 -mt-10 pt-[calc(3rem+40px)] z-0">
      
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
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Latest Post</span>
              {publishedDate && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  · {publishedDate}
                </span>
              )}
            </div>

            {/* Main Headline — now a clickable link straight to the article */}
            <Link href={`/articles/${latestPost.slug}`} className="group/headline">
              <h1 className={`font-[family-name:var(--font-heading)] ${getHeadlineSize(latestPost.title)} font-bold tracking-tight leading-[0.85] uppercase italic text-slate-900 transition-colors duration-300 group-hover/headline:text-emerald-600`}>
                {latestPost.title}
              </h1>
            </Link>
            
            {/* Excerpt Text */}
            <p className="mt-8 text-lg text-slate-500 max-w-md leading-relaxed">
              {latestPost.excerpt || "News, tips and gear talk for pool, snooker and Heyball players."}
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

          {/* 2. Right Column (Cinematic 16:9 Cover Photo) — also clickable now */}
          <Link
            href={`/articles/${latestPost.slug}`}
            className="w-full block relative aspect-video rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white group"
          >
            <motion.div
              className="w-full h-full relative"
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
                     Pot The Black
                   </span>
                </div>
              )}
              
              {/* Subtle Lighting Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />

              {/* Hover affordance so it reads as clickable, not just decorative */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Read the Article →
                </span>
              </div>
            </motion.div>
          </Link>
          
        </div>
      </div>
    </section>
  )
}