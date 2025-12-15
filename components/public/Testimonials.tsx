'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  image?: string;
  visible?: boolean;
  order?: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      // Filter only visible testimonials and sort by order
      const visible = data.filter((t: Testimonial) => t.visible !== false);
      setTestimonials(visible);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-20 bg-amber-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  return (
<section className="py-16 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 overflow-hidden">
        {/* Background Elements */}
      {/* Background Elements */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl hidden md:block"></div>
  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl hidden md:block"></div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-semibold text-amber-600 tracking-wide uppercase">
              Customer Stories
            </span>
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 mb-4">
            Reviews
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hear what our happy customers have to say about their pottery pieces.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div className=" bg-gradient-to-br from-amber-50 to gray-50 to-amber-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Quote Icon */}
              <Quote className="w-12 h-12 text-amber-600 mb-6 opacity-20" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
                "{current.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  {current.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    current.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{current.name}</p>
                  {current.location && (
                    <p className="text-sm text-gray-600">{current.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gradient-to-r from-amber-50 to-slate-50 px-8 md:px-12 py-6 flex items-center justify-between">
              <button
                onClick={prevTestimonial}
                className="p-2 hover:bg-white rounded-lg transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft
                  size={24}
                  className="text-gray-600 group-hover:text-amber-600 transition"
                />
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-amber-600 w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 hover:bg-white rounded-lg transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight
                  size={24}
                  className="text-gray-600 group-hover:text-amber-600 transition"
                />
              </button>
            </div>
          </div>

         
        </div>
      </div>
       {/* Feature Cards - Fun Aligned */}
<div className="mt-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
  {/* Card 1 - Top Left */}
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg md:row-span-1 md:translate-y-0">
     <div className="flex items-start gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h5 className="font-bold text-gray-900 mb-2">Handcrafted Quality</h5>
                <p className="text-sm text-gray-700">Each piece is made with meticulous care and attention to detail.</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Middle, Slightly Down */}
<div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 shadow-lg md:row-span-1 md:translate-y-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h5 className="font-bold text-gray-900 mb-2">Fast Shipping</h5>
                <p className="text-sm text-gray-700">We ship your order quickly and safely to your door.</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Top Right */}
<div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-8 shadow-lg md:row-span-1 md:translate-y-12">
            <div className="flex items-start gap-4">
              <div className="text-3xl">♻️</div>
              <div>
                <h5 className="font-bold text-gray-900 mb-2">Eco Friendly</h5>
                <p className="text-sm text-gray-700">Made with sustainable practices and natural materials.</p>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}