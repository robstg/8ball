import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standard Tailwind Merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Technical Color Matrix for Pot The Black
 * Converts category names into Lab-standard Tailwind classes.
 */
export function getCategoryStyles(categoryName: string = "") {
  const name = categoryName.toLowerCase()

  const styles = {
    // POOL / 8-BALL: The "Emerald Lab" Look
    pool: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "8-ball": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "9-ball": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",

    // SNOOKER: The "Championship Slate" Look
    snooker: "bg-slate-900 text-slate-100 border-slate-700",

    // DRILLS / ANALYTICS: The "Warning Orange" Look
    drills: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    analytics: "bg-orange-500/10 text-orange-600 border-orange-500/20",

    // DEFAULT: Technical Neutral
    default: "bg-slate-100 text-slate-500 border-slate-200",
  }

  // Logic to match the key or return default
  const key = Object.keys(styles).find(k => name.includes(k)) as keyof typeof styles
  return styles[key] || styles.default
}