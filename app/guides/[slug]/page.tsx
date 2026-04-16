import { ArrowLeft, Zap, ShieldCheck, Microscope } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Hardcoded data for fallback until Sanity schema is ready
const labFallback = [
    {
      name: "Low Deflection Dynamics",
      slug: "carbon-fiber-101",
      category: "Engineering",
      score: "9.8",
      spec: "Hollow-built composite matrix",
      origin: "USA"
    },
    {
      name: "Hardness vs. Control",
      slug: "tip-selection-101",
      category: "Technical",
      score: "9.5",
      spec: "Layered Japanese leather matrix",
      origin: "Japan"
    },
    {
      name: "The Phenolic Standard",
      slug: "ball-science",
      category: "Equipment",
      score: "9.7",
      spec: "Crystalline resin sphere structure",
      origin: "Belgium"
    }
  ]

export default async function GuideDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const guide = labFallback.find(item => item.slug === slug)

  if (!guide) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 pt-40 pb-20 px-6">
      <article className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link href={`/guides`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Technical Lab
        </Link>

        {/* Minimalist Authority Header */}
        <header className="mb-16 text-center border-b border-slate-100 pb-12 bg-white p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-2 justify-center mb-4">
              <Microscope size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">The Engineering Lab</span>
          </div>
          <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] opacity-70 mb-2">{guide.category} Analysis</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8] mt-2 max-w-2xl mx-auto">
            {guide.name}
          </h1>
        </header>

        {/* The high-end Technical Spec Template */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Engineering Score</h3>
                    <p className="text-5xl font-black text-slate-900 leading-none tracking-tighter mt-2">{guide.score}<span className="text-emerald-500">/10</span></p>
                </div>
                <Zap size={40} strokeWidth={1.5} className="text-emerald-500" />
            </div>
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TECHNICAL SPECIFICATION</h3>
                <p className="text-xl font-bold leading-tight tracking-tight text-slate-900 mt-2 max-w-xs">{guide.spec}</p>
            </div>
        </div>

        {/* Placeholder Content Area */}
        <div className="bg-white p-12 rounded-[2.5rem] prose prose-slate max-w-none border border-slate-100 shadow-sm
          prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:italic">
          
          <h2>Authority Content (Placeholder)</h2>
          <p>
            This section will be populated with a 1,500-word expert Masterclass breakdown, complete with AI-generated macro visuals, when content is ready. Currently, this dynamic page serves as a placeholder to prevent build errors and establish worldwide authority for buying-intent search keywords (e.g., '{guide.category.toLowerCase()} guide'). The Engineering Score and Specification data shown above are final.
          </p>
          <p>
            For now, this page confirms that '{guide.name}' represents a global engineering benchmark. Further details on {guide.spec.toLowerCase()} are in production.
          </p>
        </div>

      </article>
    </main>
  )
}