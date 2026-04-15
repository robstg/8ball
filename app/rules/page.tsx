import { client } from "@/sanity/lib/client"
import Link from "next/link"
import { Scale, ChevronRight, ArrowLeft } from "lucide-react"

export default async function SportListingPage({ 
  params 
}: { 
  params: Promise<{ sport: string }> 
}) {
  // 1. Await the params (Required in modern Next.js)
  const { sport } = await params

  // 2. Fetch rules filtered by that sport
  const rules = await client.fetch(
    `*[_type == "rule" && sport == $sport] | order(title asc)`,
    { sport }
  )

  return (
    <main className="min-h-screen bg-slate-50 pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/rules" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Hub
        </Link>

        <header className="mb-12">
          <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">Archive</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 leading-none mt-2 capitalize">
            {sport.replace('-', ' ')} <span className="text-emerald-500">Rules</span>
          </h1>
        </header>

        <div className="grid gap-4">
          {rules.length > 0 ? (
            rules.map((rule: any) => (
              <Link 
                key={rule._id} 
                href={`/rules/${sport}/${rule.slug.current}`}
                className="group bg-white border border-slate-200 p-8 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:border-emerald-200 transition-all"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{rule.governingBody}</span>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 mt-1">{rule.title}</h2>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400">
              No rules found for this sport yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}