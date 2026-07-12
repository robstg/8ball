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
        author->{
          name,
          bio
        },
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
      title: `${post.title}`,
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
      authors: post.author?.name ? [{ name: post.author.name }] : undefined,
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
      name: post.author?.name || "Pot The Black",
      description: post.author?.bio || undefined,
      url: post.author?.website || undefined,
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

// ==================== SHARE BUTTONS ====================
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://pottheblack.com/articles/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(`${title} — via Pot the Black`);

  return (
    <div className="flex items-center gap-3 my-12 pt-8 border-t border-slate-100 flex-wrap">
      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 mr-1">
        Share
      </span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-[0.65rem] font-black uppercase tracking-widest px-3 py-2 border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-[0.65rem] font-black uppercase tracking-widest px-3 py-2 border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${encoded}`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-[0.65rem] font-black uppercase tracking-widest px-3 py-2 border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
      >
        WhatsApp
      </a>
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
    // NEW: renderer for the custom `htmlEmbed` schema type.
    // This was missing entirely, which is why embeds showed up fine in the
    // Studio preview component but never rendered on the live page —
    // PortableText silently skips any block type it has no component for.
    htmlEmbed: ({ value }: any) => {
      const markup = value?.html || value?.code;
      if (!markup) return null;
      return (
        <div className="my-16 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl flex justify-center">
          <div
            className="w-full max-w-full overflow-auto text-slate-900"
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        </div>
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
      <p className="mb-8 text-slate-700 leading-relaxed text-xl font-light font-body max-w-none w-full">
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
          author->{
            name,
            bio,
            image,
            twitter,
            website
          },
          excerpt,
          "snippet": array::join(string::split(pt::text(body), "")[0...160], ""),
          body[]{
            ...,
            _type == "code" => { code, language },
            _type == "htmlEmbed" => { html, code, caption }
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
      return <div className="pt-40 text-center">Article not found</div>;
    }

    const post = data.post;

    return (
      <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
        {/* PTB-DEPLOY-v2 */}
        <ArticleJsonLd post={post} slug={slug} />
        <BreadcrumbJsonLd slug={slug} title={post.title} />

        <div className="flex items-center gap-4 mb-10 flex-wrap">
          <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">
            Masterclass
          </span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            {new Date(post._createdAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {post._updatedAt && post._updatedAt !== post._createdAt && (
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              • Updated{" "}
              {new Date(post._updatedAt).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black italic uppercase mb-10 leading-[0.9] tracking-tighter w-full text-slate-900">
          {post.title}
        </h1>

        {post.mainImage && (
          <div className="mb-24 w-full">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={`${post.title} - Pool Snooker Technique`}
              width={2400}
              height={1350}
              className="rounded-[3rem] border border-slate-100 shadow-2xl w-full h-auto"
              priority
            />
          </div>
        )}

        <div className="w-full prose prose-slate prose-lg md:prose-xl max-w-none drop-cap">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        <ShareButtons title={post.title} slug={slug} />

        {/* AUTHOR BIO BOX CONTAINER */}
        {post.author && (
          <div className="my-20 p-8 rounded-[2rem] border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
            {post.author.image && (
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-inner">
                <Image
                  src={urlFor(post.author.image).width(160).height(160).url()}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-2 font-heading italic">
                About {post.author.name}
              </h3>
              <p className="text-base text-slate-600 font-light leading-relaxed mb-4">
                {post.author.bio}
              </p>
              <div className="flex justify-center sm:justify-start gap-4 text-[0.65rem] font-black uppercase tracking-widest text-slate-400">
                {post.author.twitter && (
                  <Link
                    href={post.author.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    X / Twitter
                  </Link>
                )}
                {post.author.website && (
                  <Link
                    href={post.author.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Website
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="mt-40 pt-20 border-t border-slate-100">
          <h2 className="font-heading text-4xl font-black uppercase italic tracking-tighter mb-12 text-slate-900">
            More from the Table
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.morePosts.map((p: any) => (
              <Link
                key={p.slug}
                href={`/articles/${p.slug}`}
                className="group"
              >
                <div className="relative aspect-video mb-4 overflow-hidden rounded-2xl border border-slate-100 shadow-md">
                  <Image
                    src={urlFor(p.mainImage).url()}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-black uppercase italic leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-24 pt-10 border-t border-slate-100 flex justify-between items-center">
          <Link
            href="/articles"
            className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors"
          >
            ← Back to Articles
          </Link>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Pot The Black © 2026
          </span>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Article page error:", error);
    return (
      <div className="pt-40 text-center text-slate-600">
        Something went wrong loading this article. Please try again later.
      </div>
    );
  }
}
