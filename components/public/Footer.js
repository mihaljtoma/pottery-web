'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-amber-500 mb-4">
              {settings.siteName || 'Pottery Studio'}
            </h3>
            <p className="text-gray-400 mb-4">
              {settings.tagline || 'Handcrafted pottery made with love and dedication. Each piece tells a unique story.'}
            </p>
            <div className="flex gap-4">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-amber-600 p-2 rounded-lg transition"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-amber-600 p-2 rounded-lg transition"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-amber-600 p-2 rounded-lg transition"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-amber-500 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-500 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              {settings.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-amber-500 transition">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              {settings.studioAddress && (
                <li className="whitespace-pre-line">{settings.studioAddress}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} {settings.siteName || 'Pottery Studio'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}