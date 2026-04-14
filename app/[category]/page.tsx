import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Import your Sanity client - usually kept in @/lib/sanity or @/sanity/lib/client
import { client } from '@/sanity/lib/client'; 

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// This function talks to Sanity
async function getArticlesByCategory(categorySlug: string) {
  // We're asking Sanity for posts where the category's slug matches our URL
  const query = `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    "excerpt": excerpt,
    "date": publishedAt,
    "category": category->title
  }`;

  const articles = await client.fetch(query, { categorySlug });
  return articles;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Validation so we don't try to query random junk
  const validCategories = ['pool', 'snooker'];
  if (!validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  const articles = await getArticlesByCategory(category.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="py-20 bg-emerald-900/10 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-sky-500 font-space-grotesk font-bold tracking-widest uppercase text-xs">
            The Baize Archive
          </span>
          <h1 className="mt-4 font-space-grotesk text-7xl font-black uppercase italic text-white leading-none">
            {category}<span className="text-sky-500">.</span>
          </h1>
          <p className="mt-6 text-slate-400 font-inter text-lg max-w-xl">
            Technical breakdowns and grounded advice for serious {category} players. 
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="group block p-8 bg-slate-900/40 border border-emerald-900/20 rounded-2xl hover:border-sky-500/50 transition-all shadow-xl"
              >
                <div className="flex flex-col h-full">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase mb-4">
                    {new Date(article.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h2 className="font-space-grotesk text-2xl font-bold group-hover:text-sky-500 transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-4 font-inter text-slate-400 leading-relaxed flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="mt-8 flex items-center text-xs font-black text-sky-500 uppercase italic">
                    Read Breakdown →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-emerald-900/20 rounded-3xl bg-slate-900/10">
            <p className="font-inter text-slate-500 italic text-lg">
              No articles found in the "{category}" category yet, mate. 
              <br />
              <span className="text-sm mt-2 block">Make sure your Sanity posts are linked to the correct category.</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}