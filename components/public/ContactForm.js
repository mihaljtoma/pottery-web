'use client';

import { useState } from 'react';
import { Mail, Phone, Send ,Truck} from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations } from 'next-intl';
import ParallaxSection from '@/components/public/ParallaxSection';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const t = useTranslations('contactForm');

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

      if (res.ok) {
        setStatus({
          type: 'success',
          message: t('success')
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: t('error')
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: t('failed')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <ParallaxSection
            imageUrl="/anton_suskov.jpg"
            title=""
            subtitle=""
            height="h-96"
          />
        </div>

        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('subtitle')}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Mail className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('info.email')}</h3>
                  <a 
                    href={`mailto:${settings.contactEmail || 'contact@potterystudio.com'}`}
                    className="text-amber-600 hover:text-amber-700 transition"
                  >
                    {settings.contactEmail || 'contact@potterystudio.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Phone className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('info.phone')}</h3>
                  <p className="text-gray-600">{settings.contactPhone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
           
        
              <div className="flex items-start gap-4">
                              <div className="bg-amber-100 p-3 rounded-lg">
                                <Truck className="text-amber-600" size={24} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('info.dostava')}</h3>
                                <p className="text-gray-600">4.5€</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
          {/* Right Side - Contact Form */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-white"
                  placeholder={t('form.namePlaceholder')}
                />
              </div>

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
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-white"
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="5"
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none bg-white"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              {status.message && (
                <div className={`p-4 rounded-lg ${
                  status.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading ? t('form.sending') : (
                  <>
                    {t('form.submit')}
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}