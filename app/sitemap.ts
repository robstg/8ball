import { MetadataRoute } from 'next'

// THE DEBUG CONFIG: Force it to be a fresh server-side request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function sitemap(): MetadataRoute.Sitemap {
  // We're hardcoding these to test the route's integrity
  const baseUrl = 'https://pottheblack.com'

  console.log("DEBUG: Sitemap function is firing at " + new Date().toISOString());

  try {
    return [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/guides`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
    ]
  } catch (error) {
    console.error("DEBUG ERROR: Sitemap failed", error);
    // If it fails even with hardcoded data, something is fundamentally wrong with the project config
    return [{ url: baseUrl }]
  }
}