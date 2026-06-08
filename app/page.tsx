import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

// Forces Next.js to fetch fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // THE DUAL-TRACK QUERY: 
  // 1. We grab the latest 7 standard posts for the Masthead and BentoGrid
  // 2. We grab the latest 3 guides for the GearShowcase section
  const data = await client.fetch(`{
    "posts": *[_type == "post"] | order(_createdAt desc) [0...7] {
      title,
      "slug": slug.current,
      mainImage,
      _createdAt,
      "excerpt": coalesce(array::join(string::split(pt::text(body), "")[0..200], ""), "")
    },
    "gearGuides": *[_type == "guide"] | order(_createdAt desc) [0...3] {
      title,
      "slug": slug.current,
      mainImage,
      "category": category->title,
      "score": score,
      "badge": badge,
      "info": coalesce(array::join(string::split(pt::text(body), "")[0..100], ""), "")
    }
  }`, {}, { cache: 'no-store' })

  const posts = data.posts || []
  const gearGuides = data.gearGuides || []

  // Logic for the main article section
  const hasPosts = posts.length > 0
  const latestPost = hasPosts ? posts[0] : null
  const gridPosts = hasPosts ? posts.slice(1) : []

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* 
        THE FIX: Added a protective wrapper with responsive top padding.
        This offsets the header's absolute floating search bar on mobile screens.
      */}
      <div className="pt-12 md:pt-16">
        <Masthead latestPost={latestPost} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          <Link href="/articles" className="text-[10px] font-bold uppercase text-emerald-600">
            View All Archive →
          </Link>
        </div>
        
        {gridPosts.length > 0 ? (
          <BentoGrid posts={gridPosts} /> 
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <p className="text-slate-400 font-bold uppercase tracking-tight text-[10px]">
               {hasPosts ? "Only one post found (displayed in Masthead)." : "The rack is empty."}
             </p>
          </div>
        )}
      </div>
      
      <RulesFeature />

      {/* THE INTEGRATION: Passing our guide data into the showcase component */}
      <GearShowcase items={gearGuides} />

      <BottomNav />
    </main>
  )
}