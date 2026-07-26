import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HtmlEmbed } from "@/components/html-embed";

interface Props {
  params: Promise<{ slug: string }>;
}

// ==================== DYNAMIC METADATA ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tool = await client.fetch(
      `*[_type == "tool" && slug.current == $slug][0]{
        title,
        shortDescription,
        seoTitle,
        seoDescription
      }`,
      { slug }
    );

    if (!tool) {
      return { title: "Tool Not Found | Pot The Black" };
    }

    const title = tool.seoTitle || `${tool.title} | Pot The Black`;
    const description = tool.seoDescription || tool.shortDescription || "";
    const canonicalUrl = `https://pottheblack.com/tools/${slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Tool metadata error:", error);
    return { title: "Pot The Black Tools" };
  }
}

// ==================== JSON-LD SCHEMA ====================
function ToolJsonLd({ tool, slug }: { tool: any; slug: string }) {
  const url = `https://pottheblack.com/tools/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.shortDescription || "",
    url,
    applicationCategory: "SportsApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://pottheblack.com" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://pottheblack.com/tools" },
      { "@type": "ListItem", position: 3, name: title, item: `https://pottheblack.com/tools/${slug}` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ==================== PORTABLE TEXT (intro copy) ====================
const introComponents: PortableTextComponents = {
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
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 text-slate-700 leading-relaxed text-xl font-light">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-heading text-3xl font-black italic uppercase mt-16 mb-8 text-slate-900 tracking-tighter">
        {children}
      </h2>
    ),
  },
};

// ==================== MAIN PAGE ====================
export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  try {
    const data = await client.fetch(
      `{
        "tool": *[_type == "tool" && slug.current == $slug][0]{
          title,
          shortDescription,
          category,
          icon,
          intro,
          fullWidth,
          embed{ html, code, caption },
          relatedArticles[]->{
            title,
            "slug": slug.current,
            mainImage
          }
        }
      }`,
      { slug }
    );

    if (!data?.tool) {
      return <div className="pt-40 text-center">Tool not found</div>;
    }

    const tool = data.tool;
    const embedMarkup = tool.embed?.html || tool.embed?.code;

    return (
      <div className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
        <ToolJsonLd tool={tool} slug={slug} />
        <BreadcrumbJsonLd slug={slug} title={tool.title} />

        <div className="flex items-center gap-4 mb-10 flex-wrap">
          <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">
            Tool
          </span>
          {tool.category && (
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              {tool.category}
            </span>
          )}
        </div>

        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black italic uppercase mb-10 leading-[0.9] tracking-tighter text-slate-900">
          {tool.icon && <span className="mr-3">{tool.icon}</span>}
          {tool.title}
        </h1>

        {tool.intro && (
          <div className="w-full prose prose-slate prose-lg md:prose-xl max-w-none mb-4">
            <PortableText value={tool.intro} components={introComponents} />
          </div>
        )}

        {embedMarkup && (
          <div
            className={
              tool.fullWidth
                ? "my-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white"
                : "my-16 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl flex justify-center"
            }
          >
            <HtmlEmbed
              html={embedMarkup}
              className={
                tool.fullWidth
                  ? "w-full text-slate-900"
                  : "w-full max-w-full overflow-auto text-slate-900"
              }
            />
          </div>
        )}
        {tool.embed?.caption && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-16 italic text-center font-bold">
            {tool.embed.caption}
          </p>
        )}

        {tool.relatedArticles?.length > 0 && (
          <section className="mt-32 pt-20 border-t border-slate-100">
            <h2 className="font-heading text-3xl font-black uppercase italic tracking-tighter mb-12 text-slate-900">
              Related Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tool.relatedArticles.map((p: any) => (
                <Link key={p.slug} href={`/articles/${p.slug}`} className="group">
                  {p.mainImage && (
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-2xl border border-slate-100 shadow-md">
                      <Image
                        src={urlFor(p.mainImage).url()}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-black uppercase italic leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-24 pt-10 border-t border-slate-100 flex justify-between items-center">
          <Link
            href="/tools"
            className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors"
          >
            ← All Tools
          </Link>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Pot The Black © 2026
          </span>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Tool page error:", error);
    return (
      <div className="pt-40 text-center text-slate-600">
        Something went wrong loading this tool. Please try again later.
      </div>
    );
  }
}
