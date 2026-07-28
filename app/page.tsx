import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 
import { Footer } from "@/components/footer"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
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

  const hasPosts = posts.length > 0
  const latestPost = hasPosts ? posts[0] : null
  const gridPosts = hasPosts ? posts.slice(1) : []

  return (
    /* THE FIX: Added a negative top margin (-mt-24 md:-mt-20) directly to the main container.
      This pulls the entire page UP, completely swallowing that accidental pt-20 white wrapper 
      and sliding the gray content flawlessly behind the header's search bar shadow.
    */
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter -mt-24 md:-mt-20 relative z-0">
      
      {/* Lead ball — Latest post */}
      <Masthead latestPost={latestPost} />
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          <Link href="/articles" className="text-[10px] font-bold uppercase text-emerald-600">
            See All Posts →
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
      <GearShowcase items={gearGuides} />
      <Footer />
      <BottomNav />
    </main>
  )
}