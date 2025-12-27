import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const locales = ['hr', 'en'];
  
  // Static pages
  const pages = [
    '',                    // Home
    '/products',
    '/about',
    '/contact',
    '/gallery',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages
  pages.forEach(page => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: page === '' ? 1.0 : 0.8,
      });
    });
  });

  // Add dynamic product pages
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    if (res.ok) {
      const products = await res.json();
      
      if (Array.isArray(products) && products.length > 0) {
        products.forEach((product: any) => {
          locales.forEach(locale => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/products/${product.id}`,
              lastModified: product.updatedAt 
                ? new Date(product.updatedAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              changeFrequency: 'monthly' as const,
              priority: 0.7,
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch products:', error);
    // Continue with static pages only
  }

  return sitemapEntries;
}