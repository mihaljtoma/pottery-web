'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations, useLocale } from 'next-intl';

export default function ContactPageContent() {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const t = useTranslations('contactPage');
  const locale = useLocale();

  useEffect(() => {
    // Get URL params using URLSearchParams
    const params = new URLSearchParams(window.location.search);
    setProductId(params.get('productId') || '');
    setProductName(params.get('productName') || '');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: productName ? t('form.productMessage', { productName }) : '',
    productId: productId || null
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  // Update message when productName loads
  useEffect(() => {
    if (productName) {
      setFormData(prev => ({
        ...prev,
        message: t('form.productMessage', { productName })
      }));
    }
  }, [productName, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: 'success',
          message: t('status.success')
        });
        setFormData({ name: '', email: '', message: '', productId: null });
      } else {
        setStatus({
          type: 'error',
          message: data.error || t('status.error')
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: t('status.failed')
      });
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Lora', serif" }}>
                {t('info.title')}
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontFamily: "'Lora', serif" }}>
                {t('info.subtitle')}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-4 rounded-xl flex-shrink-0">
                  <Mail className="text-amber-600" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{t('info.email')}</h3>
                  <a 
                    href={`mailto:${settings.contactEmail || 'contact@potterystudio.com'}`}
                    className="text-amber-600 hover:text-amber-700 transition"
                  >
                    {settings.contactEmail || 'contact@potterystudio.com'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('info.emailNote')}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-xl flex-shrink-0">
                  <Phone className="text-green-600" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{t('info.phone')}</h3>
                  <a 
                    href={`tel:${settings.contactPhone || '+15551234567'}`}
                    className="text-green-600 hover:text-green-700 transition"
                  >
                    {settings.contactPhone || '+1 (555) 123-4567'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('info.phoneNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="py-16 bg-amber-50 rounded-2xl shadow-xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora', serif" }}>
                {t('form.title')}
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontFamily: "'Lora', serif" }}>
                {t('form.subtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition text-black"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition text-black"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none text-black"
                    placeholder={t('form.messagePlaceholder')}
                  />
                  {productName && (
                    <p className="text-xs text-amber-600 mt-2">
                      {t('form.preFilled', { productName })}
                    </p>
                  )}
                </div>

                {/* Status Message */}
                {status.message && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    status.type === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {status.type === 'success' && (
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <p className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {status.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      {t('form.submit')}
                      <Send size={20} />
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  {t('form.privacy')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}