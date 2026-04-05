import { GearHeader } from "@/components/gear-header"
import { GearGrid } from "@/components/gear-grid"
import { BottomNav } from "@/components/bottom-nav"

export default function GearPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <GearHeader />
      <GearGrid />
      <BottomNav />
    </main>
  )
}
