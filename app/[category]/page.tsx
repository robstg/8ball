import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// If you have a function to fetch articles from a CMS or local files:
// import { getArticlesByCategory } from '@/lib/content';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js 15+, you MUST await params
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // 1. Validation: Only allow specific categories
  const validCategories = ['pool', 'snooker'];
  
  if (!validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  // 2. Mock Data: Replace this with your actual fetch call
  // const articles = await getArticlesByCategory(category);
  const articles = [
    { 
      title: "Mastering the 'Stop' Shot", 
      slug: "mastering-the-stop-shot", 
      excerpt: "The most important shot in the game. Period.",
      date: "April 14, 2026"
    },
    { 
      title: "Table Mapping 101", 
      slug: "table-mapping-guide", 
      excerpt: "How to read the cushions before you even pick up your cue.",
      date: "April 10, 2026"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Category Header */}
      <section className="relative py-24 bg-emerald-900/5 border-b border-emerald-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#064e3b_0%,transparent_100%)] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-sky-500 font-space-grotesk font-bold tracking-[0.3em] uppercase text-xs">
            The Baize Archives
          </span>
          <h1 className="mt-4 font-space-grotesk text-6xl md:text-8xl font-black uppercase italic tracking-tighter">
            {category}<span className="text-emerald-500">.</span>
          </h1>
          <p className="mt-6 font-inter text-slate-400 text-lg max-w-xl leading-relaxed">
            Technical breakdowns and grounded advice for {category} players who actually want to improve their percentage under pressure.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/articles/${article.slug}`}
              className="group block relative p-[1px] rounded-2xl bg-gradient-to-b from-emerald-900/40 to-transparent hover:from-sky-500/50 transition-all duration-500 shadow-xl shadow-black/50"
            >
              <div className="bg-slate-950 p-8 rounded-[15px] h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
                    {article.date}
                  </span>
                </div>
                
                <h2 className="font-space-grotesk text-2xl font-bold group-hover:text-sky-500 transition-colors duration-300">
                  {article.title}
                </h2>
                <p className="mt-4 font-inter text-slate-400 leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="mt-8 flex items-center text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-tighter">
                  View Drill 
                  <span className="ml-2 text-sky-500 group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-32 border border-dashed border-emerald-900/30 rounded-3xl">
            <p className="font-inter text-slate-500 italic">Rack 'em up... no articles found here yet, mate.</p>
          </div>
        )}
      </section>
    </div>
  );
}