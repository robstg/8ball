import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Interactive Cue Sports Tools | Pot The Black",
  description:
    "Free interactive tools for pool and snooker players — bracket and draw makers, calculators, and more.",
  alternates: {
    canonical: "https://pottheblack.com/tools",
  },
};

interface ToolCard {
  title: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  icon?: string;
}

function CollectionJsonLd({ tools }: { tools: ToolCard[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cue Sports Tools",
    description: "Interactive tools for pool and snooker players.",
    url: "https://pottheblack.com/tools",
    hasPart: tools.map((t) => ({
      "@type": "WebApplication",
      name: t.title,
      url: `https://pottheblack.com/tools/${t.slug}`,
      applicationCategory: "SportsApplication",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ToolsHubPage() {
  const tools: ToolCard[] = await client.fetch(
    `*[_type == "tool" && featured == true] | order(coalesce(order, 999) asc, _createdAt desc){
      title,
      "slug": slug.current,
      shortDescription,
      category,
      icon
    }`
  );

  return (
    <div className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
      <CollectionJsonLd tools={tools} />

      <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">
        Tools
      </span>

      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black italic uppercase mt-8 mb-6 leading-[0.9] tracking-tighter text-slate-900">
        Cue Sports Tools
      </h1>

      <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl mb-20">
        Free interactive tools built for players and club organisers — bracket
        makers, calculators, and more, all running right in your browser.
      </p>

      {tools.length === 0 ? (
        <p className="text-slate-400">No tools published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block rounded-[2rem] border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all p-10"
            >
              <div className="flex items-start gap-5">
                {tool.icon && (
                  <span className="text-4xl leading-none">{tool.icon}</span>
                )}
                <div>
                  {tool.category && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                      {tool.category}
                    </span>
                  )}
                  <h2 className="font-heading text-2xl font-black italic uppercase mt-2 mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                    {tool.title}
                  </h2>
                  {tool.shortDescription && (
                    <p className="text-slate-600 font-light leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-24 pt-10 border-t border-slate-100">
        <Link
          href="/articles"
          className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors"
        >
          ← Back to Articles
        </Link>
      </div>
    </div>
  );
}