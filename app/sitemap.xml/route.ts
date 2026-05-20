import { client } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

// THE RE-RACK: Force this to be a dynamic API route
export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://pottheblack.com'

  try {
    const data = await client.fetch(`{
      "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
      "guides": *[_type == "guide"] { "slug": slug.current, _updatedAt },
      "categories": *[_type == "category"] { "slug": slug.current }
    }`)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefrequency>daily</changefrequency>
        <priority>1.0</priority>
      </url>
      <url><loc>${baseUrl}/about-us</loc><priority>0.8</priority></url>
      <url><loc>${baseUrl}/guides</loc><priority>0.8</priority></url>
      <url><loc>${baseUrl}/articles</loc><priority>0.8</priority></url>
      
      ${(data.categories || []).map((cat: any) => `
        <url><loc>${baseUrl}/${cat.slug}</loc><priority>0.9</priority></url>
      `).join('')}

      ${(data.posts || []).map((p: any) => `
        <url><loc>${baseUrl}/articles/${p.slug}</loc><priority>0.7</priority></url>
      `).join('')}
    </urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    })
  } catch (e) {
    console.error('Sitemap Error:', e)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}