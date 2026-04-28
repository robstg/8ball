import { client } from "@/sanity/lib/client"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Scale } from "lucide-react"

// Force revalidation so new rules show up immediately without a manual rebuild
export const revalidate = 60; 

export async function generateStaticParams() {
  return [
    { sport: '8-ball' },
    { sport: '9-ball' },
    { sport: 'snooker' }
  ]
}

export default async function SportListingPage({ params }: { params: Promise<{ sport: string }> }) {
  const resolvedParams = await params
  const sportSlug = resolvedParams?.sport || ""

  // THE FIX: We use lower() on both sides to make the match case-insensitive.
  // This solves the "9-ball" vs "9-Ball" mismatch instantly.
  const rules = await client.fetch(
    `*[_type == "rule" && lower(sport) == lower($sportSlug)] | order(title asc) {
      _id,
      title,
      governingBody,
      "slug": slug.current,
      sport
    }`,
    { sportSlug }
  )

  return (
    <main className="min-h-screen bg-slate-50 pt-40 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <Link 
          href="/rules" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 mb-12 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Rules Hub
        </Link>

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={18} className="text-emerald-500" />
            <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">
              Technical Archive
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8] mt-2">
            {sportSlug.replace('-', ' ')}<span className="text-emerald-500">.</span>
          </h1>
        </header>

        {/* Rules Grid */}
        <div className="grid gap-6">
          {rules.length > 0 ? (
            rules.map((rule: any) => (
              <Link 
                key={rule._id} 
                href={`/rules/${sportSlug}/${rule.slug}`}
                className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex items-center justify-between hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-500"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">
                    {rule.governingBody}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors leading-none">
                    {rule.title}
                  </h2>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">
                No technical specifications found for "{sportSlug}" yet.
              </p>
              <p className="text-slate-300 text-xs uppercase mt-2 font-bold">Lab Entry Pending</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}