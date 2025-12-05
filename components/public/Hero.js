import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Handcrafted
              <span className="block text-amber-600">Pottery</span>
              with Love
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Each piece is uniquely crafted by hand, bringing warmth and character to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                View Collection
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold border-2 border-gray-200 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image Placeholder - You can replace with actual image */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                <p className="text-6xl">🏺</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}