import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { BottomNav } from "@/components/bottom-nav"
import ContactForm from "@/components/contact-form"
import Image from 'next/image'
import SubscribeForm from '@/components/SubscribeForm'

// --- THE FIX: KILL THE CACHE ---
export const revalidate = 0; 
export const dynamic = 'force-dynamic';
// ------------------------------

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-12 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl bg-white">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "About Pot The Black"}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
        />
        {value.caption && (
          <p className="bg-slate-50 p-6 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold italic border-t border-slate-100">
            {value.caption}
          </p>
        )}
      </div>
    ),
    heroSection: ({ value }: any) => (
      <section className="py-20 text-center border-y border-slate-100 my-16">
        <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-none mb-6 tracking-tighter text-slate-900">
          {value.heading}
        </h2>
        <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          {value.subheading}
        </p>
      </section>
    ),
    statsGrid: ({ value }: any) => (
      <div className="grid grid-cols-2 gap-6 my-16">
        {value.stats?.map((stat: any, i: number) => (
          <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-black text-emerald-600 italic uppercase tracking-tighter">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    ),
  },
}

export default async function AboutPage() {
  // Fetching fresh data every time because of revalidate = 0
  const data = await client.fetch(`*[_type == "page" && slug.current == "about-us"][0]`)

  if (!data) {
    return (
      <main className="min-h-screen p-10 bg-slate-50 text-slate-900">
        <h1 className="text-2xl font-bold uppercase italic">Page Not Found</h1>
        <p className="text-slate-400 text-sm mt-2">Check Sanity slug: "about-us"</p>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-32 bg-slate-50 text-slate-900">
      <article className="max-w-4xl mx-auto px-6">
        
        <header className="pt-32 pb-16 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <span className="w-8 h-[2px] bg-emerald-500"></span>
            <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">
              Our Story
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            {data.title}
          </h1>
        </header>
        
        <div className="prose prose-slate max-w-none 
          prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter
          prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed
          prose-strong:text-slate-900 prose-strong:font-black">
          <PortableText value={data.content} components={components} />
        </div>

        <hr className="my-24 border-slate-200" />
        
        <div id="contact" className="scroll-mt-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900">
              Get in Touch
            </h2>
            <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] mt-3 font-bold">
              <center><SubscribeForm source="article-footer" /></center>
              Questions, Feedback, or Cue Reviews
            </p>
          </div>
          <ContactForm />
        </div>
      </article>
      
      <BottomNav />
    </main>
  )
}