'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations, useLocale } from 'next-intl';

export default function AboutPage() {
  const { settings, loading } = useSettings();
  const t = useTranslations('about');
  const locale = useLocale();

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-amber-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-amber-50">
      {/* Hero Section */}
      <div className="py-8 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
            {t('hero.subtitle')}
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
              <Image
                src="/tea_up.png"
                alt="Pottery example"
                className="w-full h-full object-cover"
                width={600}
                height={600}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200 rounded-full opacity-50 blur-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-orange-200 rounded-full opacity-50 blur-2xl -z-10"></div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Heart size={16} />
              {t('story.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('story.title')}
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              {settings.aboutText ? (
                <p className="whitespace-pre-line">{settings.aboutText}</p>
              ) : (
                <>
                  <p>{t('story.text1')}</p>
                  <p>{t('story.text2')}</p>
                  <p>{t('story.text3')}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('values.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="py-16 bg-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('values.value1.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.value1.description')}
              </p>
            </div>

            {/* Value 2 */}
            <div className="py-16 bg-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('values.value2.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.value2.description')}
              </p>
            </div>

            {/* Value 3 */}
            <div className="py-16 bg-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('values.value3.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.value3.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('process.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('process.step1.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('process.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('process.step2.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('process.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('process.step3.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('process.step3.description')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-600">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('process.step4.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('process.step4.description')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <Mail size={20} />
              {t('cta.contact')}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-all"
            >
              {t('cta.viewWork')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}