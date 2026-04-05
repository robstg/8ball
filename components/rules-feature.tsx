"use client"

import { motion } from "framer-motion"
import { Book, CheckCircle2, ArrowRight } from "lucide-react"

const rules = [
  {
    title: "Opening Break",
    description: "Rack the balls tightly. The cue ball must strike the rack and either pocket a ball or drive at least four balls to the rails."
  },
  {
    title: "Calling Shots", 
    description: "In most competitive play, you must call the ball and pocket for each shot. Obvious shots don't need to be called."
  },
  {
    title: "Fouls & Ball in Hand",
    description: "Scratching, hitting the wrong ball first, or not hitting a rail after contact results in ball-in-hand for your opponent."
  },
  {
    title: "Winning the Game",
    description: "Legally pocket the 8-ball after clearing your group (solids or stripes). Pocketing the 8-ball early or scratching on it loses the game."
  }
]

export function RulesFeature() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left column - Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Book className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Official Rules</span>
          </div>
          
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Know the rules.
            <br />
            <span className="text-muted-foreground">Own the table.</span>
          </h2>
          
          <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
            Whether you&apos;re playing casually or competing in tournaments, understanding BCA-standard 8-ball rules is essential.
          </p>

          <button className="mt-8 px-6 py-3 rounded-full border border-white/10 font-medium hover:bg-white/5 transition-colors inline-flex items-center gap-2 group">
            View complete rulebook
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Right column - Rules list */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              className="group p-5 rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <div className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {rule.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
