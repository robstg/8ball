import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default async function Home() {
  // We keep the query simple to ensure the rack is full
  // We grab the latest 5 posts to keep the home page punchy
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...5] {
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage,
    _createdAt
  }`)

  // Safety: check if we actually have data before trying to use it
  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null

  return (
    /* Rob's Note: Sticking to that clean, light Auckland vibe (bg-slate-50) */
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* 1. MASTHEAD: Only shows if there's at least one post */}
      {latestPost ? (
        <Masthead latestPost={latestPost} /> 
      ) : (
        <div className="pt-40 pb-20 text-center">
          <p className="text-slate-400 uppercase tracking-[0.3em] text-[10px] font-black">
            The rack is empty. Check your Sanity Studio.
          </p>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          {hasPosts && (
            <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600 hover:text-green-700">
              View All Articles →
            </Link>
          )}
        </div>
        
        {/* 2. BENTO GRID: Only shows if posts exist */}
        {hasPosts ? (
          <BentoGrid posts={posts} /> 
        ) : (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50">
             <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center mb-4 text-slate-300">
               8
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm">
               No Masterclasses found in the database.
             </p>
          </div>
        )}
      </div>
      
      {/* These stay as they were */}
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}