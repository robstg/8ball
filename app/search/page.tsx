import { client } from "@/sanity/lib/client";
import { BentoGrid } from "@/components/bento-grid";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  // We search for posts where the title matches the search term (case-insensitive)
  const posts = await client.fetch(
    `*[_type == "post" && title match $searchTerm + "*"] | order(_createdAt desc) {
      title,
      slug,
      mainImage,
      _createdAt
    }`,
    { searchTerm: q || "" }
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Search Results for: <span className="text-green-600">"{q}"</span>
          </h1>
          <p className="text-slate-400 mt-2 uppercase text-[10px] font-bold tracking-widest">
            Found {posts.length} matches
          </p>
        </header>

        {posts.length > 0 ? (
          <BentoGrid posts={posts} />
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No Masterclasses found for that search.
            </p>
            <Link href="/articles" className="mt-4 inline-block text-green-600 font-black text-[10px] uppercase underline">
              Browse all Archive
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}