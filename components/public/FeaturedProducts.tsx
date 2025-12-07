'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
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
}

interface GridSpan {
  col: 1 | 2 | 3;
  row: 1 | 2 | 3;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products?featured=true');
      const data = await res.json();
      setProducts(data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGridSpan = (index: number): GridSpan => {
    const patterns: GridSpan[] = [
      { col: 2, row: 2 },
      { col: 1, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: 1 },
    ];
    return patterns[index % patterns.length];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <p className="text-gray-600 font-medium">Loading featured pieces...</p>
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
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-semibold text-amber-600 tracking-wide uppercase">
              Curated Selection
            </span>
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our most beloved pieces, handcrafted with meticulous care and attention to detail. Each item tells its own story.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {products.map((product, index) => {
            const span = getGridSpan(index);
            const hasSecondImage = product.images && product.images.length > 1;
            
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={`masonry-item col-span-${span.col} row-span-${span.row} group`}
              >
                <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1">
                  {/* Product Image Container */}
                  <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                    {/* Primary Image */}
                    <div className="product-image-wrapper absolute inset-0">
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
                          src={product.images[1]}
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
                        {product.availability === 'available' ? '✓ Available' : 
                         product.availability === 'unavailable' ? '✗ Unavailable' : '◆ Reserved'}
                      </span>
                    </div>

                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Product Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white pointer-events-none">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-100 line-clamp-2 mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {product.description}
                    </p>
                    
                    {product.dimensions && (product.dimensions.height || product.dimensions.width) && (
                      <span className="text-xs md:text-sm text-gray-200 mb-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                        {product.dimensions.height && `H: ${product.dimensions.height}${product.dimensions.unit}`}
                        {product.dimensions.height && product.dimensions.width && ' × '}
                        {product.dimensions.width && `W: ${product.dimensions.width}${product.dimensions.unit}`}
                      </span>
                    )}

                    <div className="flex items-center gap-2 text-amber-300 font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                      View Details
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl group"
          >
            <span>Explore All Collections</span>
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
