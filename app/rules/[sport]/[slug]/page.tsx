import { client } from "@/sanity/lib/client"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import imageUrlBuilder from "@sanity/image-url" // 1. Import the builder

// 2. Initialize the Image Builder
const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

const portableTextComponents: PortableTextComponents = {
  types: {
    // 3. The FIXED Code/HTML Renderer
    code: ({ value }: any) => {
      // Force it to render as HTML if the language is 'html' or if the code contains HTML tags
      const isHtml = value.language === 'html' || value.code?.includes('<div') || value.code?.includes('<table')

      if (isHtml) {
        return (
          <div 
            className="my-10 w-full overflow-x-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: value.code }} 
          />
        )
      }

      // Standard fallback for actual code snippets
      return (
        <pre className="my-8 p-6 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm overflow-x-auto border border-slate-800 shadow-2xl">
          <code>{value.code}</code>
        </pre>
      )
    },

    // 4. The FIXED Image Renderer
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-12 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
          <img 
            src={urlFor(value).width(1200).url()} 
            alt={value.alt || "Technical Illustration"} 
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <p className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 border-t border-slate-100">
              Fig. 01 — {value.caption}
            </p>
          )}
        </div>
      )
    }
  },
  block: {
    // Styling the standard text blocks to match the brand
    h2: ({ children }) => <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mt-16 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 mt-10 mb-4">{children}</h3>,
    normal: ({ children }) => <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">{children}</p>,
  }
}

export default async function RuleDetailPage({ params }: { params: Promise<{ sport: string, slug: string }> }) {
  const resolvedParams = await params
  const { sport, slug } = resolvedParams

  // Fetch the rule and include the SEO field for the head tag later
  const rule = await client.fetch(
    `*[_type == "rule" && slug.current == $ruleSlug][0]`,
    { ruleSlug: slug || "" }
  )

  if (!rule) return notFound()

  return (
    <main className="min-h-screen bg-white pt-40 pb-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link 
          href={`/rules/${sport}`} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 mb-12 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to {sport} Archive
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-emerald-500" />
            <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">
              {rule.governingBody}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8] mt-2">
            {rule.title}<span className="text-emerald-500">.</span>
          </h1>
        </header>

        {/* The Quick Verdict / Bar Bet Settler */}
        <div className="bg-emerald-600 text-white p-10 rounded-[2.5rem] mb-16 shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
             <AlertCircle size={120} strokeWidth={1} />
          </div>
          
          <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-md">
            <AlertCircle size={28} />
          </div>
          
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2 block">Quick Verdict</span>
            <p className="text-xl md:text-2xl leading-tight font-black italic tracking-tight">
              "{rule.quickVerdict}"
            </p>
          </div>
        </div>

        {/* Full Rule Content */}
        <div className="prose-custom">
          <PortableText value={rule.content} components={portableTextComponents} />
        </div>
      </article>
    </main>
  )
}