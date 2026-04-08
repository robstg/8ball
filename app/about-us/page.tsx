import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { BottomNav } from "@/components/bottom-nav"
import Image from 'next/image'

// 1. This "Manual" tells PortableText how to render your Sanity blocks
const components = {
  types: {
    // This handles the "Simple Image Block" from your schema
    image: ({ value }: any) => (
      <div className="my-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "About Pot The Black"}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
        />
        {value.caption && (
          <p className="bg-white/5 p-4 text-center text-xs uppercase tracking-widest text-gray-500 italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    // This handles the "Modern Hero" block if you added one
    heroSection: ({ value }: any) => (
      <section className="py-20 text-center border-y border-white/5 my-12">
        <h2 className="text-6xl font-black italic uppercase leading-none mb-4 tracking-tighter text-primary">
          {value.heading}
        </h2>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {value.subheading}
        </p>
      </section>
    ),
    // This handles the "Bento Stats" block
    statsGrid: ({ value }: any) => (
      <div className="grid grid-cols-2 gap-4 my-12">
        {value.stats?.map((stat: any, i: number) => (
          <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="text-3xl font-black text-primary italic uppercase">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    ),
  },
}

export default async function AboutPage() {
  // Fetch data - use "content" instead of "data" to be clear
  const data = await client.fetch(`*[_type == "page" && slug.current == "about-us"][0]`)

  if (!data) {
    return (
      <main className="min-h-screen p-10 bg-background text-white">
        <h1 className="text-2xl font-bold uppercase italic">Page Not Found</h1>
        <p className="text-gray-500 text-sm mt-2">Check Sanity slug: "about-us"</p>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-10 pb-28 bg-[#0a0a0a] text-white">
      <article className="max-w-3xl mx-auto">
        {/* Page Title */}
        <header className="mb-16 pt-10">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Pot The Black</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mt-2 leading-[0.85]">
            {data.title}
          </h1>
        </header>
        
        {/* Content Render - Pass the 'components' manual here */}
        <div className="prose prose-invert max-w-none prose-green">
          <PortableText value={data.content} components={components} />
        </div>
      </article>
      
      <BottomNav />
    </main>
  )
}