import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

// Custom "Manual" to style every piece of content coming from Sanity
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-16 group">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Pot The Black Masterclass"}
              width={2000} 
              height={1125}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-6 italic text-center">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    // Balanced H2 - Impactful but readable
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-5xl font-black italic uppercase mt-24 mb-10 text-white tracking-tighter leading-[0.9]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-bold uppercase mt-12 mb-6 text-green-500 tracking-[0.3em]">
        {children}
      </h3>
    ),
    // Normal text - Optimized for wider reading
    normal: ({ children }: any) => (
      <p className="mb-8 text-gray-400 leading-relaxed text-xl font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-8 border-green-500 pl-8 my-16 italic text-3xl font-medium text-white/90 leading-snug">
        {children}
      </blockquote>
    ),
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    mainImage,
    "publishedAt": _createdAt
  }`, { slug });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-black uppercase tracking-widest">
        <div className="text-center">
          <h1 className="text-xl">Article not found</h1>
          <Link href="/" className="text-green-500 underline mt-4 block text-xs">Return to Table</Link>
        </div>
      </div>
    );
  }

  return (
    // Widened to 6xl for a more cinematic "broadcast" feel
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 bg-[#0a0a0a] text-white min-h-screen">
      
      {/* Article Meta */}
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-green-500 text-[10px] font-black uppercase px-3 py-1 text-black tracking-widest">Masterclass</span>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Headline - Removed max-w-4xl so it can expand to full 6xl width */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter w-full">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-24">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={2400} 
            height={1350} 
            className="rounded-[3rem] border border-white/5 shadow-2xl transition-opacity duration-700"
            priority
          />
        </div>
      )}

      {/* 1. max-w-none on the main div removes the outer container limit.
  2. prose-p:max-w-none removes the 'skinny' limit specifically from paragraphs.
  3. prose-headings:max-w-none does the same for H2s and H3s.
*/}
<div className="prose prose-invert max-w-none prose-lg md:prose-xl 
                prose-p:max-w-none 
                prose-headings:max-w-none 
                prose-p:leading-relaxed 
                prose-strong:text-white 
                prose-strong:font-bold">
  <PortableText value={post.body} components={ptComponents} />
</div>
      <div className="mt-40 pt-10 border-t border-white/5 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 hover:text-green-500 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">Pot The Black © 2026</span>
      </div>
    </article>
  );
}