'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Package, ArrowRight } from 'lucide-react';

interface ProductDimensions {
  height?: number;
  width?: number;
  unit?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  availability: 'available' | 'unavailable' | 'reserved';
  images?: string[];
  dimensions?: ProductDimensions;
}

interface SimilarProductsProps {
  currentProductId: string;
  categoryId: string;
}

export default function SimilarProducts({ currentProductId, categoryId }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categoryId) {
      fetchSimilarProducts();
    }
  }, [categoryId, currentProductId]);

  const fetchSimilarProducts = async () => {
    try {
      const res = await fetch(`/api/products?categoryId=${categoryId}`);
      const data = await res.json();
      
      const similar = (Array.isArray(data) ? data : [])
        .filter((p: Product) => p.id !== currentProductId)
        .slice(0, 8);
      
      setProducts(similar);
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 240;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
    updateScrollButtons();
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  if (loading) {
    return (
      <section className="py-6 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Loading similar products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            Similar Products
          </h3>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div 
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product: Product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative block flex-shrink-0"
            >
              <div className="relative w-56 h-56 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                {/* Product Image */}
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Package size={40} className="text-gray-400" />
                  </div>
                )}
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h4 className="text-base font-bold text-white mb-3 line-clamp-2 group-hover:text-amber-300 transition">
                    {product.name}
                  </h4>
                  
                  <span className="inline-flex items-center gap-1.5 text-white font-semibold text-xs group-hover:gap-2.5 transition-all">
                    View Details
                    <ArrowRight size={14} />
                  </span>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}