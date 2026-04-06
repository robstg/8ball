import { client } from '@/sanity/lib/client' // The "Power Line"
import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default async function Home() {
  // This grabs your posts from Sanity
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc)`)

  return (
    <main className="min-h-screen bg-background pb-28">
      <Masthead />
      
      {/* Eventually, we will pass {posts} into your BentoGrid 
          so it shows your REAL stories instead of placeholders.
      */}
      <BentoGrid posts={posts} /> 
      
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}