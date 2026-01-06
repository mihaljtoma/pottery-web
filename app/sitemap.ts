import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pottery-web.vercel.app';
  const locales = ['hr', 'en'];
  
  // Static pages with proper priorities
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/gallery', priority: 0.8, changeFreq: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for both locales
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

  // Add dynamic product pages
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (res.ok) {
      const products = await res.json();
      
      if (Array.isArray(products) && products.length > 0) {
        products.forEach((product: any) => {
          locales.forEach(locale => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/products/${product.id}`,
              lastModified: product.updatedAt 
                ? new Date(product.updatedAt)
                : new Date(),
              changeFrequency: 'monthly',
              priority: 0.7,
            });
          });
        });
        
        console.log(`✅ Sitemap: Added ${products.length} products`);
      }
    } else {
      console.warn(`⚠️ Sitemap: API returned ${res.status}`);
    }
  } catch (error) {
    console.error('❌ Sitemap: Failed to fetch products:', error);
    // Continue with static pages only
  }

  console.log(`📄 Sitemap: Generated ${sitemapEntries.length} total URLs`);
  return sitemapEntries;
}