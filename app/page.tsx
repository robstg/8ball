import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default async function Home() {
  // We grab the latest 5 posts. 
  // We also grab the category title so you can show it in the Bento Grid.
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...5] {
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage,
    _createdAt,
    "category": category->title
  }`)

  // Your Masthead usually wants the very latest one
  const latestPost = posts[0]

  return (
    /* Rob's Note: Keep that light vibe, but ensure the text stays sharp (text-slate-900) */
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      
      {/* The Big Shot: Shows off your #1 latest article */}
      <Masthead latestPost={latestPost} /> 
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-xs uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
        </div>
        
        {/* The Grid: This will now show the remaining 4 posts from your list */}
        <BentoGrid posts={posts} /> 
      </div>
      
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}