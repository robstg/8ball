"use client"

import { motion } from "framer-motion"
import { ShotAnalyzer } from "./shot-analyzer"
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

// 1. ADD 'posts' AS A PROP HERE
export function BentoGrid({ posts = [] }: { posts: any[] }) {
  return (
    <section className="pb-20">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Keep your Shot Analyzer tool in the big slot */}
        <motion.div 
          className="lg:col-span-2 lg:row-span-2 relative rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 overflow-hidden shadow-sm"
          variants={itemVariants}
        >
          <ShotAnalyzer />
        </motion.div>

        {/* 2. MAP OVER YOUR REAL POSTS INSTEAD OF THE HARDCODED LIST */}
        {posts.map((post) => (
          <motion.article
            key={post.slug?.current || post.title}
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
          >
            <Link href={`/articles/${post.slug?.current || post.slug}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                {post.category || "Masterclass"}
              </span>
              
              <h3 className="text-xl font-black italic uppercase tracking-tighter mt-2 group-hover:text-green-600 transition-colors">
                {post.title}
              </h3>
              
              {/* Optional: Show a tiny bit of excerpt if it exists */}
              <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                {post.excerpt || "Dive into this technical breakdown to sharpen your game."}
              </p>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}