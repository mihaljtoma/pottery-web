'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, ExternalLink } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function SocialGallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data.slice(0, 6) : []); // Show max 6 posts
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to gray-50 to-amber-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 ">
          <div className="inline-flex  items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Instagram size={16} />
            Social Gallery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Behind the Scenes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Follow our pottery journey and see what's happening in the studio
          </p>
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition"
            >
              <Instagram size={20} />
              Follow us on Instagram
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {/* Masonry Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {posts.map((post, index) => {
            // Create varied heights for visual interest
            const heights = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'];
            const heightClass = heights[index % heights.length];
            
            return (
              <div
                key={post.id}
                className="break-inside-avoid mb-4"
              >
                <div
                  className={`relative ${heightClass} group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all`}
                >
                  {/* Image */}
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Gallery image'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {post.caption && (
                        <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">
                          {post.caption}
                        </p>
                      )}
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-white/30"
                        >
                          <Instagram size={16} />
                          View on Instagram
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Instagram Icon Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-full opacity-80 group-hover:opacity-100 transition">
                    <Instagram size={16} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Link */}
        {settings.instagramUrl && (
          <div className="text-center mt-8">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <Instagram size={20} />
              See More on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}