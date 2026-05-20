import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // Shot 4: We go back to ONLY fetching Posts. 
    // We will add the core Rules and Guides manually for now to keep it lightning fast.
    const posts = await client.fetch(`*[_type == "post"] { "slug": slug.current }`);

    const postRoutes = (posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Manual "Power" Links (These are your most important non-article pages)
    const manualRoutes: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/rules/8-ball/world-rules`, priority: 0.6 },
      { url: `${baseUrl}/rules/snooker/official-rules`, priority: 0.6 },
      { url: `${baseUrl}/guides/cue-action-physics`, priority: 0.8 },
    ];

    const disciplineRoutes = ['pool', 'snooker', '9-ball'].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'always' as const, priority: 1.0 },
      { url: `${baseUrl}/about-us`, lastModified: new Date(), priority: 0.5 },
      { url: `${baseUrl}/articles`, lastModified: new Date(), priority: 0.8 },
      { url: `${baseUrl}/rules`, lastModified: new Date(), priority: 0.8 },
      ...disciplineRoutes,
      ...postRoutes,
      ...manualRoutes,
    ];
    
  } catch (error) {
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}