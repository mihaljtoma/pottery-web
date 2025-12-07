'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink, X } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function GalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ fontFamily: "'Lora', serif" }}>
            <Instagram size={16} />
            Social Gallery
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Behind the Scenes
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8" style={{ fontFamily: "'Lora', serif" }}>
            Follow our pottery journey and see what's happening in the studio
          </p>
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <Instagram size={20} />
              Follow on Instagram
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Instagram size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <Instagram size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">
              Check back soon for behind-the-scenes photos!
            </p>
          </div>
        )}

        {/* Masonry Gallery */}
        {!loading && posts.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {posts.map((post, index) => {
              // Create varied aspect ratios for visual interest
              const aspects = [
                'aspect-square',
                'aspect-[4/5]',
                'aspect-[3/4]',
                'aspect-[5/4]',
                'aspect-[4/3]'
              ];
              const aspectClass = aspects[index % aspects.length];

              return (
                <div
                  key={post.id}
                  className="break-inside-avoid mb-4"
                >
                  <div
                    onClick={() => setSelectedPost(post)}
                    className={`relative ${aspectClass} group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                  >
                    {/* Image */}
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Gallery image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {post.caption && (
                          <p className="text-white text-sm leading-relaxed line-clamp-3">
                            {post.caption}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Instagram Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg">
                      <Instagram size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition"
          >
            <X size={24} />
          </button>

          <div className="max-w-5xl w-full">
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <Image
                src={selectedPost.imageUrl}
                alt={selectedPost.caption || 'Gallery image'}
                fill
                className="object-contain"
              />
            </div>

            {selectedPost.caption && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
                <p className="text-white text-lg leading-relaxed">
                  {selectedPost.caption}
                </p>
              </div>
            )}

            {selectedPost.postUrl && (
              <a
                href={selectedPost.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Instagram size={20} />
                View on Instagram
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}