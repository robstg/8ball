import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { ArrowLeft, Zap, Microscope } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// THE RE-RACK: Ensures fresh technical data on every visit
export const dynamic = 'force-dynamic'
export const revalidate = 0

// THE SEO HANDSHAKE: Dynamic title tags for technical authority
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = await client.fetch(
    `*[_type == "guide" && slug.current == $slug][0]{ title, categoryTitle }`,
    { slug }
  )

  if (!guide) return { title: "Report Not Found | Pot The Black" }

  return {
    title: `${guide.title} | Technical Report`,
    description: `Deep-dive mechanical analysis and engineering breakdown of ${guide.title}.`
  }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mt-16 mb-6">{children}</h2>,
    normal: ({ children }) => <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">{children}</p>,
  }
}

export default async function GuideDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params

  // THE LIVE FETCH: Grabbing the real data from the Engineering Lab
  const guide = await client.fetch(
    `*[_type == "guide" && slug.current == $slug][0]{
      title,
      categoryTitle,
      score,
      spec,
      badge,
      body
    }`, 
    { slug }
  )

  if (!guide) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 pt-40 pb-20 px-6 font-body antialiased">
      <article className="max-w-4xl mx-auto">
        
        <Link href={`/guides`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Technical Lab
        </Link>

        <header className="mb-16 text-center border-b border-slate-100 pb-12 bg-white p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-2 justify-center mb-4">
              <Microscope size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">The Engineering Lab</span>
          </div>
          <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] opacity-70 mb-2">{guide.categoryTitle || "Equipment"} Analysis</span>
          <h1 className="font-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8] mt-2 max-w-2xl mx-auto">
            {guide.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Engineering Score</h3>
                    <p className="text-5xl font-black text-slate-900 leading-none tracking-tighter mt-2">{guide.score || "9.0"}<span className="text-emerald-500">/10</span></p>
                </div>
                <Zap size={40} strokeWidth={1.5} className="text-emerald-500" />
            </div>
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TECHNICAL SPECIFICATION</h3>
                <p className="text-xl font-bold leading-tight tracking-tight text-slate-900 mt-2 max-w-xs">{guide.spec || "Confidential Lab Spec"}</p>
            </div>
        </div>

        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="prose prose-slate max-w-none 
            prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed 
            prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:italic">
            <PortableText value={guide.body} components={portableTextComponents} />
          </div>
        </div>

      </article>
    </main>
  )
}