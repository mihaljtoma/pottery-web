'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
      <footer className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-white relative overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white drop-shadow-md mb-4">
              {settings.siteName || 'Pottery Studio'}
            </h3>
            <p className="text-black/90 mb-6 leading-relaxed drop-shadow-sm">
              {settings.tagline || 'Handcrafted pottery made with love and dedication. Each piece tells a unique story.'}
            </p>
            
            {/* Social Links */}
            {(settings.instagramUrl || settings.facebookUrl || settings.twitterUrl) && (
              <div className="flex gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg transition-all transform hover:scale-110"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg transition-all transform hover:scale-110"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {settings.twitterUrl && (
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-lg transition-all transform hover:scale-110"
                  >
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-black drop-shadow-md mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-black/90 hover:text-white transition-colors flex items-center gap-2 group drop-shadow-sm">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-black/90 hover:text-white transition-colors flex items-center gap-2 group drop-shadow-sm">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-black/90 hover:text-white transition-colors flex items-center gap-2 group drop-shadow-sm">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-black/90 hover:text-white transition-colors flex items-center gap-2 group drop-shadow-sm">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black/90 hover:text-white transition-colors flex items-center gap-2 group drop-shadow-sm">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-black drop-shadow-md mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-black/90 drop-shadow-sm">
              {settings.contactEmail && (
                <li>
                  <a 
                    href={`mailto:${settings.contactEmail}`} 
                    className="hover:text-black transition-colors block"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="hover:text-black transition-colors">
                  {settings.contactPhone}
                </li>
              )}
              {settings.studioAddress && (
                <li className="whitespace-pre-line hover:text-black transition-colors">
                  {settings.studioAddress}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black/90 text-sm flex items-center gap-2 drop-shadow-sm">
              © {currentYear} {settings.siteName || 'Pottery Studio'}. 
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