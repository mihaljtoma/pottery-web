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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              {/* Image */}
              <Image
                src={post.imageUrl}
                alt={post.caption || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {post.caption && (
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {post.caption}
                    </p>
                  )}
                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-white text-sm font-medium hover:text-pink-300 transition"
                    >
                      View Post
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
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