import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.productDetail' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Fetch product
  let product: any = null;
  let productName = '';
  try {
const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      product = await res.json();
      productName = product.name;
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  // Product Schema
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}/${locale}/products/${id}`,
    availability: `https://schema.org/${product.availability === 'available' ? 'InStock' : 'OutOfStock'}`,
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${product.availability === 'available' ? 'InStock' : 'OutOfStock'}`,
      url: `${baseUrl}/${locale}/products/${id}`,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: 1,
    } : undefined,
  } : null;

  return {
    title: productName ? `${productName} - ${t('suffix')}` : t('title'),
    description: t('description'),
    other: {
      'application/ld+json': JSON.stringify(productSchema),
    },
  };
}

export default function ProductDetailLayout({ children }: { children: ReactNode }) {
  return children;
}