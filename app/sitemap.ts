import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  const data = await client.fetch(`{
    "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
    "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
    "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt }
  }`)

  // 1. Static Hubs
  const staticRoutes = ['', '/articles', '/rules', '/guides', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  // 2. Intermediate Sport Hubs (e.g., /rules/8-ball)
  // This extracts unique sports from your rules and creates routes for them
  const uniqueSports = Array.from(new Set(data.rules.map((r: any) => r.sport)))
  const sportHubRoutes = uniqueSports.map((sport: any) => ({
    url: `${baseUrl}/rules/${sport}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 3. Deep Nested Rules (e.g., /rules/8-ball/wpa-standard)
  const ruleRoutes = data.rules.map((rule: any) => ({
    url: `${baseUrl}/rules/${rule.sport}/${rule.slug}`,
    lastModified: new Date(rule._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 4. Articles & Guides
  const postRoutes = data.posts.map((p: any) => ({
    url: `${baseUrl}/articles/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    priority: 0.8,
  }))

  const guideRoutes = data.guides.map((g: any) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(g._updatedAt),
    priority: 0.7,
  }))

  return [...staticRoutes, ...sportHubRoutes, ...ruleRoutes, ...postRoutes, ...guideRoutes]
}