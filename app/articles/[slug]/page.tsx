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
    // These style the Headings you pick in the Sanity dropdown
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-black italic uppercase mt-16 mb-6 text-white tracking-tighter">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold uppercase mt-10 mb-4 text-green-500 tracking-widest">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-gray-300 leading-relaxed text-lg font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-green-500 pl-6 my-10 italic text-2xl font-medium text-white/90">
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
    <article className="max-w-3xl mx-auto pt-32 pb-20 px-6 bg-[#0a0a0a] text-white min-h-screen">
      {/* Article Meta */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-green-500 text-[10px] font-black uppercase px-2 py-0.5 text-black">Masterclass</span>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-5xl md:text-8xl font-black italic uppercase mb-12 leading-[0.85] tracking-tighter">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-16">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={1200} 
            height={675} 
            className="rounded-3xl border border-white/5 shadow-2xl transition-opacity duration-700"
            priority
          />
        </div>
      )}

      {/* This renders the body content using our new ptComponents manual */}
      <div className="prose prose-invert max-w-none">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      <div className="mt-24 pt-10 border-t border-white/5 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-green-500 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-gray-800 font-bold uppercase">Pot The Black © 2026</span>
      </div>
    </article>
  );
}