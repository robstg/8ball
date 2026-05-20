import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  // Fetching data - keeping it simple to avoid query crashes
  const data = await client.fetch(`{
    "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
    "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
    "categories": *[_type == "category"] { "slug": slug.current }
  }`)

  // 1. Static Hubs
  // We use "as const" to ensure TypeScript doesn't think these are just "strings"
  const staticRoutes: MetadataRoute.Sitemap = ['', '/articles', '/rules', '/guides', '/about-us'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  // 2. Category Pillars (e.g., /pool, /snooker)
  // This is where we fixed the "category/" prefix.
  const categoryRoutes: MetadataRoute.Sitemap = (data.categories || []).map((cat: any) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 3. Articles & Guides
  const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p: any) => ({
    url: `${baseUrl}/articles/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const guideRoutes: MetadataRoute.Sitemap = (data.guides || []).map((g: any) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: g._updatedAt ? new Date(g._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Combine and return - order doesn't matter for XML but types do
  return [...staticRoutes, ...categoryRoutes, ...postRoutes, ...guideRoutes]
}