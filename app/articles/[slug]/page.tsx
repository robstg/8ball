import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic Metadata for Global Authority
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "snippet": array::join(string::split(pt::text(body), "")[0...160], "")
    }`, 
    { slug }
  );

  if (!post) {
    return {
      title: "Masterclass Not Found | Pot The Black",
    };
  }

  return {
    title: post.title,
    description: post.snippet + "...",
    openGraph: {
      title: `${post.title} | Pot The Black`,
      description: post.snippet,
      type: 'article',
    },
  };
}

const ptComponents = {
  types: {
    code: ({ value }: any) => {
      if (!value?.code) return null;
      const isHtml = value.language === 'html' || value.code.trim().startsWith('<');
      if (isHtml) {
        return (
          <div className="my-16 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl flex justify-center">
            <div 
              className="w-full max-w-full overflow-auto text-slate-900"
              dangerouslySetInnerHTML={{ __html: value.code }} 
            />
          </div>
        );
      }
      return (
        <pre className="my-10 p-6 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400 text-sm font-mono">
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-6 italic text-center font-bold">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="font-heading text-3xl md:text-5xl font-black italic uppercase mt-24 mb-10 text-slate-900 tracking-tighter leading-[0.9]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-bold uppercase mt-12 mb-6 text-emerald-600 tracking-[0.3em]">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-8 text-slate-700 leading-relaxed text-xl font-light font-body">
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const data = await client.fetch(`{
    "post": *[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      "publishedAt": _createdAt,
      body[]{
        ...,
        _type == "code" => { code, language }
      }
    },
    "morePosts": *[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...3]{
      title,
      slug,
      mainImage
    }
  }`, { slug });

  if (!data.post) return null;

  return (
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">Masterclass</span>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(data.post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter w-full text-slate-900">
        {data.post.title}
      </h1>

      {data.post.mainImage && (
        <div className="mb-24 w-full">
          <Image 
            src={urlFor(data.post.mainImage).url()} 
            alt={data.post.title} 
            width={2400} 
            height={1350} 
            className="rounded-[3rem] border border-slate-100 shadow-2xl w-full h-auto"
            priority
          />
        </div>
      )}

      <div className="max-w-6xl w-full prose prose-slate prose-lg md:prose-xl !max-w-none">
        <PortableText value={data.post.body} components={ptComponents} />
      </div>

      {/* 2. More from the Lab Archive Section */}
      <section className="mt-40 pt-20 border-t border-slate-100">
        <h2 className="font-heading text-4xl font-black uppercase italic tracking-tighter mb-12 text-slate-900">More from the Lab</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.morePosts.map((p: any) => (
            <Link key={p.slug.current} href={`/articles/${p.slug.current}`} className="group">
              <div className="relative aspect-video mb-4 overflow-hidden rounded-2xl border border-slate-100 shadow-md">
                <Image src={urlFor(p.mainImage).url()} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <h3 className="text-lg font-black uppercase italic leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors">{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-24 pt-10 border-t border-slate-100 flex justify-between items-center">
        <Link href="/articles" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Pot The Black © 2026</span>
      </div>
    </article>
  );
}