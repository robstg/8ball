"use client"

import { motion } from "framer-motion"
import { Zap, ArrowRight, Microscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const labData = [
  {
    name: "Low Deflection Dynamics",
    slug: "carbon-fiber-101", // 1. Added Slug for Dynamic Linking
    category: "Engineering",
    score: "9.8",
    badge: "Editor's Choice",
    imageUrl: "/images/gear-carbon.jpg", // 2. Added Local Image Path
    info: "Carbon Composite analysis"
  },
  {
    name: "Hardness vs. Control",
    slug: "tip-selection-101",
    category: "Technical",
    score: "9.5",
    badge: "Pro Standard",
    imageUrl: "/images/gear-leather.jpg",
    info: "Global tip selection matrix"
  },
  {
    name: "The Phenolic Standard",
    slug: "ball-science",
    category: "Equipment",
    score: "9.7",
    badge: "Ball Science",
    imageUrl: "/images/gear-resin.jpg",
    info: "tournament ball analysis"
  }
]

export function GearShowcase() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Microscope size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">The Engineering Lab</span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            TECHNICAL <span className="text-emerald-500">GEAR REPORTS.</span>
          </h2>
        </div>
        
        {/* Updated Button Label */}
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
          {labData.map((item, i) => (
            <motion.div
              key={i}
              className="group relative rounded-[2.5rem] border border-slate-100 bg-slate-50/50 overflow-hidden hover:bg-white hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Image / Icon Area */}
<div className="aspect-video bg-slate-100 flex items-center justify-center relative overflow-hidden">
  
  {/* The Image Component with object-cover ensures no stretching */}
  <div className="absolute inset-0">
    <Image 
      src={item.imageUrl} 
      alt={item.name} 
      fill 
      className="object-cover group-hover:scale-105 transition-transform duration-700" 
      priority={i === 0}
    />
  </div>
  
  {/* Gradient overlay - adjusted to be more subtle for 16:9 */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

  {/* Badge Overlay */}
  <div className="absolute top-4 left-4 z-10">
    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-emerald-400 shadow-lg">
      {item.badge}
    </span>
  </div>
</div>

              {/* Content */}
              <div className="p-8">
                <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-black uppercase italic tracking-tighter mt-2 text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {item.name}
                </h3>
                
                {/* Removed Price, Added Specs Info */}
                <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">
                  {item.info}
                </p>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tech Rating</span>
                    <span className="text-xl font-black italic text-slate-900 tracking-tighter">{item.score}<span className="text-emerald-500">/10</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-lg shadow-slate-900/10">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
              
              {/* Entire card is a dynamic link */}
              <Link href={`/guides/${item.slug}`} className="absolute inset-0 z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}