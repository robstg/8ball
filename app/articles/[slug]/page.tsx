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

// ==================== AUTHOR BIO ====================
function AuthorBio() {
  return (
    <div className="flex items-start gap-4 my-16 py-6 border-t border-b border-[var(--gold-muted)] max-w-2xl">
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center text-black font-black text-lg">
        R
      </div>
      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">
          About the Author
        </span>
        <p className="text-sm leading-relaxed text-zinc-300">
          Rob is a 20+ year club-level pool and snooker player based in New
          Zealand and the founder of{" "}
          <a
            href="https://pottheblack.com"
            className="text-[var(--gold)] border-b border-[var(--gold-muted)] hover:border-[var(--gold)] transition-colors"
          >
            PottheBlack.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// ==================== PORTABLE TEXT COMPONENTS ====================
const ptComponents = {
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          className="text-[var(--gold)] border-b border-[var(--gold-muted)] hover:border-[var(--gold)] transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-black text-white">{children}</strong>
    ),
  },
  types: {
    code: ({ value }: any) => {
      if (!value?.code) return null;
      const isHtml = value.language === "html" || value.code.trim().startsWith("<");
      if (isHtml) {
        return (
          <div className="my-12 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl flex justify-center">
            <div
              className="w-full max-w-full overflow-auto text-zinc-100"
              dangerouslySetInnerHTML={{ __html: value.code }}
            />
          </div>
        );
      }
      return (
        <pre className="my-10 p-6 bg-zinc-950 rounded-xl border border-zinc-800 overflow-x-auto text-[var(--gold)] text-sm font-mono">
          <code>{value.code}</code>
        </pre>
      );
    },
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-12 group">
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Pot The Black Masterclass"}
              width={2000}
              height={1125}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-4 italic text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-black mt-16 mb-5 text-white tracking-tight leading-tight border-l-[3px] border-[var(--gold)] pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base md:text-lg font-semibold italic mt-10 mb-4 text-zinc-400 tracking-wide">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-7 text-zinc-300 leading-[1.85] text-lg font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-t-2 border-b-2 border-[var(--gold)] my-12 py-5 italic text-2xl font-semibold text-zinc-200 leading-snug text-center">
        {children}
      </blockquote>
    ),
  },
};

// ==================== MAIN PAGE ====================
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  try {
    const data = await client.fetch(
      `{
        "post": *[_type == "post" && slug.current == $slug][0]{
          title,
          mainImage,
          _createdAt,
          _updatedAt,
          "authorName": author->name,
          excerpt,
          "snippet": array::join(string::split(pt::text(body), "")[0...160], ""),
          body[]{
            ...,
            _type == "code" => { code, language }
          }
        },
        "morePosts": *[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...3]{
          title,
          "slug": slug.current,
          mainImage
        }
      }`,
      { slug }
    );

    if (!data?.post) {
      return <div className="pt-40 text-center text-zinc-400">Article not found</div>;
    }

    const post = data.post;

    return (
      <article className="max-w-5xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 min-h-screen">
        <ArticleJsonLd post={post} slug={slug} />
        <BreadcrumbJsonLd slug={slug} title={post.title} />

        {/* ── META LINE ───────────────────────────── */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Gold dash + category pill */}
          <span
            className="inline-block w-5 h-0.5 bg-[var(--gold)] flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Masterclass
          </span>
          <span className="text-zinc-700" aria-hidden="true">·</span>
          <time
            dateTime={post._createdAt}
            className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500"
          >
            {new Date(post._createdAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          {post._updatedAt && post._updatedAt !== post._createdAt && (
            <>
              <span className="text-zinc-700" aria-hidden="true">·</span>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Updated{" "}
                {new Date(post._updatedAt).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {/* ── TITLE ───────────────────────────────── */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase mb-14 leading-[0.88] tracking-tighter text-white">
          {post.title}
        </h1>

        {/* ── HERO IMAGE ──────────────────────────── */}
        {post.mainImage && (
          <div className="mb-16 w-full">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={`${post.title} - Pool Snooker Technique`}
              width={2400}
              height={1350}
              className="rounded-xl border border-zinc-800 shadow-[0_8px_48px_rgba(0,0,0,0.6)] w-full h-auto"
              priority
            />
          </div>
        )}

        {/* ── BODY ────────────────────────────────── */}
        {/*
          First <p> gets the drop cap via CSS first-letter.
          We wrap in article-body so globals.css picks it up.
        */}
        <div className="article-body max-w-2xl">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* ── AUTHOR BIO ──────────────────────────── */}
        <AuthorBio />

        {/* ── RELATED ARTICLES ────────────────────── */}
        <section className="mt-24 pt-12 border-t border-zinc-800">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500 pb-5 border-b border-zinc-800 mb-8">
            More from the Table
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.morePosts.map((p: any) => (
              <Link
                key={p.slug}
                href={`/articles/${p.slug}`}
                className="group"
              >
                <div className="relative aspect-video mb-3 overflow-hidden rounded-lg border border-zinc-800">
                  <Image
                    src={urlFor(p.mainImage).url()}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-black uppercase italic leading-tight text-zinc-200 group-hover:text-[var(--gold)] transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FOOTER BAR ──────────────────────────── */}
        <div className="mt-20 pt-8 border-t border-zinc-800 flex justify-between items-center">
          <Link
            href="/articles"
            className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-[var(--gold)] transition-colors"
          >
            ← Back to Articles
          </Link>
          <span className="text-[0.65rem] text-zinc-700 font-bold uppercase tracking-widest">
            Pot The Black © 2026
          </span>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Article page error:", error);
    return (
      <div className="pt-40 text-center text-zinc-500">
        Something went wrong loading this article. Please try again later.
      </div>
    );
  }
}