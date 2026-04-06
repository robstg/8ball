import { client } from '@/sanity/lib/client'
import { BottomNav } from "@/components/bottom-nav"

export default async function AboutPage() {
  // This asks Sanity: "Give me the page where the slug is 'about-us'"
  const data = await client.fetch(`*[_type == "page" && slug.current == "about-us"][0]`)

  return (
    <main className="min-h-screen p-10 pb-28">
      <h1 className="text-4xl font-black">{data?.title}</h1>
      <div className="mt-6 text-lg">
        {/* This displays the content you typed in the Studio */}
        {data?.content?.map((block: any) => (
          <p key={block._key}>{block.children[0].text}</p>
        ))}
      </div>
      <BottomNav />
    </main>
  )
}