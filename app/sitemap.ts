import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// Was `false` (build-time only) — meant new posts/guides/rules/tools never
// appeared in the sitemap until the next deploy. Revalidating hourly keeps
// it fresh without hitting Sanity on every single crawl request.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // FETCH: Pull posts, guides, rules, tools, AND the specific about-us page data in one strike
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
      "tools": *[_type == "tool"] { "slug": slug.current, _updatedAt },
      "aboutPage": *[_type == "page" && slug.current == "about-us"][0] { _updatedAt }
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

    // 4. Interactive Tools — priority set on par with articles since these
    // are meant to be standalone, linkable, indexable pages in their own right.
    const toolRoutes = (data.tools || []).map((t: any) => ({
      url: `${baseUrl}/tools/${t.slug}`,
      lastModified: new Date(t._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // 5. Discipline Hubs
    const disciplineRoutes = ['pool', 'snooker', '9-ball'].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // Determine the true Sanity modified date for about-us, fallback safely only if document doesn't exist
    const aboutLastModified = data.aboutPage?._updatedAt 
      ? new Date(data.aboutPage._updatedAt) 
      : new Date('2026-06-12'); // Safe modern baseline fallback

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      { 
        url: `${baseUrl}/about-us`, 
        lastModified: aboutLastModified, // Pulls the exact Sanity table timestamp
        changeFrequency: 'monthly' as const,
        priority: 0.5 
      },
      {
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      ...disciplineRoutes,
      ...postRoutes,
      ...guideRoutes,
      ...ruleRoutes,
      ...toolRoutes,
    ];
    
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    // Return a safe baseline if Sanity is unreachable during build
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}