import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

// THE FIX: This tells the server to check for new posts every time someone visits.
// No more "ghosting" new articles.
export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  // We're pulling the publishedAt date specifically to keep the timeline clinical.
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    mainImage,
    _createdAt,
    "publishedAt": _createdAt
  }`);

  return (
    <main className="min-h-screen bg-white text-slate-900 pt-40 pb-32 px-6 font-inter">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-20 border-b border-slate-100 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-12 bg-emerald-500"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
              Technical Archive
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-slate-900">
            The <br /> Masterclass<span className="text-emerald-500">.</span>
          </h1>
        </header>

        <div className="flex flex-col">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Link 
                key={post.slug} 
                href={`/articles/${post.slug}`}
                className="group border-b border-slate-100 py-16 flex flex-col md:flex-row items-center justify-between hover:px-8 transition-all duration-500 ease-in-out"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="h-[1px] w-4 bg-slate-200"></span>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                      Confirmed Entry
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter group-hover:text-emerald-600 transition-colors leading-none">
                    {post.title}
                  </h2>
                </div>

                {post.mainImage && (
                  <div className="relative w-full md:w-64 h-40 mt-8 md:mt-0 overflow-hidden rounded-[2rem] border border-slate-100 shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
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