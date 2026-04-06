import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { BottomNav } from "@/components/bottom-nav"

export default async function AboutPage() {
  // 1. Fetch the data
  const data = await client.fetch(`*[_type == "page" && slug.current == "about-us"][0]`)

  // 2. Handle the "Nothing Found" state
  if (!data) {
    return (
      <main className="min-h-screen p-10 bg-background">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-gray-500">Make sure the slug in Sanity is exactly "about-us" and you hit Publish.</p>
        <BottomNav />
      </main>
    )
  }

  // 3. The Real Page
  return (
    <main className="min-h-screen p-10 pb-28 bg-background">
      <article className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 border-b pb-4">
          {data.title}
        </h1>
        
        {/* This is the "Translator" that turns Sanity text into real HTML */}
        <div className="prose prose-lg dark:prose-invert">
          <PortableText value={data.content} />
        </div>
      </article>
      
      <BottomNav />
    </main>
  )
}