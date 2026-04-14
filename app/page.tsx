import { client } from '@/sanity/lib/client' 
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default async function Home() {
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc){
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage
  }`)

  const latestPost = posts[0]

  return (
    /* Rob's Note: Swapped 'bg-background' to 'bg-slate-50' to force the light vibe. 
       We're also removing any potential dark containers here. */
    <main className="min-h-screen bg-slate-50 pb-28">
      
      {/* CRITICAL: You need to go into these component files 
          to remove their internal 'bg-black' or 'bg-slate-950' classes.
      */}
      
      <Masthead latestPost={latestPost} /> 
      
      <div className="max-w-7xl mx-auto px-6">
        <BentoGrid posts={posts} /> 
      </div>
      
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}