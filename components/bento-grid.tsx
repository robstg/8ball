"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export function BentoGrid({ posts = [] }: { posts: any[] }) {
  return (
    <section className="pb-20">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {posts.map((post) => (
          <motion.article
            key={post.slug?.current || post.slug || post.title}
            className="group relative rounded-[2.5rem] border border-slate-200 bg-white overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300"
            variants={itemVariants}
          >
            <Link href={`/articles/${post.slug?.current || post.slug}`}>
              
              {/* 1. The Cinematic 16:9 Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#004d33]/5 text-emerald-600/20">
                    <Zap size={40} strokeWidth={1} />
                  </div>
                )}
                
                {/* Subtle Gradient Overlay on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* 2. The Content Area */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                    {post.category || "Masterclass"}
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors leading-none">
                  {post.title}
                </h3>
                
                <p className="text-sm text-slate-500 mt-4 leading-relaxed line-clamp-2 font-medium">
                  {post.excerpt || "Dive into this technical breakdown to sharpen your game."}
                </p>

                {/* Footer Link */}
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                   Read Full Article <div className="h-px flex-1 bg-slate-100 group-hover:bg-emerald-100 transition-colors" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}