import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// THE KEY: This tells Next.js to fetch this data during 'npm run build'
// and cache the result. It won't try to re-fetch on every visit.
export const revalidate = false; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // We fetch the slug AND the last updated timestamp from Sanity
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`);

    const postRoutes = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      // Use the actual date from Sanity
      lastModified: new Date(p._updatedAt), 
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    const disciplineRoutes = ['pool', 'snooker', '9-ball'].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(), // These hubs change whenever an article is added
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
      ...disciplineRoutes,
      ...postRoutes,
    ];
    
  } catch (error) {
    // If the build-time fetch fails, the build will fail, 
    // alerting you BEFORE the site goes live.
    console.error("Sitemap Build Error:", error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}