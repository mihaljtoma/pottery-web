'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations } from 'next-intl';

export default function GalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flipped, setFlipped] = useState({});
  const { settings } = useSettings();
  const t = useTranslations('gallery');

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

  const toggleFlip = (postId) => {
    setFlipped(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ fontFamily: "'Lora', serif" }}>
            <Instagram size={16} />
            {t('header.badge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Lora', serif" }}>
            {t('header.title')}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8" style={{ fontFamily: "'Lora', serif" }}>
            {t('header.subtitle')}
          </p>
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Instagram size={20} />
              {t('header.followButton')}
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
            <p className="text-gray-500">{t('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <Instagram size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600">
              {t('empty.subtitle')}
            </p>
          </div>
        )}

        {/* Masonry Gallery */}
        {!loading && posts.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {posts.map((post, index) => {
              const aspects = [
                'aspect-square',
                'aspect-[4/5]',
                'aspect-[3/4]',
                'aspect-[5/4]',
                'aspect-[4/3]'
              ];
              const aspectClass = aspects[index % aspects.length];
              const isFlipped = flipped[post.id];

              return (
                <div
                  key={post.id}
                  className="break-inside-avoid mb-4"
                >
                  {/* Flip Card Container */}
                  <div
                    className={`relative ${aspectClass} group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                    onClick={() => toggleFlip(post.id)}
                    style={{
                      perspective: '1000px'
                    }}
                  >
                    {/* Front Side - Image */}
                    <div 
                      className="w-full h-full relative"
                      style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s ease-in-out',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        pointerEvents: isFlipped ? 'none' : 'auto'
                      }}
                    >
                      <Image
                        src={post.imageUrl}
                        alt={post.caption || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {post.caption && (
                            <p className="text-white text-sm leading-relaxed line-clamp-3">
                              {post.caption}
                            </p>
                          )}
                          <p className="text-white text-xs mt-4 opacity-75">{t('card.clickMore')}</p>
                        </div>
                      </div>

                      <a
                        href={post.postUrl || settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-4 right-4 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg transform hover:scale-110"
                      >
                        <Instagram size={18} className="text-white" />
                      </a>
                    </div>

                    {/* Back Side - Description & Link */}
                    <div 
                      className="absolute inset-0 bg-amber-50 rounded-2xl w-full h-full p-6 flex flex-col justify-between"
                      style={{
                        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s ease-in-out',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        pointerEvents: isFlipped ? 'auto' : 'none'
                      }}
                    >
                      <div>
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                          <Instagram size={12} />
                          {t('card.postDetails')}
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed line-clamp-5 font-medium">
                          {post.caption || t('card.noDescription')}
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <a
                          href={post.postUrl || settings.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105 w-full"
                        >
                          <Instagram size={16} />
                          {t('card.viewInstagram')}
                          <ExternalLink size={14} />
                        </a>
                        <p className="text-gray-500 text-xs text-center">{t('card.clickFlip')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fancy Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl mb-6 shadow-2xl">
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
                    {t('modal.viewInstagram')}
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
    </div>
  );
}