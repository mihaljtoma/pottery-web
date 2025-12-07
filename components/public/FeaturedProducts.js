'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products?featured=true');
      const data = await res.json();
      setProducts(data.slice(0, 6)); // Show max 6 featured products
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no featured products
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most beloved pieces, handcrafted with care and attention to detail.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.availability === 'available'
                        ? 'bg-green-200 text-white'
                        : product.availability === 'sold'
                        ? 'bg-red-200 text-white'
                        : 'bg-yellow-200 text-white'
                    }`}>
                      {product.availability === 'available' ? 'Available' : 
                       product.availability === 'sold' ? 'Sold' : 'Reserved'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {product.dimensions && (product.dimensions.height || product.dimensions.width) && (
                      <span className="text-sm text-gray-500">
                        {product.dimensions.height && `H: ${product.dimensions.height}${product.dimensions.unit}`}
                        {product.dimensions.height && product.dimensions.width && ' × '}
                        {product.dimensions.width && `W: ${product.dimensions.width}${product.dimensions.unit}`}
                      </span>
                    )}
                    <span className="text-amber-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}