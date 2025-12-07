'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function AboutPage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 md:py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
      About Our Craft
    </h1>
    <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
      Every piece tells a story of passion, dedication, and the timeless art of pottery making.
    </p>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                <p className="text-8xl">🏺</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200 rounded-full opacity-50 blur-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-orange-200 rounded-full opacity-50 blur-2xl -z-10"></div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Heart size={16} />
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Crafting Beauty, One Piece at a Time
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              {settings.aboutText ? (
                <p className="whitespace-pre-line">{settings.aboutText}</p>
              ) : (
                <>
                  <p>
                    Welcome to our pottery studio, where tradition meets creativity. For over a decade, 
                    we've been dedicated to creating unique, handcrafted pieces that bring warmth and 
                    character to your home.
                  </p>
                  <p>
                    Each piece begins as raw clay and is carefully shaped, glazed, and fired with 
                    attention to detail and a deep respect for the craft. We believe that pottery is 
                    more than just functional art—it's a connection to centuries of tradition and a 
                    celebration of the handmade.
                  </p>
                  <p>
                    Our studio is a place where creativity flows freely, where imperfections are 
                    celebrated as marks of authenticity, and where every piece carries the energy 
                    and intention of its creation.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our craft and inspire every piece we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Handcrafted with Love
              </h3>
              <p className="text-gray-600">
                Every piece is made by hand with care, attention to detail, and a deep passion 
                for the craft. No two pieces are exactly alike, making each one truly unique.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sustainable Materials
              </h3>
              <p className="text-gray-600">
                We source natural, eco-friendly materials and use sustainable practices in our 
                studio. Our glazes are non-toxic and safe for everyday use.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Personal Connection
              </h3>
              <p className="text-gray-600">
                We love connecting with our customers and creating custom pieces that tell your 
                story. Each commission is a collaboration and a joy to create.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From clay to finished piece, each step is a labor of love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design</h3>
              <p className="text-sm text-gray-600">
                Every piece begins with an idea, sketched and refined until it's ready to create.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shaping</h3>
              <p className="text-sm text-gray-600">
                Clay is carefully shaped on the wheel or by hand, taking form through skilled hands.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Glazing</h3>
              <p className="text-sm text-gray-600">
                Each piece is carefully glazed, choosing colors and finishes that enhance its beauty.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Firing</h3>
              <p className="text-sm text-gray-600">
                The kiln transforms raw clay into durable pottery, revealing the final colors and textures.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Learn More?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you're interested in a custom piece, 
            have questions about our process, or just want to say hello.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <Mail size={20} />
              Get in Touch
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}