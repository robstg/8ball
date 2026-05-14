import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// THE RE-RACK: This ensures the sitemap updates every hour without a redeploy.
export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  // Fetching all relevant data from the Lab (Sanity)
  const data = await client.fetch(`{
    "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
    "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
    "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
    "categories": *[_type == "category"] { "slug": slug.current }
  }`)

  // 1. Static Hubs (The Lead Balls)
  const staticRoutes = ['', '/articles', '/rules', '/guides', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  // 2. Intermediate Sport Hubs (e.g., /rules/snooker)
  const uniqueSports = Array.from(new Set(data.rules.map((r: any) => r.sport)))
  const sportHubRoutes = uniqueSports.map((sport: any) => ({
    url: `${baseUrl}/rules/${sport}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 3. Category Archives (e.g., /category/9-ball)
  const categoryRoutes = data.categories.map((cat: any) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 4. Deep Nested Rules (The Technical Specs)
  const ruleRoutes = data.rules.map((rule: any) => ({
    url: `${baseUrl}/rules/${rule.sport}/${rule.slug}`,
    lastModified: new Date(rule._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 5. Articles & Guides (The Break)
  const postRoutes = data.posts.map((p: any) => ({
    url: `${baseUrl}/articles/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const guideRoutes = data.guides.map((g: any) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(g._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes, 
    ...sportHubRoutes, 
    ...categoryRoutes, 
    ...ruleRoutes, 
    ...postRoutes, 
    ...guideRoutes
  ]
}