'use client'

import { usePathname } from 'next/navigation'
import { Header } from "@/components/header"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  return (
    <>
      {!isStudio && <Header />}
      <div className={!isStudio ? "pt-20 min-h-screen bg-white shadow-sm max-w-[1600px] mx-auto" : "h-screen overflow-hidden"}>
        {children}
      </div>
    </>
  )
}