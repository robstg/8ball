import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

export default async function ArticlesPage() {
  // Simple query to get the ball rolling
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    mainImage,
    _createdAt
  }`);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-40 pb-32 px-6 font-inter">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-20 border-b border-slate-200 pb-10">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
            The <br /> Archive
          </h1>
        </header>

        <div className="flex flex-col gap-1">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Link 
                key={post.slug} 
                href={`/articles/${post.slug}`}
                className="group border-b border-slate-200 py-12 flex flex-col md:flex-row items-center justify-between hover:bg-white px-4 transition-all rounded-2xl"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                    {new Date(post._createdAt).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                </div>

                {post.mainImage && (
                  <div className="relative w-32 h-20 overflow-hidden rounded-lg hidden md:block">
                    <Image 
                      src={urlFor(post.mainImage).url()} 
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                )}
              </Link>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Masterclass found yet.</p>
            </div>
          )}
        </div>

        <div className="mt-20">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-slate-900">
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}