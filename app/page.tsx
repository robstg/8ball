import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link" 

export default async function Home() {
  // 1. Fetch the data
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) [0...5] {
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage,
    _createdAt
  }`)

  // 2. DEBUG: This will show up in your VS Code terminal (not the browser)
  // Look at your terminal to see if you see titles here!
  console.log("HOME PAGE POSTS CHECK:", posts?.length, posts?.[0]?.title)

  const hasPosts = posts && posts.length > 0
  const latestPost = hasPosts ? posts[0] : null

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-inter">
      
      {/* 1. Only show Masthead if we have data */}
      {latestPost && <Masthead latestPost={latestPost} />}
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            The Latest Breaks
          </h2>
          {hasPosts && (
            <Link href="/articles" className="text-[10px] font-bold uppercase text-green-600">
              View All Archive →
            </Link>
          )}
        </div>
        
        {/* 2. Only show BentoGrid if we have data */}
        {hasPosts ? (
          <BentoGrid posts={posts} /> 
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <p className="text-slate-400 font-bold uppercase tracking-tight text-sm">
               Data exists on /articles but not here. Caching issue?
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