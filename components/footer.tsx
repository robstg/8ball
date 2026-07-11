"use client"

import Link from "next/link"
import SubscribeForm from "@/components/SubscribeForm"

const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Pool", href: "/pool" },
      { label: "Snooker", href: "/snooker" },
      { label: "9-Ball", href: "/9-ball" },
      { label: "Rules", href: "/rules" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Masterclass Archive", href: "/articles" },
      { label: "Gear Lab", href: "/guides" },
      { label: "News", href: "/news" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/about-us#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-[#002e1f] text-white pb-32 md:pb-16">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/felt.png')` }}
      />

      {/* Newsletter strip */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-black italic uppercase tracking-tight text-white">
              Never Miss a Masterclass
            </h2>
            <p className="mt-3 text-white/60 max-w-md">
              Weekly cue sports news, technique breakdowns, and gear reviews — straight to your inbox, no fluff.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0">
            <SubscribeForm source="footer" />
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-black italic uppercase tracking-tighter text-xl text-white">
              Pot The Black
            </span>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              The definitive technical resource for serious cue sports players.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left text-[11px] text-white/40 font-medium">
            <p>© 2026 Pot The Black. All rights reserved.</p>
            <p className="mt-1">RDS Software Limited · Auckland, New Zealand</p>
          </div>
        </div>
      </div>
    </footer>
  )
}