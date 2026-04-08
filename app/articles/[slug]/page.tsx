import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // If this errors, check your folder path!
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

// This tells the "Waiter" how to handle images in the text
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-10">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Article Image"}
            width={800}
            height={500}
            className="rounded-xl h-auto w-full"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 mt-2 italic">{value.caption}</p>
          )}
        </div>
      );
    },
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Article not found</h1>
          <Link href="/" className="text-green-500 underline mt-4 block">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto pt-32 pb-20 px-6 bg-[#0a0a0a] text-white min-h-screen">
      <h1 className="text-4xl md:text-7xl font-black italic uppercase mb-12 leading-tight">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-12">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={1200} 
            height={675} 
            className="rounded-3xl border border-white/5 shadow-2xl"
            priority
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-300">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      <div className="mt-20 pt-10 border-t border-white/5">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 hover:text-green-500 transition-colors">
          ← Back to Masterclasses
        </Link>
      </div>
    </article>
  );
}