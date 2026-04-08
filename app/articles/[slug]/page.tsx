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
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 bg-[#0a0a0a] text-white min-h-screen">
      
      {/* 1. Article Meta */}
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-green-500 text-[10px] font-black uppercase px-3 py-1 text-black tracking-widest">Masterclass</span>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* 2. Headline */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter w-full">
        {post.title}
      </h1>

      {/* 3. Main Cover Image */}
      {post.mainImage && (
        <div className="mb-24 w-full">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={2400} 
            height={1350} 
            className="rounded-[3rem] border border-white/5 shadow-2xl transition-opacity duration-700 w-full"
            priority
          />
        </div>
      )}

      {/* 4. The Body with "Nuclear" Width Overrides */}
      <div className="max-w-6xl w-full prose prose-invert prose-lg md:prose-xl !max-w-none">
        <style jsx global>{`
          /* Forces all text blocks to ignore the 'skinny' 65ch limit */
          .prose p, 
          .prose h2, 
          .prose h3, 
          .prose ul, 
          .prose ol,
          .prose blockquote {
            max-width: 100% !important;
            width: 100% !important;
          }
        `}</style>
        <PortableText value={post.body} components={ptComponents} />
      </div>

      {/* 5. Footer Navigation */}
      <div className="mt-40 pt-10 border-t border-white/5 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 hover:text-green-500 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">Pot The Black © 2026</span>
      </div>
    </article>
  );
}