import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

// Rob's Note: We fetch all slugs and the last updated time 
// to keep Google in the loop.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com/' // Swap this for your actual domain

  // 1. Fetch all blog post slugs from Sanity
  const posts = await client.fetch(`
    *[_type == "post"] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `)

  // 2. Map the posts into the sitemap format
  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Define your static routes (Home, About, etc.)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticRoutes, ...postUrls]
}