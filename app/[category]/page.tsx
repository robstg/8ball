import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// In a real setup, you'd import your fetcher:
// import { getPostsByCategory } from '@/lib/content';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // 1. Validation: Only allow specific categories to prevent 
  // this route from trying to render every broken URL.
  const validCategories = ['pool', 'snooker'];
  
  if (!validCategories.includes(category.toLowerCase())) {
    notFound(); // Sends them to the 404 page if it's not a real category
  }

  // 2. Mock Data: Replace this with your actual DB/Markdown fetch
  const posts = [
    { 
      title: "The Physics of the Draw Shot", 
      slug: "physics-draw-shot", 
      excerpt: "Why most players fail to get the white back across the table.",
      date: "April 12, 2026"
    },
    { 
      title: "RSA Etiquette: Don't Be That Guy", 
      slug: "pool-hall-etiquette", 
      excerpt: "Grounded advice on how to carry yourself in a tournament environment.",
      date: "April 10, 2026"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-emerald-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#064e3b_0%,transparent_70%)] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-sky-500 font-space-grotesk font-bold tracking-[0.2em] uppercase text-sm">
            Category Archive
          </span>
          <h1 className="text-6xl md:text-8xl font-space-grotesk font-black text-slate-50 mt-4 capitalize italic">
            {category}<span className="text-emerald-500">.</span>
          </h1>
          <p className="mt-6 text-slate-400 font-inter text-xl max-w-2xl leading-relaxed">
            Deep dives, technical drills, and no-nonsense advice for serious {category} players. 
            No fluff. Just physics and grit.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group cursor-pointer">
              <Link href={`/posts/${post.slug}`}>
                <div className="aspect-video bg-emerald-950/20 border border-emerald-900/50 rounded-lg mb-6 overflow-hidden relative">
                  {/* Placeholder for Featured Image */}
                  <div className="absolute inset-0 group-hover:bg-sky-500/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] px-2 py-1 rounded border border-emerald-900/50 font-inter">
                      {post.date}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-space-grotesk font-bold text-slate-50 group-hover:text-sky-500 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-slate-400 font-inter mt-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center text-sky-500 font-bold text-sm tracking-tight">
                  READ FULL BREAKDOWN 
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}