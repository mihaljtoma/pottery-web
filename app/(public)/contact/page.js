'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
const { settings } = useSettings();
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
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email us directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 md:py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
      Get in Touch
    </h1>
    <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
      Have a question about our pottery or interested in a custom piece? 
      We'd love to hear from you!
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
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontFamily: "'Lora', serif" }}>
                We're here to help and answer any questions you might have. 
                We look forward to hearing from you!
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
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Email</h3>
                  <a 
                    href="mailto:contact@potterystudio.com"
                    className="text-amber-600 hover:text-amber-700 transition"
                  >
                   {settings.contactEmail || 'contact@potterystudio.com'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1" >
                    We'll respond within 24-48 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-xl flex-shrink-0">
                  <Phone className="text-green-600" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Phone</h3>
                  <a 
                    href="tel:+15551234567"
                    className="text-green-600 hover:text-green-700 transition"
                  >
                   {settings.contactPhone || '+1 (555) 123-4567'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>

           
            </div>

         
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora', serif" }}>
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontFamily: "'Lora', serif" }}>
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}