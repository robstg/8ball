import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { cn, getCategoryStyles } from '@/lib/utils'; // 1. Use our new utility
import { Microscope, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getArticlesByCategory(categorySlug: string) {
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

  const validCategories = ['pool', 'snooker'];
  const currentCategory = category.toLowerCase().trim();

  if (!validCategories.includes(currentCategory)) {
    notFound();
  }

  const articles = await getArticlesByCategory(currentCategory);
  
  // 2. Get the dynamic color theme for this category
  const themeStyles = getCategoryStyles(currentCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Header Section - Clean & Industrial */}
      <header className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 mb-6">
            <Microscope size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Technical Archive</span>
          </div>
          
          <h1 className="font-[family-name:var(--font-heading)] text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            {category}<span className="text-emerald-500">.</span>
          </h1>
          
          <p className="mt-8 text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
            Advanced mechanical analysis, structural drills, and physics-based breakdowns specifically for <span className="text-slate-900 font-bold capitalize">{category}</span> discipline.
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="group relative flex flex-col p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
              >
                {/* 3. Category Badge using the Dynamic Theme */}
                <div className="mb-8">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5",
                        themeStyles
                    )}>
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                        {category}
                    </span>
                </div>
                
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors leading-none mb-4">
                  {article.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed flex-grow line-clamp-3 font-medium">
                  {article.excerpt}
                </p>
                
                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {article.date ? new Date(article.date).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' }) : 'Report Pending'}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-all shadow-lg">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
            <Microscope className="mx-auto text-slate-200 mb-6" size={64} strokeWidth={1} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No reports found in the "{category}" archive.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}