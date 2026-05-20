import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://pottheblack.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}