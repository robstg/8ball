import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// THE RE-RACK: Use 'force-dynamic' to prevent build-time 404s
export const dynamic = 'force-dynamic'
export const revalidate = 0; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // Fetching data from the Lab
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    // 1. Static Hubs (The Lead Balls)
    const staticRoutes = ['', '/articles', '/rules', '/guides', '/about-us'].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    }))

    // 2. Category Archives (The Sport Pillars)
    const categoryRoutes = (data.categories || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // 3. Articles (Masterclasses)
    const postRoutes = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date(p._updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 4. Technical Gear Guides
    const guideRoutes = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(g._updatedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // 5. Rule Archives by Sport
    const uniqueSports = Array.from(new Set((data.rules || []).map((r: any) => r.sport)))
    const sportHubRoutes = uniqueSports.map((sport: any) => ({
      url: `${baseUrl}/rules/${sport}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 6. Deep Nested Rules
    const ruleRoutes = (data.rules || []).map((rule: any) => ({
      url: `${baseUrl}/rules/${rule.sport}/${rule.slug}`,
      lastModified: new Date(rule._updatedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [
      ...staticRoutes, 
      ...categoryRoutes,
      ...sportHubRoutes, 
      ...postRoutes, 
      ...guideRoutes,
      ...ruleRoutes
    ]
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // FALLBACK: If Sanity fails, at least provide the static routes so it's not a 404
    return [
      { url: `${baseUrl}/`, lastModified: new Date() },
      { url: `${baseUrl}/about-us`, lastModified: new Date() },
      { url: `${baseUrl}/rules`, lastModified: new Date() },
      { url: `${baseUrl}/guides`, lastModified: new Date() },
    ]
  }
}