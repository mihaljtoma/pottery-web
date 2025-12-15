'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import ParallaxSection from '@/components/public/ParallaxSection';

export default function SocialGallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const openPost = (post, index) => {
    setSelectedPost(post);
    setSelectedIndex(index);
  };

  const nextPost = () => {
    if (selectedIndex < posts.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedPost(posts[nextIndex]);
    }
  };

  const prevPost = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedPost(posts[prevIndex]);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading || posts.length === 0) {
    return null;
  }

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
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="py-8 inline-flex items-center gap-2 bg-gradient-to-br from-amber-50 to-gray-50 to-amber-50 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
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
            const heights = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'];
            const heightClass = heights[index % heights.length];
            
            return (
              <div
                key={post.id}
                className="break-inside-avoid mb-4"
              >
                <div
                  onClick={() => openPost(post, index)}
                  className={`relative ${heightClass} group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer`}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Gallery image'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
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
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-white/30"
                        >
                          <Instagram size={16} />
                          View on Instagram
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Instagram size={20} />
              See More on Instagram
            </a>
          </div>
        )}
      </div>

      {/* Fancy Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition transform hover:scale-110 z-10"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            {selectedIndex + 1} / {posts.length}
          </div>

          <div className="max-w-5xl w-full">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-2xl">
              <Image
                src={selectedPost.imageUrl}
                alt={selectedPost.caption || 'Gallery image'}
                fill
                className="object-contain"
              />
            </div>

            {/* Content Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-6">
              {selectedPost.caption && (
                <p className="text-white text-lg leading-relaxed mb-6">
                  {selectedPost.caption}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {selectedPost.postUrl && (
                  <a
                    href={selectedPost.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
                  >
                    <Instagram size={20} />
                    View on Instagram
                    <ExternalLink size={16} />
                  </a>
                )}

                {/* Navigation Arrows */}
                <div className="flex gap-3 sm:ml-auto">
                  <button
                    onClick={prevPost}
                    disabled={selectedIndex === 0}
                    className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition transform hover:scale-110 text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextPost}
                    disabled={selectedIndex === posts.length - 1}
                    className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition transform hover:scale-110 text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}