'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoriesShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.filter(cat => cat.visible));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || categories.length === 0) {
    return null;
  }

  // Fallback gradient colors for categories without images
  const gradients = [
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-orange-400 to-red-500',
    'from-yellow-400 to-amber-500',
    'from-amber-500 to-orange-600',
    'from-pink-400 to-rose-500'
  ];

  // Determine layout: slider if 5+ categories, centered grid if fewer
  const useSlider = categories.length >= 5;

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection organized by type and style.
          </p>
        </div>

        {useSlider ? (
          /* Slider Layout for 5+ categories */
          <div className="relative">

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category, index) => (
                <div key={category.id} className="flex-shrink-0 w-72 snap-center">
                  <CategoryCard category={category} index={index} gradients={gradients} />
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
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} gradients={gradients} />
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

// Separate CategoryCard component for reusability
function CategoryCard({ category, index, gradients }) {
  return (
    
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative block"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
        {/* Category Image or Gradient */}
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]}`}>
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>
        )}
        
        {/* Dark overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm text-white/90 mb-3 line-clamp-2">
              {category.description}
            </p>
          )}
          
          <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
            Explore
            <ArrowRight size={16} />
          </span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      
    </Link>

    
  );
}