import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

export default async function Home() {
  // We fetch 6 posts to be safe (1 for Masthead, 5 for the Grid)
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...6] {
    title,
    slug,
    body,
    mainImage,
    _createdAt
  }`)

  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null
  
  // We create a separate list for the grid that excludes the one already in the Masthead
  const gridPosts = hasPosts ? posts.slice(1) : []

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* This part is working - don't touch the component! */}
      {latestPost && <Masthead latestPost={latestPost} />}
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600 hover:text-green-700">
            View All Archive →
          </Link>
        </div>
        
        {/* We pass 'gridPosts' instead of 'posts' to avoid showing the same one twice */}
        {gridPosts.length > 0 ? (
          <BentoGrid posts={gridPosts} /> 
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <p className="text-slate-400 font-bold uppercase tracking-tight text-xs">
               More articles needed to fill the grid.
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