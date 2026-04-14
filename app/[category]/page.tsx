import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Adjust this import path to match your Sanity client location
import { client } from '@/sanity/lib/client';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getArticlesByCategory(categorySlug: string) {
  // This query looks for posts where the referenced category has the slug we want
  const query = `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    "excerpt": excerpt,
    "date": publishedAt,
    "categoryTitle": category->title
  }`;

  try {
    const articles = await client.fetch(query, { categorySlug });
    return articles;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // We only want to handle our two main game types here
  const validCategories = ['pool', 'snooker'];
  const currentCategory = category.toLowerCase().trim();

  if (!validCategories.includes(currentCategory)) {
    notFound();
  }

  const articles = await getArticlesByCategory(currentCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-inter">
      {/* Header Section */}
      <header className="py-24 bg-emerald-900/5 border-b border-emerald-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[2px] w-12 bg-sky-500"></span>
            <span className="text-sky-500 font-space-grotesk font-bold tracking-widest uppercase text-xs">
              The Vault
            </span>
          </div>
          <h1 className="font-space-grotesk text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            {category}<span className="text-sky-500">.</span>
          </h1>
          <p className="mt-8 text-slate-400 text-lg max-w-2xl leading-relaxed">
            From the RSA floors to the professional circuit. Here’s every breakdown, 
            drill, and mental hack we’ve got for {category}.
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {articles.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="group relative flex flex-col p-8 bg-slate-900/40 border border-emerald-900/20 rounded-2xl hover:border-sky-500/50 transition-all duration-300 shadow-2xl"
              >
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-6 block">
                  {article.date ? new Date(article.date).toLocaleDateString('en-NZ', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  }) : 'Recently Published'}
                </span>
                
                <h2 className="font-space-grotesk text-2xl font-bold group-hover:text-sky-500 transition-colors leading-tight">
                  {article.title}
                </h2>
                
                <p className="mt-4 text-slate-400 text-sm leading-relaxed flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-8 pt-6 border-t border-emerald-900/10 flex items-center text-xs font-black text-slate-300 uppercase tracking-tighter group-hover:text-white transition-colors">
                  View Full Breakdown 
                  <span className="ml-2 text-sky-500 group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-emerald-900/10 rounded-3xl bg-emerald-900/5">
            <p className="font-inter text-slate-500 italic text-xl">
              The rack is empty for "{category}" at the moment, mate. 
              <br />
              <span className="text-sm mt-3 block not-italic font-medium text-slate-600">
                Check your Sanity Studio to ensure posts are tagged with the correct category slug.
              </span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}