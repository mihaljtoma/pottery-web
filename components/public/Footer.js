'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
      <footer className="py-8 bg-gradient-to-br from-amber-50 to white to-amber-50 text-white relative overflow-hidden">
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature Cards - Zigzag Pattern */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Brand (Top Left) */}
          <div className="bg-gradient-to-br from-amber-50  to-amber-50 rounded-2xl p-8 shadow-lg md:col-span-1 md:row-span-2">
            <div className="border-2 border-white rounded-xl p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3"  style={{ fontFamily: "'Lora', serif" }}>
                  {settings.siteName || 'Rosy Pottery'}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6"  style={{ fontFamily: "'Lora', serif" }}>
                  {settings.tagline || 'Handcrafted Pottery with Love and Enjoyment'}
                </p>
              </div>
              
              {/* Social Links */}
              {(settings.instagramUrl || settings.facebookUrl || settings.twitterUrl) && (
                <div className="flex gap-3 mt-4">
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-200 hover:bg-amber-300 text-gray-900 p-3 rounded-lg transition-all transform hover:scale-110"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-200 hover:bg-amber-300 text-gray-900 p-3 rounded-lg transition-all transform hover:scale-110"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {settings.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-200 hover:bg-amber-300 text-gray-900 p-3 rounded-lg transition-all transform hover:scale-110"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 2 - Quick Links (Top Right) */}
          <div className="bg-gradient-to-br from-amber-50  to-amber-50 rounded-2xl p-8 shadow-lg md:col-span-2 md:col-start-2">
            <h4 className="font-semibold text-gray-900 mb-6 text-lg"  style={{ fontFamily: "'Lora', serif" }}>Quick Links</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Products
              </Link>
              <Link href="/gallery" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Gallery
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Card 3 - Contact (Bottom Right) */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-2xl p-8 shadow-lg md:col-span-1 md:col-start-3 md:row-start-3">
            <h4 className="font-semibold text-gray-900 mb-6 text-lg "  style={{ fontFamily: "'Lora', serif" }}>Contact</h4>
            <div className="space-y-4">
              {settings.contactEmail && (
                <div>
                  <p className="text-sm text-gray-600 mb-1"  style={{ fontFamily: "'Lora', serif" }}>Email</p>
                  <a 
                    href={`mailto:${settings.contactEmail}`} 
                    className="text-gray-700 hover:text-amber-600 font-medium transition-colors block"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1"  style={{ fontFamily: "'Lora', serif" }}>Phone</p>
                  <p className="text-gray-700 font-medium">
                    {settings.contactPhone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black/90 text-sm flex items-center gap-2 drop-shadow-sm">
              © {currentYear} {settings.siteName || 'Rosy Pottery'}. 
              <span className="hidden md:inline">All rights reserved.</span>
            </p>
            <p className="text-black/90 text-sm flex items-center gap-2 drop-shadow-sm">
              Made with <Heart size={14} className="text-rose-300 fill-rose-300 animate-pulse" /> and clay
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}