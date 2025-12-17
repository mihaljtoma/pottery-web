import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does shipping take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We typically ship within 5-7 business days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer custom pieces?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Contact us for custom pottery commissions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What materials do you use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use high-quality, sustainably sourced clay and non-toxic glazes.',
      },
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });
  
  return {
    title: t('title'),
    description: t('description'),
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
