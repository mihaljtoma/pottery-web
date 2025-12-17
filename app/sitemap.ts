import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const locales = ['hr', 'en'];
  
  // Statičke stranice
  const pages = [
    '',                    // Home
    '/products',
    '/about',
    '/contact',
    '/gallery',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Dodaj statičke stranice
  pages.forEach(page => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            hr: `${baseUrl}/hr${page}`,
            en: `${baseUrl}/en${page}`,
            'x-default': `${baseUrl}/hr${page}`,
          },
        },
      });
    });
  });

  // Dodaj dynamic product stranice
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    if (res.ok) {
      const products = await res.json();
      
      products.forEach((product: any) => {
        locales.forEach(locale => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/products/${product.id}`,
            lastModified: product.updatedAt 
              ? new Date(product.updatedAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly',
            priority: 0.7,
            alternates: {
              languages: {
                hr: `${baseUrl}/hr/products/${product.id}`,
                en: `${baseUrl}/en/products/${product.id}`,
                'x-default': `${baseUrl}/hr/products/${product.id}`,
              },
            },
          });
        });
      });
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return sitemapEntries;
}