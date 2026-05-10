import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  // THE QUERY: We use pt::text(body) to grab the first 200 characters for the snippet.
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    mainImage,
    _createdAt,
    "snippet": array::join(string::split(pt::text(body), "")[0...160], "") + "..."
  }`);

  return (
    <main className="min-h-screen bg-white text-slate-900 pt-40 pb-32 px-6 font-inter">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. NEW: Top Description / Page Intro */}
        <header className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-12 bg-emerald-500"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
              Technical Archive
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-slate-900 mb-10">
            The <br /> Masterclass<span className="text-emerald-500">.</span>
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-slate-500 font-light leading-relaxed italic">
            A  collection of drills, gear reviews, and tactical breakdowns 
            designed for the serious player. No fluff—just the math and mechanics 
            behind the perfect break.
          </p>
        </header>

        <div className="flex flex-col">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Link 
                key={post.slug} 
                href={`/articles/${post.slug}`}
                className="group border-b border-slate-100 py-16 flex flex-col md:flex-row items-start justify-between hover:bg-slate-50/50 px-0 md:hover:px-8 transition-all duration-500 ease-in-out"
              >
                <div className="flex flex-col gap-4 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      {new Date(post._createdAt).toLocaleDateString('en-NZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="h-[1px] w-4 bg-slate-200"></span>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                      Confirmed Entry
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-emerald-600 transition-colors leading-none">
                    {post.title}
                  </h2>

                  {/* 2. NEW: Article Snippet */}
                  <p className="text-slate-500 text-lg font-medium leading-relaxed mt-2 line-clamp-2 md:line-clamp-none">
                    {post.snippet}
                  </p>
                </div>

                {post.mainImage && (
                  <div className="relative w-full md:w-72 h-44 mt-8 md:mt-0 overflow-hidden rounded-[2rem] border border-slate-100 shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500 shrink-0">
                    <Image 
                      src={urlFor(post.mainImage).url()} 
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                )}
              </Link>
            ))
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[4rem]">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
                The Lab is currently empty. Standby for technical data.
              </p>
            </div>
          )}
        </div>

        <div className="mt-32 pt-12 border-t border-slate-100">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors">
            ← Return to Table
          </Link>
        </div>
      </div>
    </main>
  );
}