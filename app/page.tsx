import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

export default async function Home() {
  // We stripped out everything except the essentials.
  // This query will not fail even if your posts are nearly empty.
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...6] {
    title,
    slug,
    mainImage,
    _createdAt,
    body
  }`)

  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null
  
  // Send the rest of the rack to the grid
  const gridPosts = hasPosts ? posts.slice(1) : []

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* Lead ball */}
      {latestPost && <Masthead latestPost={latestPost} />}
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600">
            View All Archive →
          </Link>
        </div>
        
        {/* If the grid has posts, show them. If not, don't crash. */}
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
      <GearShowcase />
      <BottomNav />
    </main>
  )
}