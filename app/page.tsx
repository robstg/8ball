import { client } from '@/sanity/lib/client' // The "Power Line"
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default async function Home() {
  // Fetch posts WITH the specific data we need for the hero
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc){
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    mainImage
  }`)

  // Grab the very latest one
  const latestPost = posts[0]

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* We pass the latest post into the Masthead here */}
      <Masthead latestPost={latestPost} /> 
      
      {/* Your grid will now show all posts */}
      <BentoGrid posts={posts} /> 
      
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}