'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoriesShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    
    // FIX: Make sure data is an array before filtering
    if (Array.isArray(data)) {
      setCategories(data.filter(cat => cat.visible));
    } else {
      console.error('Categories data is not an array:', data);
      setCategories([]);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

  if (loading || categories.length === 0) {
    return null;
  }

  // Icon mapping for categories (you can customize these)
  const categoryIcons = {
    default: '🏺',
    bowls: '🥣',
    vases: '🏺',
    plates: '🍽️',
    mugs: '☕',
    cups: '🫖',
    decorative: '🎨',
    sculptures: '🗿'
  };

  const getIcon = (name) => {
    const key = name.toLowerCase();
    return categoryIcons[key] || categoryIcons.default;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 text-center">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(category.name)}
                </div>
                
                {/* Category Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                  {category.name}
                </h3>
                
                {/* Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                {/* View Link */}
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}