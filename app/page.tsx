import { Masthead } from "@/components/masthead"
import { BentoGrid } from "@/components/bento-grid"
import { RulesFeature } from "@/components/rules-feature"
import { GearShowcase } from "@/components/gear-showcase"
import { BottomNav } from "@/components/bottom-nav"

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-28">
      <Masthead />
      <BentoGrid />
      <RulesFeature />
      <GearShowcase />
      <BottomNav />
    </main>
  )
}
