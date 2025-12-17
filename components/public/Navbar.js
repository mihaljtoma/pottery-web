'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Function to switch language
  const switchLocale = (newLocale) => {
    if (!pathname) return `/${newLocale}`;
    const pathWithoutLocale = pathname.replace(/^\/(en|hr)/, '');
    return `/${newLocale}${pathWithoutLocale || ''}`;
  };

  return (
    <nav className="bg-amber-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-3xl font-bold text-amber-700" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {settings.siteName || 'Pottery Studio'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-amber-600 transition">
              {t('home')}
            </Link>
            <Link href={`/${locale}/products`} className="text-gray-700 hover:text-amber-600 transition">
              {t('products')}
            </Link>
            <Link href={`/${locale}/gallery`} className="text-gray-700 hover:text-amber-600 transition">
              {t('gallery')}
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-700 hover:text-amber-600 transition">
              {t('about')}
            </Link>
            <Link href={`/${locale}/contact`} className="text-gray-700 hover:text-amber-600 transition">
              {t('contact')}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 ml-4 border-l pl-4">
              <Link
                href={switchLocale('hr')}
                className={`px-3 py-1 rounded-lg font-semibold transition text-sm ${
                  locale === 'hr' ? 'bg-amber-600 text-white' : 'text-gray-700 hover:bg-amber-100'
                }`}
              >
                HR
              </Link>
              <Link
                href={switchLocale('en')}
                className={`px-3 py-1 rounded-lg font-semibold transition text-sm ${
                  locale === 'en' ? 'bg-amber-600 text-white' : 'text-gray-700 hover:bg-amber-100'
                }`}
              >
                EN
              </Link>
            </div>
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
              <Link href={`/${locale}`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-amber-600 transition">
                {t('home')}
              </Link>
              <Link href={`/${locale}/products`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-amber-600 transition">
                {t('products')}
              </Link>
              <Link href={`/${locale}/gallery`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-amber-600 transition">
                {t('gallery')}
              </Link>
              <Link href={`/${locale}/about`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-amber-600 transition">
                {t('about')}
              </Link>
              <Link href={`/${locale}/contact`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-amber-600 transition">
                {t('contact')}
              </Link>

              {/* Language Switcher Mobile */}
              <div className="flex gap-2 pt-4 border-t">
                <Link href={switchLocale('hr')} className={`flex-1 px-3 py-2 rounded-lg font-semibold text-center transition ${locale === 'hr' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  HR
                </Link>
                <Link href={switchLocale('en')} className={`flex-1 px-3 py-2 rounded-lg font-semibold text-center transition ${locale === 'en' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  EN
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}