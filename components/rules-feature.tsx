"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book, CheckCircle2, ArrowRight, Trophy } from "lucide-react"
import Link from "next/link"

const RULES_DATABASE = {
  "8-Ball": [
    {
      title: "Opening Break",
      description: "Rack tightly. The cue ball must pocket a ball or drive 4 balls to the rails to avoid a re-rack.",
      link: "/rules/8-ball-break"
    },
    {
      title: "Calling Shots", 
      description: "BCA standards require calling the ball and pocket. Casual 'pub' rules often differ—check the local house rules.",
      link: "/rules/8-ball-calling-shots"
    },
    {
      title: "Fouls & Ball in Hand",
      description: "Any foul results in ball-in-hand for the opponent, placed anywhere on the table (not just behind the headstring).",
      link: "/rules/8-ball-fouls"
    },
    {
      title: "Winning the Game",
      description: "Cleanly pocket the 8-ball after your group is gone. Scratching on the 8-ball is an automatic loss.",
      link: "/rules/8-ball-winning"
    }
  ],
  "9-Ball": [
    {
      title: "The Push Out",
      description: "Immediately following a legal break, the shooter may 'push out' to a better position without penalty.",
      link: "/rules/9-ball-push-out"
    },
    {
      title: "Lowest Ball First",
      description: "The cue ball must always strike the lowest numbered ball on the table first to be a legal shot.",
      link: "/rules/9-ball-legal-hit"
    },
    {
      title: "Golden Break",
      description: "Pocketing the 9-ball on the break is an instant win, provided the break was legal.",
      link: "/rules/9-ball-winning"
    },
    {
      title: "Three-Foul Rule",
      description: "Committing three consecutive fouls in one rack results in an immediate loss of the frame.",
      link: "/rules/9-ball-three-foul"
    }
  ],
  "Snooker": [
    {
      title: "The Miss Rule",
      description: "If a player fails to strike the 'ball on' and the ref deems they didn't make a best effort, it's a Foul and a Miss.",
      link: "/rules/snooker-miss"
    },
    {
      title: "Touching Ball",
      description: "If the cue ball is touching an object ball, the player must play 'away' from it without it moving.",
      link: "/rules/snooker-touching"
    },
    {
      title: "Foul Values",
      description: "Fouls are penalized between 4 and 7 points depending on the balls involved in the infraction.",
      link: "/rules/snooker-fouls"
    },
    {
      title: "The Re-spotted Black",
      description: "If scores are tied after the final black is potted, the black is re-spotted for a sudden-death finish.",
      link: "/rules/snooker-respot"
    }
  ]
}

export function RulesFeature() {
  const [activeSport, setActiveSport] = useState<keyof typeof RULES_DATABASE>("8-Ball")

  return (
    <section className="px-6 md:px-12 lg:px-20 py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left column - Header & Toggles */}
        <div className="sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">The Official Archives</span>
            </div>
            
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic text-slate-900">
              Know the rules.
              <br />
              <span className="text-emerald-500">Own the table.</span>
            </h2>
            
            <p className="mt-6 text-slate-500 max-w-md leading-relaxed text-lg">
              Settling disputes from Auckland pubs to international arenas. Select a sport to view core technicalities.
            </p>

            {/* Sport Selector Tabs */}
            <div className="mt-10 flex bg-slate-100 p-1 rounded-2xl w-fit">
              {Object.keys(RULES_DATABASE).map((sport) => (
                <button
                  key={sport}
                  onClick={() => setActiveSport(sport as any)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeSport === sport 
                    ? "bg-white text-emerald-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>

            <Link href="/rules" className="mt-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 group">
              View complete rulebook
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right column - Dynamic Rules list */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSport}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {RULES_DATABASE[activeSport].map((rule, i) => (
                <Link href={rule.link} key={i} className="group block">
                  <div className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                    <div className="flex gap-5">
                      <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-[family-name:var(--font-heading)] font-black uppercase italic tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {rule.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}