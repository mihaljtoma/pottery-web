import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Pottery Studio',
  image: 'https://tvoj-site.com/studio-image.jpg',
  description: 'Handcrafted pottery studio specializing in unique ceramic pieces',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  telephone: '+1-555-123-4567',
  email: 'contact@potterystudio.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Pottery Lane',
    addressLocality: 'Craft City',
    addressRegion: 'CA',
    postalCode: '12345',
    addressCountry: 'US',
  },
  areaServed: ['HR', 'US', 'EU'],
  priceRange: '$$',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });
  
  return {
    title: t('title'),
    description: t('description'),
    other: {
      'application/ld+json': JSON.stringify(localBusinessSchema),
    },
  };
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}