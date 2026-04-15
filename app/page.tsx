import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

// 1. THIS IS THE KEY: Forces Next.js to fetch fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // 2. We flatten the slug and add a 'no-store' cache rule
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...6] {
    title,
    "slug": slug.current,
    mainImage,
    _createdAt,
    "excerpt": coalesce(array::join(string::split(pt::text(body), "")[0..200], ""), "")
  }`, 
  {}, 
  { cache: 'no-store' })

  // 3. Look at your terminal (where you ran npm run dev) to see this:
  console.log("HOME PAGE DEBUG - Posts Found:", posts?.length)
  if (posts?.length > 0) {
    console.log("LATEST POST TITLE:", posts[0].title)
  }

  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null
  const gridPosts = hasPosts ? posts.slice(1) : []

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* Lead ball */}
      <Masthead latestPost={latestPost} />
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600">
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
      <GearShowcase />
      <BottomNav />
    </main>
  )
}