import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    "publishedAt": _createdAt
  }`, { slug: params.slug });

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h1 className="text-2xl font-bold">Article not found.</h1>
        <Link href="/" className="mt-4 text-green-500 underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="text-green-500 font-black uppercase tracking-widest text-xs">Masterclass</span>
        
        <h1 className="text-4xl md:text-6xl font-black italic uppercase mt-4 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-invert prose-green max-w-none text-gray-300 leading-relaxed text-lg">
          <PortableText value={post.body} />
        </div>
        
        <div className="mt-20 border-t border-white/10 pt-10">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest hover:text-green-500 transition-colors">
            ← Back to Pot The Black
          </Link>
        </div>
      </div>
    </article>
  );
}