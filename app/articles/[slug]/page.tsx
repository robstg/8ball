import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

const ptComponents = {
  types: {
    code: ({ value }: any) => {
      if (!value?.code) return null;

      const isHtml = value.language === 'html' || value.code.trim().startsWith('<');

      if (isHtml) {
        return (
          /* Rob's Note: Changed to a light, clean container for the comparison tables */
          <div className="my-16 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl flex justify-center">
            <div 
              className="w-full max-w-full overflow-auto text-slate-900"
              dangerouslySetInnerHTML={{ __html: value.code }} 
            />
          </div>
        );
      }
      
      return (
        <pre className="my-10 p-6 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400 text-sm">
          <code>{value.code}</code>
        </pre>
      );
    },

    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-16 group">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Pot The Black Masterclass"}
              width={2000} 
              height={1125}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-6 italic text-center">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-5xl font-black italic uppercase mt-24 mb-10 text-slate-900 tracking-tighter leading-[0.9]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-bold uppercase mt-12 mb-6 text-emerald-600 tracking-[0.3em]">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-8 text-slate-700 leading-relaxed text-xl font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-8 border-emerald-500 pl-8 my-16 italic text-3xl font-medium text-slate-800 leading-snug">
        {children}
      </blockquote>
    ),
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    mainImage,
    "publishedAt": _createdAt,
    body[]{
      ...,
      _type == "code" => {
        code,
        language
      }
    }
  }`, { slug });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 uppercase tracking-widest font-black">
        <div className="text-center">
          <h1 className="text-xl">Post not found</h1>
          <Link href="/" className="text-emerald-600 underline mt-4 block text-xs font-bold uppercase">Return to Table</Link>
        </div>
      </div>
    );
  }

  return (
    /* Rob's Note: Removed bg-[#0a0a0a] and text-white. Now sits on the layout's white background. */
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen">
      
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">Masterclass</span>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter w-full text-slate-900">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-24 w-full">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={2400} 
            height={1350} 
            className="rounded-[3rem] border border-slate-100 shadow-2xl w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Rob's Note: Removed prose-invert so the text is dark by default */}
      <div className="max-w-6xl w-full prose prose-slate prose-lg md:prose-xl !max-w-none">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      <div className="mt-40 pt-10 border-t border-slate-100 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Pot The Black © 2026</span>
      </div>
    </article>
  );
}