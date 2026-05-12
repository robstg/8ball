import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { cn, getCategoryStyles } from '@/lib/utils';
import { Microscope, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

// THE REFRESH FIX: Ensures the lab data is always fresh
export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// THE SEO FIX: Dynamic Metadata for a global audience
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  // Clean up the string for the tab title
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  return {
    title: title, // This replaces the %s in your root layout template
    description: `Advanced technical tips, structural drills, and physics-based breakdowns for ${title} players worldwide.`,
  };
}

async function getArticlesByCategory(categorySlug: string) {
  const query = `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) [0...12] {
    title,
    "slug": slug.current,
    mainImage,
    "snippet": array::join(string::split(pt::text(body), "")[0...140], "") + "...",
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

  // 9-ball is now a verified discipline in the archive
  const validCategories = ['pool', 'snooker', '9-ball'];
  const currentCategory = category.toLowerCase().trim();

  if (!validCategories.includes(currentCategory)) {
    notFound();
  }

  const articles = await getArticlesByCategory(currentCategory);
  const themeStyles = getCategoryStyles(currentCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body antialiased">
      
      <header className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 mb-6">
            <Microscope size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Discipline Archive</span>
          </div>
          
          <h1 className="font-heading text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            {category.replace('-', ' ')}<span className="text-emerald-600">.</span>
          </h1>
          
          <p className="mt-8 text-slate-500 text-xl max-w-2xl leading-relaxed font-medium italic">
            Advanced mechanical analysis and physics-based breakdowns specifically for the <span className="text-slate-900 font-bold capitalize">{category.replace('-', ' ')}</span> discipline.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        {articles.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="group flex flex-col transition-all duration-500"
              >
                <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500 bg-slate-200">
                  {article.mainImage ? (
                    <Image 
                        src={urlFor(article.mainImage).url()}
                        alt={article.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Image Pending</div>
                  )}
                </div>

                <div className="mb-4">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5",
                        themeStyles
                    )}>
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                        {category}
                    </span>
                </div>
                
                <h2 className="font-heading text-3xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors leading-[1.1] mb-4">
                  {article.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium mb-8">
                  {article.snippet}
                </p>
                
                <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {article.date ? new Date(article.date).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' }) : 'Report Pending'}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-all shadow-lg">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white border border-slate-100 rounded-[3rem]">
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