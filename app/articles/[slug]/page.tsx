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
        <div className="my-14 group">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Pot The Black Diagram"}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-4 italic text-center">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-4xl md:text-5xl font-black italic uppercase mt-20 mb-8 text-white tracking-tighter leading-none">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold uppercase mt-12 mb-6 text-green-500 tracking-widest">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-8 text-gray-300 leading-relaxed text-xl font-light">
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
    // CHANGED: max-w-3xl -> max-w-5xl and added more horizontal padding
    <article className="max-w-5xl mx-auto pt-32 pb-20 px-6 md:px-12 lg:px-16 bg-[#0a0a0a] text-white min-h-screen">
      
      {/* Article Meta */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-green-500 text-[10px] font-black uppercase px-2 py-0.5 text-black">Masterclass</span>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase mb-16 leading-[0.8] tracking-tighter">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-20">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={1600} // Increased width for better resolution on wider layout
            height={900} 
            className="rounded-[2rem] border border-white/5 shadow-2xl transition-opacity duration-700"
            priority
          />
        </div>
      )}

      {/* Renders the body content - added prose-lg and prose-xl for wider text scaling */}
      <div className="prose prose-invert max-w-none prose-lg md:prose-xl prose-p:leading-relaxed prose-strong:text-white prose-strong:font-bold">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      <div className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-green-500 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-gray-800 font-bold uppercase">Pot The Black © 2026</span>
      </div>
    </article>
  );
}