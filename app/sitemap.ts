import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  // THE FAIL-SAFE FETCH: Using a try-catch to prevent the 404 crash
  try {
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    // 1. STATIC HUB ROUTES
    const staticRoutes: MetadataRoute.Sitemap = [
      '', 
      '/articles', 
      '/rules', 
      '/guides', 
      '/about-us'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    }))

    // 2. CATEGORY PILLARS (/pool, /snooker)
    const categoryRoutes: MetadataRoute.Sitemap = (data.categories || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    // 3. MASTERCLASSES
    const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // 4. GEAR GUIDES
    const guideRoutes: MetadataRoute.Sitemap = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: g._updatedAt ? new Date(g._updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // 5. SPORT HUBS (/rules/pool)
    const uniqueSports = Array.from(new Set((data.rules || []).map((r: any) => r.sport)))
    const sportHubRoutes: MetadataRoute.Sitemap = uniqueSports.map((sport: any) => ({
      url: `${baseUrl}/rules/${sport}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // 6. DEEP RULES
    const ruleRoutes: MetadataRoute.Sitemap = (data.rules || []).map((rule: any) => ({
      url: `${baseUrl}/rules/${rule.sport}/${rule.slug}`,
      lastModified: rule._updatedAt ? new Date(rule._updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...sportHubRoutes,
      ...postRoutes,
      ...guideRoutes,
      ...ruleRoutes,
    ]
  } catch (e) {
    // If Sanity is down, return the bare minimum so Google doesn't see a 404
    return [
      { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/about-us`, lastModified: new Date().toISOString() }
    ]
  }
}