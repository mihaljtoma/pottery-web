'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Golden Gradient Background */}
      <div className="absolute inset-0 py-16 bg-amber-50">        
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
  
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Image
          src="/maca_up.jpeg"
          alt="pottery background"
          fill
          className="object-cover object-center opacity-40"
          priority
        />
      </div>

     

      {/* Content Overlay */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-full">
          {/* Text Content */}
          <div className="max-w-3xl text-center">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              {t('badge')}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-3d-float-animated relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white">{t('title.line1')}</span>
              <span className="block text-amber-50">
                {t('title.line2')}
              </span>
              <span className="text-white">{t('title.line3')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-black/95 mb-8 leading-relaxed drop-shadow-md relative z-10" style={{ fontFamily: "'Lora', serif" }}>
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
              >
                {t('viewCollection')}
                <ArrowRight size={20} />
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-black px-8 py-4 rounded-lg border-2 border-white/40 transition-all shadow-lg"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}