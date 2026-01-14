'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function CategoriesShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const t = useTranslations('categories');
  const locale = useLocale();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [locale]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setTimeout(() => checkScroll(), 100);
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?locale=${locale}`);
      const data = await res.json();
      setCategories(data.filter(cat => cat.visible));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 100);
    }
  };

  if (loading || categories.length === 0) {
    return null;
  }

  // Determine layout: slider if 5+ categories, centered grid if fewer
  const useSlider = categories.length >= 5;

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {useSlider ? (
          /* Slider Layout for 5+ categories */
          <div className="relative">
            {/* Navigation Buttons - Hidden on mobile/tablet, visible on desktop */}
            <div className="hidden lg:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-between pointer-events-none px-2 z-50">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="pointer-events-auto z-50 p-2 bg-white/90 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition shadow-lg"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} className="text-gray-700 " />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="pointer-events-auto z-50 p-2 bg-white/90 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition shadow-lg"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <div key={category.id} className="flex-shrink-0 w-72 snap-center">
                  <CategoryCard category={category} locale={locale} t={t} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Centered Grid Layout for 1-4 categories */
          <div className="flex justify-center">
            <div className={`grid gap-6 ${
              categories.length === 1 ? 'grid-cols-1 max-w-md' :
              categories.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl' :
              categories.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-4xl' :
              'grid-cols-2 md:grid-cols-4 max-w-5xl'
            }`}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} locale={locale} t={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
// Separate CategoryCard component
function CategoryCard({ category, locale, t }) {
  return (
    <Link
      href={`/${locale}/products?category=${category.slug}`}
      className="group relative block"
    >
      {/* Overflow container - allows PNG to extend beyond card */}
      <div className="relative overflow-visible pt-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1">
          {/* Background Image with top 23% cropped */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: 'inset(23% 0 0 0)' }}
          >
            <img
              src="/back_cut.jpg"
              alt="Category background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Amber gradient overlay to fade into section background */}
            <div className="absolute -top-10 inset-x-0 bottom-0 bg-gradient-to-b from-amber-50 via-amber-50 via-40% to-transparent" />
          </div>
          
          {/* Content at bottom */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-40">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-50 transition">
              {category.name}
            </h3>
            
            {category.description && (
              <p className="text-sm text-white/90 mb-3 line-clamp-2">
                {category.description}
              </p>
            )}
            
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
              {t('explore')}
              <ArrowRight size={16} />
            </span>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>
        {/* PNG Image - positioned to overflow from top, centered */}
        {category.image && (
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full aspect-square pointer-events-none">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </Link>
  );
}