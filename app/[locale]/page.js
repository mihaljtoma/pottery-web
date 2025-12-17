import dynamic from 'next/dynamic';
import Hero from '@/components/public/Hero';
import { getHomepageSections } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'hr' ? 'hr_HR' : 'en_US',
    }
  };
}

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="h-96 bg-gradient-to-br from-amber-50 to-gray-50 animate-pulse rounded-lg" />
);

// Lazy load komponente (ispod fold-a)
const FeaturedProducts = dynamic(
  () => import('@/components/public/FeaturedProducts'),
  { loading: LoadingSkeleton, ssr: true }
);

const CategoriesShowcase = dynamic(
  () => import('@/components/public/CategoriesShowcase'),
  { loading: LoadingSkeleton, ssr: true }
);

const SocialGallery = dynamic(
  () => import('@/components/public/SocialGallery'),
  { loading: LoadingSkeleton, ssr: true }
);

const Testimonials = dynamic(
  () => import('@/components/public/Testimonials'),
  { loading: LoadingSkeleton, ssr: true }
);

const ContactForm = dynamic(
  () => import('@/components/public/ContactForm'),
  { loading: LoadingSkeleton, ssr: true }
);

// Map section IDs to components
const sectionComponents = {
  'hero': Hero,
  'featured-products': FeaturedProducts,
  'categories': CategoriesShowcase,
  'social-gallery': SocialGallery,
  'testimonials': Testimonials,
  'contact': ContactForm
};

export default async function HomePage() {
  let sections = [];
  
  try {
    sections = await getHomepageSections();
  } catch (error) {
    console.error('Failed to load homepage sections:', error);
    sections = [
      { id: 'hero', enabled: true, order: 0 },
      { id: 'featured-products', enabled: true, order: 1 },
      { id: 'categories', enabled: true, order: 2 },
      { id: 'social-gallery', enabled: true, order: 3 },
      { id: 'testimonials', enabled: true, order: 4 },
      { id: 'contact', enabled: true, order: 5 }
    ];
  }

  const enabledSections = sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      {enabledSections.map(section => {
        const Component = sectionComponents[section.id];
        
        if (!Component) {
          console.warn(`Section component not found: ${section.id}`);
          return null;
        }

        return <Component key={section.id} />;
      })}
    </div>
  );
}