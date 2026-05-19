import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com'

  try {
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    const staticRoutes: MetadataRoute.Sitemap = [
      '', '/articles', '/rules', '/guides', '/about-us'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = (data.categories || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date().toISOString(),
      priority: 0.9,
    }))

    const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p: any) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt).toISOString() : new Date().toISOString(),
      priority: 0.8,
    }))

    return [...staticRoutes, ...categoryRoutes, ...postRoutes]
    
  } catch (e) {
    // Safety Shot: Always return the core paths if the dynamic fetch fails
    return [
      { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/about-us`, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/guides`, lastModified: new Date().toISOString() }
    ]
  }
}