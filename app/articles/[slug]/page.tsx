import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

// Enhanced dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "excerpt": coalesce(excerpt, array::join(string::split(pt::text(body), "")[0...160], "")),
      mainImage,
      publishedAt: _createdAt,
      _updatedAt,
      "author": author->name,
      "categories": categories[]->title
    }`,
    { slug }
  );

  if (!post) {
    return {
      title: "Masterclass Not Found | Pot The Black",
    };
  }

  const canonicalUrl = `https://pottheblack.com/articles/${slug}`;

  return {
    title: `${post.title} | Pot The Black`,
    description: post.excerpt,
    keywords: [
      "pool technique", "snooker", "high bridge", "billiards", "pool tutorial",
      ...(post.categories || []),
    ],
    authors: [{ name: post.author || "Pot The Black" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
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
      description: post.excerpt,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Reusable JSON-LD component (keeps it clean)
function ArticleJsonLd({ post, slug }: { post: any; slug: string }) {
  const url = `https://pottheblack.com/articles/${slug}`;
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).url() : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    image: imageUrl ? [imageUrl] : [],
    author: {
      "@type": "Person",
      name: post.author || "Pot The Black Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Pot The Black",
      logo: {
        "@type": "ImageObject",
        url: "https://pottheblack.com/logo.png", // update with your actual logo URL
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

// Optional: Breadcrumb schema
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

const ptComponents = {
  // ... your existing components (unchanged)
  types: { /* ... */ },
  block: { /* ... */ },
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const data = await client.fetch(
    `{
      "post": *[_type == "post" && slug.current == $slug][0]{
        title,
        mainImage,
        "publishedAt": _createdAt,
        _updatedAt,
        "author": author->name,
        "excerpt": coalesce(excerpt, array::join(string::split(pt::text(body), "")[0...160], "")),
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
    }`,
    { slug }
  );

  if (!data.post) return <div>Article not found</div>;

  const post = data.post;

  return (
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd post={post} slug={slug} />
      <BreadcrumbJsonLd slug={slug} title={post.title} />

      {/* Visible date + category */}
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">
          Masterclass
        </span>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(post.publishedAt).toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        {post._updatedAt && post._updatedAt !== post.publishedAt && (
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            • Updated {new Date(post._updatedAt).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
      </div>

      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter w-full text-slate-900">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-24 w-full">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={`${post.title} - Pool / Snooker Technique`}
            width={2400}
            height={1350}
            className="rounded-[3rem] border border-slate-100 shadow-2xl w-full h-auto"
            priority
          />
        </div>
      )}

      <div className="max-w-6xl w-full prose prose-slate prose-lg md:prose-xl !max-w-none">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      {/* Rest of your page (More from the Lab, footer links) unchanged */}
      {/* ... */}
    </article>
  );
}