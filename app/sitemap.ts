import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// Ensures this is generated once at build time for maximum speed
export const revalidate = false; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // ONE STRIKE: Fetch posts, guides, and rules in a single query
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt }
    }`);

    // 1. Technical Articles
    const postRoutes = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // 2. Tactical Guides
    const guideRoutes = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(g._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // 3. Official Rules (Mapped to /[sport]/[slug])
    const ruleRoutes = (data.rules || []).map((r: any) => ({
      url: `${baseUrl}/rules/${r.sport}/${r.slug}`,
      lastModified: new Date(r._updatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }));

    // 4. Discipline Hubs
    const disciplineRoutes = ['pool', 'snooker', '9-ball'].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      { url: `${baseUrl}/about-us`, lastModified: new Date('2024-01-01'), priority: 0.5 },
      ...disciplineRoutes,
      ...postRoutes,
      ...guideRoutes,
      ...ruleRoutes,
    ];
    
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    // Return a safe baseline if Sanity is unreachable during build
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}