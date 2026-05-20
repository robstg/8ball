import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // EXPANDED QUERY: Pulling articles, guides, and rules in one quick strike
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current },
      "guides": *[_type == "guide"] { "slug": slug.current },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport }
    }`);

    // 1. Articles
    const postRoutes = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // 2. Technical Guides
    const guideRoutes = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // 3. Rules (mapped to their sport/slug structure)
    const ruleRoutes = (data.rules || []).map((r: any) => ({
      url: `${baseUrl}/rules/${r.sport}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }));

    // 4. Static Discipline Hubs
    const disciplineRoutes = ['pool', 'snooker', '9-ball'].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'always' as const, priority: 1.0 },
      { url: `${baseUrl}/about-us`, lastModified: new Date(), priority: 0.5 },
      ...disciplineRoutes,
      ...postRoutes,
      ...guideRoutes,
      ...ruleRoutes,
    ];
    
  } catch (error) {
    // Safe Fallback
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}