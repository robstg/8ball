import { client } from "@/sanity/lib/client"
import { PortableText } from "@portabletext/react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function RuleDetailPage({ 
  params 
}: { 
  params: Promise<{ sport: string, slug: string }> 
}) {
  const { sport, slug } = await params

  if (!slug) return notFound()

  const rule = await client.fetch(
    `*[_type == "rule" && slug.current == $slug][0]`,
    { slug: slug }
  )

  if (!rule) return notFound()

  return (
    <main className="min-h-screen bg-white pt-40 pb-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href={`/rules/${sport}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to {sport.replace('-', ' ')} List
        </Link>

        <header className="mb-12">
          <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">{rule.governingBody}</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.85] mt-2">
            {rule.title}
          </h1>
        </header>

        <div className="bg-emerald-600 text-white p-8 rounded-[2rem] mb-12 shadow-xl shadow-emerald-900/10 flex gap-6 items-start">
          <div className="bg-white/20 p-3 rounded-xl shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1 text-white">The Quick Verdict</h3>
            <p className="text-lg font-bold leading-snug italic tracking-tight">
              {rule.quickVerdict}
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed">
          <PortableText value={rule.content} />
        </div>
      </article>
    </main>
  )
}