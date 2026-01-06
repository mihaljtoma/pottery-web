import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://pottery-web.vercel.app';
  const locales = ['hr', 'en'];
  
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' },
    { path: '/products', priority: 0.9, changeFreq: 'daily' },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' },
    { path: '/gallery', priority: 0.8, changeFreq: 'weekly' },
  ];

  let urls: string[] = [];

  // Add static pages
  pages.forEach(page => {
    locales.forEach(locale => {
      urls.push(`  <url>
    <loc>${baseUrl}/${locale}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    });
  });

  // Fetch products
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const products = await res.json();
      
      if (Array.isArray(products) && products.length > 0) {
        products.forEach((product: any) => {
          locales.forEach(locale => {
            urls.push(`  <url>
    <loc>${baseUrl}/${locale}/products/${product.id}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
          });
        });
      }
    }
  } catch (error) {
    console.error('Sitemap error:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}