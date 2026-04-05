"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight, ShoppingBag } from "lucide-react"

const gear = [
  {
    name: "Predator Revo 12.9",
    category: "Cue Shaft",
    price: "$549",
    rating: 4.9,
    badge: "Editor's Choice"
  },
  {
    name: "Aramith Tournament",
    category: "Ball Set",
    price: "$299",
    rating: 4.8,
    badge: "Pro Standard"
  },
  {
    name: "Kamui Black Soft",
    category: "Cue Tip",
    price: "$32",
    rating: 4.7,
    badge: "Best Value"
  }
]

export function GearShowcase() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-white/5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Featured Gear</span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold tracking-tight">
            Pro-grade equipment
          </h2>
        </div>
        <button className="hidden md:flex px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors items-center gap-2 group">
          <ShoppingBag className="w-4 h-4" />
          Shop all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Gear grid */}
      <motion.div 
        className="grid md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {gear.map((item, i) => (
          <motion.div
            key={i}
            className="group relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-secondary/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
            </div>

            {/* Badge */}
            {item.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                  {item.badge}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] font-semibold tracking-tight mt-1 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold">{item.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-sm">{item.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile shop button */}
      <button className="md:hidden mt-6 w-full px-5 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
        <ShoppingBag className="w-4 h-4" />
        Shop all gear
      </button>
    </section>
  )
}
