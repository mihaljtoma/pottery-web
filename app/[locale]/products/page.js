'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Package, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const t = useTranslations('products');
  const locale = useLocale();
  // Fetch categories on mount and set category from URL
  useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetch(`/api/categories?locale=${locale}`);
      const data = await res.json();
      const cats = Array.isArray(data) ? data.filter(cat => cat.visible) : [];
      setCategories(cats);
      
      // After categories load, check URL parameter
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get('category');
        if (categoryFromUrl) {
          setSelectedCategory(categoryFromUrl);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };
  
  loadCategories();
}, [locale]); // Dodaj locale u dependency array

// Fetch products when filters change
useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedCategory && categories.length > 0) {
        const category = categories.find(cat => cat.slug === selectedCategory);
        if (category) {
          params.append('categoryId', category.id);
        }
      }
      if (selectedAvailability) {
        params.append('availability', selectedAvailability);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      params.append('locale', locale);

      const res = await fetch('/api/products?' + params.toString());
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if categories are loaded
  if (categories.length > 0 || (!selectedCategory && !selectedAvailability && !searchQuery)) {
    fetchProducts();
  }
}, [selectedCategory, selectedAvailability, searchQuery, categories, locale]); // ← Dodaj locale
  // ... rest of your component code (clearFilters, getCategoryName, return JSX, etc.)

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAvailability('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedAvailability || searchQuery;

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50">
      {/* Header */}
      <div className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
            {t('header.title')}
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: "'Lora', serif" }}>
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-1100">{t('filters.title')}</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {t('filters.clearAll')}
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filters.search')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('filters.category')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="ml-3 text-gray-700">{t('filters.allCategories')}</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.slug}
                        onChange={() => setSelectedCategory(category.slug)}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="ml-3 text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('filters.availability')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === ''}
                      onChange={() => setSelectedAvailability('')}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="ml-3 text-gray-700">{t('filters.all')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === 'available'}
                      onChange={() => setSelectedAvailability('available')}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="ml-3 text-gray-700">{t('filters.available')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === 'unavailable'}
                      onChange={() => setSelectedAvailability('unavailable')}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="ml-3 text-gray-700">{t('filters.unavailable')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === 'reserved'}
                      onChange={() => setSelectedAvailability('reserved')}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="ml-3 text-gray-700">{t('filters.reserved')}</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>
{/* Mobile Filter Button */}
<div className="lg:hidden">
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
  >
    <Filter size={20} />
    {t('filters.filtersButton')}
    {hasActiveFilters && (
      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
        {t('filters.active')}
      </span>
    )}
  </button>

  {/* Mobile Filters Overlay */}
  {showFilters && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-1100">Filters</h2>
          <button onClick={() => setShowFilters(false)}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="text-black w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('filters.category')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category-mobile"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="w-4 h-4 text-amber-600"
              />
              <span className="ml-3 text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category-mobile"
                  checked={selectedCategory === category.slug}
                  onChange={() => setSelectedCategory(category.slug)}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-3 text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('filters.availability')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability-mobile"
                checked={selectedAvailability === ''}
                onChange={() => setSelectedAvailability('')}
                className="w-4 h-4 text-amber-600"
              />
              <span className="ml-3 text-gray-700">{t('filters.all')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability-mobile"
                checked={selectedAvailability === 'available'}
                onChange={() => setSelectedAvailability('available')}
                className="w-4 h-4 text-amber-600"
              />
              <span className="ml-3 text-gray-700">{t('filters.available')}
</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability-mobile"
                checked={selectedAvailability === 'unavailable'}
                onChange={() => setSelectedAvailability('unavailable')}
                className="w-4 h-4 text-amber-600"
              />
              <span className="ml-3 text-gray-700">{t('filters.unavailable')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability-mobile"
                checked={selectedAvailability === 'reserved'}
                onChange={() => setSelectedAvailability('reserved')}
                className="w-4 h-4 text-amber-600"
              />
              <span className="ml-3 text-gray-700">{t('filters.reserved')}</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition"
            >
             {t('filters.clearFilters')}
            </button>
          )}
          <button
            onClick={() => setShowFilters(false)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition"
          >
          {t('filters.applyFilters')}
          </button>
        </div>
      </div>
    </div>
  )}
</div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {loading ? t('loading') :  t('productsFound', { count: products.length })}
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
              <p className="text-gray-500">{t('loadingProducts')}</p>   
                         </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                <p className="text-gray-600">{t('empty.subtitle')}</p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.id}`}   
                   className="group bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
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
                      
                      <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.availability === 'available' ? 'bg-green-200 text-white' :
                          product.availability === 'unavailable' ? 'bg-red-200 text-white' :
                          'bg-yellow-200 text-white'
                        }`}>
                          {product.availability === 'available' ? t('filters.available') :
                          product.availability === 'unavailable' ? t('filters.unavailable') :
                          t('filters.reserved')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{getCategoryName(product.categoryId)}</p>
                      {product.price && (
                        <p className="text-xl font-bold text-gray-900 mb-2">€{Number(product.price).toFixed(2)}</p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )} 
          </div>
        </div>

 
      </div>
    </div>
  );
}