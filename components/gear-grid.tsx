"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight, ShoppingCart } from "lucide-react"
import Image from "next/image"

const categories = [
  {
    id: "cues",
    title: "Cues",
    description: "Professional playing and break cues",
    image: "/images/gear/cue-predator.jpg",
    items: [
      { name: "Predator Revo 12.9", price: "$549", rating: 4.9, badge: "Editor's Choice", description: "Carbon fiber shaft with radial consistency" },
      { name: "Mezz EC7-WK", price: "$425", rating: 4.8, badge: null, description: "Japanese craftsmanship, maple core" },
      { name: "Cuetec Cynergy SVB", price: "$695", rating: 4.9, badge: "Pro Standard", description: "Shane Van Boening signature model" },
      { name: "McDermott G-Core", price: "$375", rating: 4.7, badge: null, description: "Triple-layer carbon fiber core" }
    ]
  },
  {
    id: "chalk",
    title: "Chalk",
    description: "Premium chalk for maximum grip",
    image: "/images/gear/chalk-master.jpg",
    items: [
      { name: "Taom Pyro", price: "$32", rating: 4.9, badge: "Best Seller", description: "Finnish formula, less mess" },
      { name: "Kamui 0.98", price: "$28", rating: 4.8, badge: null, description: "Beta version, micro particles" },
      { name: "Predator 1080 Pure", price: "$25", rating: 4.7, badge: null, description: "Silica-free, clean play" },
      { name: "Taom Soft", price: "$30", rating: 4.8, badge: "Editor's Choice", description: "Lower density, smoother feel" }
    ]
  },
  {
    id: "gloves",
    title: "Gloves",
    description: "Smooth stroke, every shot",
    image: "/images/gear/glove-pro.jpg",
    items: [
      { name: "Molinari V3", price: "$28", rating: 4.8, badge: "Editor's Choice", description: "Open finger design, breathable" },
      { name: "Predator Second Skin", price: "$32", rating: 4.9, badge: null, description: "Compression fit, ultra-thin" },
      { name: "Kamui QuickDry", price: "$35", rating: 4.7, badge: "Best Seller", description: "Moisture-wicking fabric" },
      { name: "Poison Camo", price: "$22", rating: 4.6, badge: null, description: "Three-finger, camo pattern" }
    ]
  },
  {
    id: "tables",
    title: "Tables",
    description: "Tournament-spec playing surfaces",
    image: "/images/gear/table-diamond.jpg",
    items: [
      { name: "Diamond Pro-Am", price: "$12,500", rating: 5.0, badge: "Tournament", description: "Official Mosconi Cup table" },
      { name: "Brunswick Gold Crown VI", price: "$9,800", rating: 4.9, badge: null, description: "Classic American design" },
      { name: "Rasson Victory II", price: "$8,500", rating: 4.8, badge: "Best Value", description: "Chinese snooker precision" },
      { name: "Olhausen Grand Champion", price: "$7,200", rating: 4.7, badge: null, description: "American-made quality" }
    ]
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Essential tools and extras",
    image: "/images/gear/cue-case.jpg",
    items: [
      { name: "Aramith Tournament Set", price: "$299", rating: 4.9, badge: "Pro Standard", description: "Belgian phenolic resin balls" },
      { name: "Predator QR2 Extension", price: "$189", rating: 4.8, badge: null, description: "Quick-release, 8-inch" },
      { name: "Kamui Gator Grip", price: "$45", rating: 4.7, badge: null, description: "Premium tip tool set" },
      { name: "JB Cases Rugged", price: "$285", rating: 4.8, badge: "Editor's Choice", description: "4x8 hard case, waterproof" }
    ]
  }
]

export function GearGrid() {
  return (
    <div className="px-6 md:px-12 lg:px-20 space-y-16 pb-8">
      {categories.map((category, categoryIndex) => (
        <motion.section
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.05 }}
        >
          {/* Category header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {String(categoryIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold tracking-tight">
                {category.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Items grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.items.map((item, itemIndex) => (
              <motion.div
                key={itemIndex}
                className="group relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: itemIndex * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {/* Product image */}
                <div className="aspect-square bg-secondary/20 relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick add button */}
                  <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-medium text-primary uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="font-semibold">{item.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="text-sm text-muted-foreground">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
