import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Microscope } from "lucide-react"
import { Metadata } from "next"

// 1. THE SEO HANDSHAKE: Only send the unique part of the title.
// The Layout handles the "| Pot The Black" part automatically.
export const metadata: Metadata = {
  title: "The Technical Lab",
  description: "Detailed specifications and global engineering standards for professional cue sports gear.",
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getGuides() {
  const query = `*[_type == "guide"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    mainImage,
    categoryTitle,
    "snippet": array::join(string::split(pt::text(body), "")[0...100], "")
  }`
  return await client.fetch(query)
}

export default async function GuidesPage() {
  const guides = await getGuides();
  
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-body antialiased text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Visual Header: We keep the <h1> for the user, but it no longer affects the <head> */}
        <header className="mb-16 text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Microscope size={16} className="text-emerald-500" />
            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Reference Library</span>
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter mt-2 leading-none">
            The Technical Lab<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium italic leading-relaxed">
            Detailed specifications and global engineering standards for professional cue sports gear.
          </p>
        </header>

        <div className="grid gap-6">
          {guides.length > 0 ? (
            guides.map((guide: any) => (
              <Link 
                key={guide.slug} 
                href={`/guides/${guide.slug}`}
                className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex items-center justify-between hover:shadow-2xl hover:border-emerald-200 transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    {guide.mainImage ? (
                      <Image 
                        src={urlFor(guide.mainImage).url()} 
                        alt={guide.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <Microscope size={32} />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-heading text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
                      {guide.categoryTitle || "Technical Analysis"} • {guide.snippet ? `${guide.snippet}...` : "Full Specification Pending"}
                    </p>
                  </div>
                </div>
                
                <ChevronRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" size={40} />
              </Link>
            ))
          ) : (
            <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[3.5rem]">
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                 The Lab is currently empty. Re-rack Sanity and try again.
               </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}