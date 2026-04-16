import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottheblack.com' // Replace with your actual domain

  // 1. Fetch all dynamic data from Sanity
  const data = await client.fetch(`{
    "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
    "rules": *[_type == "rule"] { "slug": slug.current, "sport": sport, _updatedAt },
    "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt }
  }`)

  // 2. Define your Static Routes
  const staticRoutes = [
    '',
    '/articles',
    '/rules',
    '/guides',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))

  // 3. Map Dynamic Articles
  const postRoutes = data.posts.map((post: any) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 4. Map Dynamic Rules (Handling the [sport]/[slug] nesting)
  const ruleRoutes = data.rules.map((rule: any) => ({
    url: `${baseUrl}/rules/${rule.sport}/${rule.slug}`,
    lastModified: new Date(rule._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 5. Map Dynamic Gear Guides
  const guideRoutes = data.guides.map((guide: any) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...ruleRoutes, ...guideRoutes]
}