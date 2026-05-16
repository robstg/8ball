"use client"

import { motion } from "framer-motion"
import { ArrowRight, Microscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

interface GearItem {
  title: string
  slug: string
  mainImage: any
  categoryTitle?: string
  score?: string
  badge?: string
  snippet?: string
}

export function GearShowcase({ items }: { items: GearItem[] }) {
  // If the lab is empty, we don't show the table
  if (!items || items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-20 py-24 bg-white border-t border-slate-100 font-body antialiased">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Microscope size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">The Engineering Lab</span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            TECHNICAL <span className="text-emerald-500">GEAR REPORTS.</span>
          </h2>
        </div>
        
        <Link href="/guides" className="px-8 py-4 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 group">
          Explore the full lab <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              className="group relative rounded-[2.5rem] border border-slate-100 bg-slate-50/50 overflow-hidden hover:bg-white hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="aspect-video bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                  {item.mainImage && (
                    <Image 
                      src={urlFor(item.mainImage).url()} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                    />
                  )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                {/* Badge Overlay - Fallback to 'Report' if Sanity field is empty */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-emerald-400 shadow-lg">
                    {item.badge || "Technical Report"}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">
                  {item.categoryTitle || "Equipment"}
                </span>
                <h3 className="font-heading text-2xl font-black uppercase italic tracking-tighter mt-2 text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed line-clamp-2">
                  {item.snippet}
                </p>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tech Rating</span>
                    <span className="text-xl font-black italic text-slate-900 tracking-tighter">
                      {item.score || "9.0"}<span className="text-emerald-500">/10</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-lg shadow-slate-900/10">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
              
              <Link href={`/guides/${item.slug}`} className="absolute inset-0 z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}