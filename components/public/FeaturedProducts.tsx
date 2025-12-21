'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import './FeaturedProducts.css';

interface ProductDimensions {
  height?: number;
  width?: number;
  unit?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  availability: 'available' | 'unavailable' | 'reserved';
  images?: string[];
  dimensions?: ProductDimensions;
  price?: number;
}

interface GridSpan {
  col: 1 | 2 | 3;
  row: 1 | 2 | 3;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('featured');
  const locale = useLocale();
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, [locale]); // Dodaj locale u dependency array

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(`/api/products?featured=true&locale=${locale}`); // Dodaj &locale=${locale}
      const data = await res.json();
      setProducts(data.slice(0, 9)); // Show 9 products for better mosaic
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };


  const getGridSpan = (index: number, totalProducts: number): GridSpan => {
    // Desktop pattern: 2x2, 1x1, 1x2, 2x1, 1x1, 1x1, 1x2, 1x1
    const patterns: GridSpan[] = [
      { col: 2, row: 2 },
      { col: 1, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: 2 },
      { col: 1, row: 1 },
    ];
    
    // Last item gets special treatment
    if (index === totalProducts - 1) {
      return { col: 2, row: 1 }; // Desktop: 2x1, tablet will override to 1x1 via CSS
    }
    
    return patterns[index % patterns.length];
  };

  const getSpanClasses = (span: GridSpan, isLastItem: boolean): string => {
    // Use inline styles to handle dynamic grid spans instead of Tailwind classes
    return isLastItem ? 'masonry-item-last' : `col-span-${span.col} row-span-${span.row}`;
  };

  if (loading) {
    return (
      <section className="py-16 py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <p className="text-gray-600 font-medium">{t('loading')}</p>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-full px-0 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-semibold text-amber-600 tracking-wide uppercase">
              {t('badge')}
            </span>
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Masonry Grid - No gaps, no rounded corners */}
        <div className="masonry-grid-seamless">
          {products.map((product, index) => {
            const isLastItem = index === products.length - 1;
            const span = getGridSpan(index, products.length);
            const hasSecondImage = product.images && product.images.length > 1;
            
            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.id}`}
                className={`masonry-item-seamless ${isLastItem ? 'masonry-item-last' : `masonry-item-col-${span.col} masonry-item-row-${span.row}`} group relative overflow-hidden`}
              >
                <div className="relative w-full h-full bg-gray-100">
                  {/* Primary Image */}
                  <div className="product-image-wrapper-seamless absolute inset-0">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Package size={56} className="text-gray-300" />
                      </div>
                    )}
                    
                    {/* Shine Effect Overlay */}
                    <div className="absolute inset-0 shine-effect pointer-events-none"></div>
                  </div>

                  {/* Secondary Image - Shows on Hover */}
                  {hasSecondImage && (
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={product.images![1]}
                        alt={`${product.name} - alternate view`}
                        fill
                        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 shine-effect pointer-events-none"></div>
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all duration-300 ${
                      product.availability === 'available'
                        ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/50'
                        : product.availability === 'unavailable'
                        ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/50'
                        : 'bg-amber-500/90 text-white shadow-lg shadow-amber-500/50'
                    }`}>
                      {product.availability === 'available' ? t('availability.available') : 
                       product.availability === 'unavailable' ? t('availability.unavailable') : 
                       t('availability.reserved')}
                    </span>
                  </div>

                  {/* Dark Overlay for Text Readability - Always visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Product Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-100 transition">
                    {product.name}
                  </h3>
                  
                  {product.price && (
                    <p className="text-2xl font-bold text-white mb-3">
                      €{Number(product.price).toFixed(2)}
                    </p>
                  )}
                  
                  {/* Show description and dimensions only on desktop hover and on larger cards */}
                  <div className="hidden sm:block">
                    {product.dimensions && (product.dimensions.height || product.dimensions.width) && (
                      <div className="mb-4 pb-3 border-b border-white/20">
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">{t('dimensions')}</p>
                        <div className="flex flex-wrap gap-3">
                          {product.dimensions.height && (
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                              <span className="text-sm text-white/90">H: {product.dimensions.height}{product.dimensions.unit}</span>
                            </div>
                          )}
                          {product.dimensions.width && (
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                              <span className="text-sm text-white/90">W: {product.dimensions.width}{product.dimensions.unit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Details link */}
                  <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                    {t('viewDetails')}
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-600 px-10 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl group"
          >        
            <span>{t('exploreAll')}</span>
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}