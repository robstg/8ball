import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

export default async function Home() {
  // We use the exact same logic that worked on your archive page
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...5] {
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage,
    _createdAt
  }`)

  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* 1. Top Section: The Big Break */}
      {latestPost ? (
        <Masthead latestPost={latestPost} /> 
      ) : (
        <div className="pt-40 pb-20 text-center">
          <p className="text-slate-400 uppercase tracking-[0.3em] text-[10px] font-black">
            No Masterclasses found in the rack.
          </p>
        </div>
      )}
      
      {/* 2. The Bento Grid Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          {hasPosts && (
            <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600 hover:text-green-700 transition-colors">
              View All Archive →
            </Link>
          )}
        </div>
        
        {hasPosts ? (
          <BentoGrid posts={posts} /> 
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <p className="text-slate-400 font-bold uppercase tracking-tight text-sm">Table is empty.</p>
          </div>
        )}
      </div>
      
      {/* 3. Static Features */}
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}