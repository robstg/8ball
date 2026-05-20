import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// We re-introduce async, but we strip the query to the absolute bare bones
// to keep the "think time" under the threshold of the greedy route.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // Shot 2: Fetching only Article Slugs. No images, no dates, no categories.
    // This keeps the response extremely fast.
    const posts = await client.fetch(`*[_type == "post"] { "slug": slug.current }`);

    const postRoutes = (posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // The Hardcoded Discipline Hubs (from the version that worked)
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
        changeFrequency: 'always' as const,
        priority: 1.0,
      },
      ...disciplineRoutes,
      ...postRoutes,
    ];
    
  } catch (error) {
    // If the fetch takes too long or fails, return the "Safe" version immediately
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/pool`, lastModified: new Date() },
      { url: `${baseUrl}/snooker`, lastModified: new Date() },
    ];
  }
}