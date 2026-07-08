import { client } from "@/sanity/lib/client"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import imageUrlBuilder from "@sanity/image-url"
import { Metadata } from "next"
import { createElement } from "react"

// THE FIX: Dynamic Metadata generation for Rule Detail Pages
export async function generateMetadata({ params }: { params: Promise<{ sport: string, slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const rule = await client.fetch(
    `*[_type == "rule" && slug.current == $ruleSlug][0]{ title, quickVerdict }`,
    { ruleSlug: slug || "" }
  );

  if (!rule) {
    return {
      title: "Rule Not Found | Pot The Black",
    };
  }

  return {
    title: rule.title, // This replaces the %s in your root layout template
    description: rule.quickVerdict || `Full technical breakdown of the ${rule.title} rule for competitive play.`,
  };
}

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

const portableTextComponents: PortableTextComponents = {
  types: {
    code: ({ value }: any) => {
      const isHtml = value.language === 'html' || value.code?.includes('<div') || value.code?.includes('<table')

      if (isHtml) {
        return (
          <div 
            className="my-10 w-full overflow-x-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: value.code }} 
          />
        )
      }

      return (
        <pre className="my-8 p-6 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm overflow-x-auto border border-slate-800 shadow-2xl">
          <code>{value.code}</code>
        </pre>
      )
    },
    image: ({ value }: any) => {
      // FIX: query dereferences asset->, so the shape is the resolved asset
      // (has _id, url, etc.) not the raw reference (_ref). Check for both
      // so images actually render instead of silently returning null.
      if (!value?.asset?._id && !value?.asset?._ref) return null
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
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')
      return createElement(
        'a',
        {
          href: href,
          target: isExternal ? '_blank' : undefined,
          rel: isExternal ? 'noopener noreferrer' : undefined,
          className: "text-emerald-600 font-semibold underline decoration-emerald-300 underline-offset-2 hover:text-emerald-700 hover:decoration-emerald-500 transition-colors"
        },
        children
      )
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mt-16 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 mt-10 mb-4">{children}</h3>,
    normal: ({ children }) => <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">{children}</p>,
  }
}

export default async function RuleDetailPage({ params }: { params: Promise<{ sport: string, slug: string }> }) {
  const resolvedParams = await params
  const { sport, slug } = resolvedParams

  // THE FIX: Deep asset projection tells Sanity to pull raw image metadata inside the body block array
  const rule = await client.fetch(
    `*[_type == "rule" && slug.current == $ruleSlug][0]{
      ...,
      content[]{
        ...,
        asset->{
          ...,
          metadata
        }
      }
    }`,
    { ruleSlug: slug || "" }
  )

  if (!rule) return notFound()

  // Build FAQPage JSON-LD from the rule.faq array (added in the Sanity schema:
  // an array field named "faq" with objects of { question, answer }).
  // Rendered server-side, straight into <head>-equivalent output — never through
  // PortableText, so it can't get escaped or dumped as visible text.
  const faqSchema = rule.faq?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": rule.faq.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } : null

  return (
    <main className="min-h-screen bg-white pt-40 pb-20">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
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

        {(rule.quickVerdict || rule.keyPoints?.length > 0) && (
          <div className="bg-emerald-600 text-white p-8 md:p-10 rounded-[2.5rem] mb-16 shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertCircle size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-white/20 p-3 rounded-xl shrink-0 backdrop-blur-md">
                  <AlertCircle size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Quick Verdict
                </span>
              </div>

              {rule.quickVerdict && (
                <p className="text-xl md:text-2xl leading-snug font-black tracking-tight mb-6">
                  {rule.quickVerdict}
                </p>
              )}

              {rule.keyPoints?.length > 0 && (
                <ul className="space-y-3 border-t border-white/20 pt-6">
                  {rule.keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed font-medium text-emerald-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="prose-custom">
          {/* Now containing perfectly resolved deep asset fields */}
          <PortableText value={rule.content} components={portableTextComponents} />
        </div>

        {rule.faq?.length > 0 && (
          <section className="mt-20 border-t border-slate-100 pt-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-8">
              FAQ<span className="text-emerald-500">.</span>
            </h2>
            <div className="space-y-8">
              {rule.faq.map((item: { question: string; answer: string }, i: number) => (
                <div key={i}>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.question}</h3>
                  <p className="text-slate-600 text-base leading-relaxed font-medium">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}