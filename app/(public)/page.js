import Hero from '@/components/public/Hero';
import FeaturedProducts from '@/components/public/FeaturedProducts';
import CategoriesShowcase from '@/components/public/CategoriesShowcase';
import ContactForm from '@/components/public/ContactForm';
import SocialGallery from '@/components/public/SocialGallery';
export const metadata = {
  title: 'Pottery Studio - Handcrafted Pottery',
  description: 'Discover unique handcrafted pottery pieces made with love and dedication.',
};

export default function HomePage() {
  return (
     <div>
      <Hero />
      <FeaturedProducts />
      <CategoriesShowcase />
      <SocialGallery />
      <ContactForm />
    </div>
  );
}