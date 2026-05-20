import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    // 1. Fetching only the bare essentials to prevent timeouts
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current },
      "guides": *[_type == "guide"] { "slug": slug.current },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    // 2. Static Routes (The Lead Balls)
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

    // 3. Dynamic Categories (e.g., /pool)
    const categoryRoutes: MetadataRoute.Sitemap = (data.categories || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    // 4. Masterclass Articles
    const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // 5. Technical Guides
    const guideRoutes: MetadataRoute.Sitemap = (data.guides || []).map((g: any) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...categoryRoutes, ...postRoutes, ...guideRoutes]

  } catch (error) {
    // If Sanity fails, we return a valid sitemap with just the static pages 
    // to prevent a 404.
    return [
      { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/about-us`, lastModified: new Date().toISOString() }
    ]
  }
}