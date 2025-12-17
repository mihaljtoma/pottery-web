import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.productDetail' });
  
  // Fetch product name
  let productName = '';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`);
    if (res.ok) {
      const product = await res.json();
      productName = product.name;
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }
  
  return {
    title: productName ? `${productName} - ${t('suffix')}` : t('title'),
    description: t('description'),
  };
}

export default function ProductDetailLayout({ children }: { children: ReactNode }) {
  return children;
}