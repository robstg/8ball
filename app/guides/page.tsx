import Link from "next/link"
import { Scale, ChevronRight, Microscope } from "lucide-react"

// Hardcoded for now until Sanity Schema is ready
const labGuides = ['carbon-fiber-101', 'tip-selection-101', 'ball-science']

export default async function GuidesPage() {
  
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Reference Library</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 mt-2 leading-none">
            The Technical Lab.
          </h1>
          <p className="text-slate-500 mt-4 text-lg">Detailed specifications and global engineering standards for professional cue sports gear.</p>
        </header>

        <div className="grid gap-6">
          {labGuides.map((guide) => (
            <Link 
              key={guide} 
              href={`/guides/${guide}`}
              className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex items-center justify-between hover:shadow-2xl hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Microscope size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tight text-slate-900 leading-none capitalize">{guide.replace('-', ' ')}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Technical Specifications</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" size={40} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}