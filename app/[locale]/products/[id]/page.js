'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import SimilarProducts from '@/components/public/SimilarProducts';
import { useTranslations, useLocale } from 'next-intl';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations('productDetail');
  const locale = useLocale();
  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        
        // Fetch category details
        if (data.categoryId) {
          fetchCategory(data.categoryId);
        }
      } else {
        // Product not found
        router.push('/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (categoryId) => {
    try {
      const res = await fetch('/api/categories');
      const categories = await res.json();
      const cat = Array.isArray(categories) 
        ? categories.find(c => c.id === categoryId)
        : null;
      setCategory(cat);
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 flex items-center justify-center">
        <Package size={48} className="text-gray-400 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to gray-50 to-amber-50">
      {/* Back Button */}
      <div className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition"
          >
            <ArrowLeft size={20} />
            {t('backButton')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.images && product.images.length > 0 ? (
                <>
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
                      >
                        <ChevronLeft size={24} className="text-gray-900" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
                      >
                        <ChevronRight size={24} className="text-gray-900" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      currentImageIndex === index 
                        ? 'ring-4 ring-amber-500' 
                        : 'ring-2 ring-gray-200 hover:ring-amber-300'
                    } transition`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Status */}
            <div className="flex items-center gap-3">
              {category && (
                <Link
                  href={`/${locale}/products?category=${category.slug}`}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  {category.name}
                </Link>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.availability === 'available'
                  ? 'bg-green-100 text-green-800'
                  : product.availability === 'unavailable'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {product.availability === 'available' ? t('availability.available') :
                product.availability === 'unavailable' ? t('availability.unavailable') : 
                t('availability.reserved')}
              </span>
              {product.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                  {t('featured')}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="prose prose-lg">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (product.dimensions.height || product.dimensions.width || product.dimensions.depth) && (
              <div className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('dimensions.title')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.dimensions.height && (
                    <div>
                      <p className="text-sm text-gray-500">{t('dimensions.height')}
</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.dimensions.height} {product.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {product.dimensions.width && (
                    <div>
                      <p className="text-sm text-gray-500">{t('dimensions.width')}
</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.dimensions.width} {product.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {product.dimensions.depth && (
                    <div>
                      <p className="text-sm text-gray-500">{t('dimensions.depth')}
</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.dimensions.depth} {product.dimensions.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('materials')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

           {/* Contact Button */}
          <div className="pt-6">
            <Link
        href={`/${locale}/contact?productId=${product.id}&productName=${encodeURIComponent(product.name)}`}     
         className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center font-semibold py-4 rounded-lg transition-all transform hover:scale-105"
            >
            {t('inquireButton')}
            </Link>
            <p className="text-sm text-gray-500 text-center mt-3">
            {t('inquireNote')}
            </p>
          </div>
          </div>
        </div>

        {/* Similar Products section */}
        {product && (
            <SimilarProducts 
              currentProductId={product.id} 
              categoryId={product.categoryId}
            />
          )}
      </div>
    </div>
  );
}