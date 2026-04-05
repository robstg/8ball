"use client"

import { motion } from "framer-motion"
import { ShotAnalyzer } from "./shot-analyzer"
import { Target, Zap, TrendingUp, Eye, ArrowUpRight } from "lucide-react"

const techniques = [
  {
    id: 1,
    title: "The Perfect Break",
    description: "Master the opening shot that sets the tone for every game.",
    category: "Fundamentals",
    icon: Zap,
  },
  {
    id: 2,
    title: "Bank Shot Geometry",
    description: "Use angles and physics to sink impossible shots.",
    category: "Advanced",
    icon: Target,
  },
  {
    id: 3,
    title: "Position Play",
    description: "Think three shots ahead with strategic cue ball control.",
    category: "Strategy",
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Reading the Table",
    description: "Develop the mental game that separates pros from amateurs.",
    category: "Mental Game",
    icon: Eye,
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
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

export function BentoGrid() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pb-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="font-[family-name:var(--font-heading)] text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Featured Tools
          </h2>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Main Feature - Shot Analyzer */}
        <motion.div 
          className="lg:col-span-2 lg:row-span-2 relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 lg:p-8 overflow-hidden"
          variants={itemVariants}
        >
          <ShotAnalyzer />
        </motion.div>

        {/* Technique Cards */}
        {techniques.map((technique) => (
          <motion.article
            key={technique.id}
            className="group relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 cursor-pointer hover:bg-card/60 hover:border-white/20 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <technique.icon className="w-5 h-5 text-primary" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {technique.category}
            </span>
            
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight mt-2 group-hover:text-primary transition-colors">
              {technique.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {technique.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
