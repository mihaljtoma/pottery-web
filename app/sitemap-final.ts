import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottery-web.vercel.app';
  const locales = ['hr', 'en'];
  
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/gallery', priority: 0.8, changeFreq: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach(page => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });
  });

  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 },
    });
    
    if (res.ok) {
      const products = await res.json();
      
      if (Array.isArray(products) && products.length > 0) {
        products.forEach((product: any) => {
          locales.forEach(locale => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/products/${product.id}`,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
              changeFrequency: 'monthly',
              priority: 0.7,
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('Sitemap error:', error);
  }

  return sitemapEntries;
}