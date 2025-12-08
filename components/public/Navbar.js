'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <nav className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-amber-700" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {settings.siteName || 'Pottery Studio'}
                </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-amber-600 transition">
              Products
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-amber-600 transition">
              Gallery
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Products
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}