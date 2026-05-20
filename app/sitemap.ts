import { MetadataRoute } from 'next'

// NO async, NO Sanity. Pure, lightning-fast static XML.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pottheblack.com'
  const now = new Date()

  // 1. Discipline Hubs (The Big Three)
  const disciplines = ['pool', 'snooker', '9-ball'].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 2. High-Value Articles (Add your top performers here manually)
  const topArticles = [
    'cue-action-physics-breakdown',
    '8-ball-tactical-masterclass',
    'snooker-safety-play-mechanics'
  ].map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 3. Technical Rules & Guides
  const technicalHubs = [
    { url: `${baseUrl}/rules`, priority: 0.7 },
    { url: `${baseUrl}/guides`, priority: 0.7 },
    { url: `${baseUrl}/articles`, priority: 0.7 },
    { url: `${baseUrl}/about-us`, priority: 0.5 },
  ].map(route => ({
    ...route,
    url: route.url,
    lastModified: now,
    changeFrequency: 'monthly' as const,
  }))

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    ...disciplines,
    ...topArticles,
    ...technicalHubs,
  ]
}