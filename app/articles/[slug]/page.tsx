import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

// ==================== DYNAMIC METADATA ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        "snippet": array::join(string::split(pt::text(body), "")[0...160], ""),
        mainImage,
        _createdAt,
        _updatedAt,
        "authorName": author->name,
        "categories": categories[]->title
      }`,
      { slug }
    );

    if (!post) {
      return {
        title: "Masterclass Not Found | Pot The Black",
      };
    }

    const description = post.excerpt || post.snippet + "...";
    const canonicalUrl = `https://pottheblack.com/articles/${slug}`;

    return {
      title: `${post.title} | Pot The Black`,
      description,
      keywords: [
        "pool technique",
        "snooker",
        "billiards",
        "high bridge",
        "pool tutorial",
        "snooker tutorial",
        ...(post.categories || []),
      ],
      authors: post.authorName ? [{ name: post.authorName }] : undefined,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post._createdAt,
        modifiedTime: post._updatedAt || post._createdAt,
        url: canonicalUrl,
        images: post.mainImage
          ? [
              {
                url: urlFor(post.mainImage).width(1200).height(630).url(),
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.mainImage
          ? [urlFor(post.mainImage).width(1200).height(630).url()]
          : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Pot The Black Masterclass",
      description: "Advanced pool and snooker technique articles",
    };
  }
}

// ==================== JSON-LD SCHEMA ====================
function ArticleJsonLd({ post, slug }: { post: any; slug: string }) {
  const url = `https://pottheblack.com/articles/${slug}`;
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).url() : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.snippet || "",
    datePublished: post._createdAt,
    dateModified: post._updatedAt || post._createdAt,
    image: imageUrl ? [imageUrl] : [],
    author: {
      "@type": "Person",
      name: post.authorName || "Pot The Black",
    },
    publisher: {
      "@type": "Organization",
      name: "Pot The Black",
      logo: {
        "@type": "ImageObject",
        url: "https://pottheblack.com/logo.png", 
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbJsonLd({ slug, title }: { slug: string; title: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pottheblack.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://pottheblack.com/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://pottheblack.com/articles/${slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==================== PORTABLE TEXT COMPONENTS ====================
const ptComponents = {
  // --- THE LINK FIX: Marks define how styling is applied to text ---
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          className="text-emerald-600 font-bold underline decoration-emerald-200 underline-offset-4 hover:text-emerald-700 transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-black text-slate-900">{children}</strong>
    ),
  },
  types: {
    code: ({ value }: any) => {
      if (!value?.code) return null;
      const isHtml = value.language === "html" || value.code.trim().startsWith("<");
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
      <blockquote className="border-l-8 border-emerald-500 pl-8 my-16 italic