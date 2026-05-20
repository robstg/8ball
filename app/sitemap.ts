import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  // 1. THE BASELINE (Always return these no matter what)
  const staticRoutes: MetadataRoute.Sitemap = [
    '', 
    '/articles', 
    '/rules', 
    '/guides', 
    '/about-us'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  }))

  try {
    // 2. THE DYNAMIC FETCH
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    const categoryRoutes: MetadataRoute.Sitemap = (data.categories || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`, // CLEAN URL FIX: pottheblack.com/pool
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const guideRoutes: MetadataRoute.Sitemap = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: g._updatedAt ? new Date(g._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...categoryRoutes, ...postRoutes, ...guideRoutes]

  } catch (error) {
    console.error("Sitemap Fetch Error:", error)
    return staticRoutes // Fallback to static routes if Sanity is down
  }
}