import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// This function goes into your folders and finds the actual articles
async function getArticlesByCategory(category: string) {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  
  // Check if the directory exists so the server doesn't crash
  if (!fs.existsSync(articlesDirectory)) return [];

  const filenames = fs.readdirSync(articlesDirectory);

  const articles = filenames.map((filename) => {
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace('.md', '').replace('.mdx', ''),
      title: data.title || 'Untitled Article',
      excerpt: data.excerpt || '',
      date: data.date || '',
      category: data.category?.toLowerCase() || '',
    };
  });

  // Filter the articles to only show the ones for the current category
  return articles.filter(article => article.category === category.toLowerCase());
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // Validation
  const validCategories = ['pool', 'snooker'];
  if (!validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  // Get the real articles from your folders
  const articles = await getArticlesByCategory(category);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Category Header */}
      <section className="relative py-24 bg-emerald-900/5 border-b border-emerald-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#064e3b_0%,transparent_100%)] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-sky-500 font-space-grotesk font-bold tracking-[0.3em] uppercase text-xs">
            Pot The Black Archives
          </span>
          <h1 className="mt-4 font-space-grotesk text-6xl md:text-8xl font-black uppercase italic tracking-tighter">
            {category}<span className="text-emerald-500">.</span>
          </h1>
          <p className="mt-6 font-inter text-slate-400 text-lg max-w-xl leading-relaxed">
            Technical breakdowns and grounded advice for {category} players.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {articles.length > 0 ? (
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
                  <p className="mt-4 font-inter text-slate-400 leading-relaxed flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-8 flex items-center text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-tighter">
                    Read Breakdown 
                    <span className="ml-2 text-sky-500 group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-emerald-900/30 rounded-3xl">
            <p className="font-inter text-slate-500 italic">No articles tagged as "{category}" found yet, mate.</p>
          </div>
        )}
      </section>
    </div>
  );
}