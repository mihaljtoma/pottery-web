'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink, X } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations } from 'next-intl';

export default function GalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [expandedGridIndex, setExpandedGridIndex] = useState(null);
  const [flipState, setFlipState] = useState(0); // 0=closed, 1=card visible
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

  const getGridSize = (index) => {
    const sizes = [
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1',
    ];
    return sizes[index % sizes.length];
  };

  const toggleFlip = (postId, e) => {
    e.stopPropagation();
    setFlipped(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleMobileCardTap = (index) => {
    setExpandedGridIndex(index);
    setFlipState(0); // Start at grid
    setTimeout(() => {
      setFlipState(1); // Animate to card
    }, 50);
  };

  const handleExpandedCardTap = (e) => {
    e.stopPropagation();
    if (flipState === 1) {
      setFlipState(0); // Flip back to grid
      setTimeout(() => {
        setExpandedGridIndex(null);
      }, 800);
    }
  };

  const closeExpandedGrid = () => {
    setExpandedGridIndex(null);
    setFlipState(0);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const expandedPost = expandedGridIndex !== null ? posts[expandedGridIndex] : null;

  return (
    <div className="min-h-screen bg-amber-50 relative overflow-x-hidden">
      {/* Grain Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply z-0"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2"/%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
        }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 py-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50/60 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Instagram size={14} />
              {t('header.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-950 mb-4" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>
              {t('header.title')}
            </h1>
            <p className="text-lg text-amber-800/70 max-w-2xl mx-auto mb-8" style={{ fontFamily: "'Geist', sans-serif" }}>
              {t('header.subtitle')}
            </p>
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-3 rounded-sm font-semibold transition-all transform hover:scale-105 shadow-md text-sm"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                <Instagram size={18} />
                {t('header.followButton')}
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
<div className="max-w-7xl mx-auto px-0  pb-[66vw] md:pb-12 relative z-10">
          {/* Loading */}
        {loading && (
          <div className="text-center py-24">
            <div className="inline-block">
              <Instagram size={48} className="mx-auto text-amber-300 mb-4 animate-pulse" />
              <p className="text-amber-800/60 mt-4" style={{ fontFamily: "'Geist', sans-serif" }}>{t('loading')}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-24">
            <Instagram size={48} className="mx-auto text-amber-300 mb-4" />
            <h3 className="text-2xl font-semibold text-amber-950 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('empty.title')}
            </h3>
            <p className="text-amber-800/60" style={{ fontFamily: "'Geist', sans-serif" }}>
              {t('empty.subtitle')}
            </p>
          </div>
        )}

        {/* Masonry Gallery */}
        {!loading && posts.length > 0 && (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-4 gap-0 auto-rows-[250px]">
              {posts.map((post, index) => {
                const gridSize = getGridSize(index);
                const isFlipped = flipped[post.id];

                return (
                  <div
                    key={post.id}
                    className={`${gridSize} relative overflow-hidden group`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0,
                    }}
                  >
                    <div
                      className="w-full h-full relative cursor-pointer"
                      onClick={(e) => toggleFlip(post.id, e)}
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      {/* Front */}
                      <div
                        className="w-full h-full absolute"
                        style={{
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <Image
                          src={post.imageUrl}
                          alt={post.caption || 'Gallery image'}
                          fill
                          className="object-cover group-hover:brightness-90 transition-all duration-500"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                          <div className="flex-1">
                            {post.caption && (
                              <p className="text-white text-xs line-clamp-2" style={{ fontFamily: "'Geist', sans-serif" }}>
                                {post.caption}
                              </p>
                            )}
                          </div>
                          <div className="text-white/70 text-xs ml-2 whitespace-nowrap" style={{ fontFamily: "'Geist', sans-serif" }}>
                            {t('card.clickFlip')}
                          </div>
                        </div>
                      </div>

                      {/* Back */}
<div
  className="w-full h-full absolute bg-white overflow-hidden"
  style={{
    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }}
>
    <div style={{ transform: 'scaleX(-1)' }} className="w-full h-full relative">

  <Image
    src={post.imageUrl}
    alt={post.caption || 'Gallery image'}
    fill
    className="object-cover"
  />
  </div>
  
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  
  {/* Text and Link overlay */}
  <div className="absolute inset-0 flex flex-col justify-end p-4">
    <p className="text-white text-xs leading-relaxed line-clamp-3 font-medium mb-3 drop-shadow-lg" style={{ fontFamily: "'Geist', sans-serif" }}>
      {post.caption || t('card.noDescription')}
    </p>
    <a
      href={post.postUrl || settings.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center  justify-center gap-2  hover:from-rose-600 hover:to-orange-600 text-white px-3 py-2 rounded-lg font-semibold text-xs transition transform hover:scale-105 w-full shadow-lg"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <Instagram size={14} />
                               {t('card.viewInstagram')}
    </a>
  </div>

</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile/Tablet Grid (3 columns with expandable rows) */}
            <div className="md:hidden grid grid-cols-3 gap-0 auto-rows-[33vw] relative">
              {posts.map((post, index) => {
                const isExpanded = expandedGridIndex === index;
                const rowIndex = Math.floor(index / 3);
                const expandedRowIndex = expandedGridIndex !== null ? Math.floor(expandedGridIndex / 3) : -1;
                const isInExpandedRowRange = expandedGridIndex !== null && 
                  rowIndex >= expandedRowIndex && 
                  rowIndex < expandedRowIndex + 3;

                return (
                  <div
                    key={post.id}
                    className="relative overflow-visible group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0,
                      pointerEvents: isInExpandedRowRange ? 'none' : 'auto',
                      backgroundColor: isInExpandedRowRange ? 'amber-50' : 'transparent',
                    }}
                    onClick={(e) => {
                      if (!isExpanded && expandedGridIndex === null) {
                        handleMobileCardTap(index);
                      }
                    }}
                  >
                    {/* Regular Grid Cards - Show when not in expanded row range */}
                    {!isInExpandedRowRange && (
                      <div className="absolute inset-0 cursor-pointer" onClick={() => {
                        if (!isExpanded && expandedGridIndex === null) {
                          handleMobileCardTap(index);
                        }
                      }}>
                        <Image
                          src={post.imageUrl}
                          alt={post.caption || 'Gallery image'}
                          fill
                          className="object-cover group-hover:brightness-90 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Overlay Expanded Flip Card - Fixed Position at row start */}
              {expandedGridIndex !== null && expandedPost && (
                <div
                  className="absolute left-0 right-0 z-50"
                  style={{
                    top: `${Math.floor(expandedGridIndex / 3) * 33.33}vw`,
                    width: '100%',
                    height: `${33.33 * 3}vw`,
                    perspective: '1200px',
                  }}
                >
                 

                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transform: flipState === 1 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    }}
                    onClick={(e) => handleExpandedCardTap(e)}
                  >
                    {/* Front: Grid of 9 Images (with placeholders if needed) */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)',
                        gap: 0,
                      }}
                      className="bg-amber-50"
                    >
                      {Array.from({ length: 9 }).map((_, idx) => {
                        const postIndex = Math.floor(expandedGridIndex / 3) * 3 + idx;
                        const post = posts[postIndex];
                        
                        return (
                          <div key={idx} className="relative overflow-hidden">
                            {post ? (
                              <Image
                                src={post.imageUrl}
                                alt={post.caption || 'Gallery image'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-amber-50" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Back: Big Image + Title + Link */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'grid',
                        gridTemplateRows: '1fr auto',
                      }}
                      className="bg-amber-50 overflow-hidden"
                    >
                      {/* Big Image with overlay */}
                      <div className="relative w-full h-full group">
                        <Image
                          src={expandedPost.imageUrl}
                          alt={expandedPost.caption || 'Gallery image'}
                          fill
                          className="object-cover"
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Caption overlay on image */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <h2 className="text-xl font-bold text-amber-50 mb-2 line-clamp-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {expandedPost.caption || 'Post Details'}
                          </h2>
                            {/* Bottom Link Bar */}
                      <div className="bg-amber-50/10 backdrop-blur-sm mx-14 px-4 py-4  justify-end rounded-lg">
                        <a
                          href={expandedPost.postUrl || settings.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-gradient-to-r  text-amber-50   rounded-lg font-semibold transition-all transform"
                          style={{ fontFamily: "'Geist', sans-serif" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram size={16} />
                                                         {t('card.viewInstagram')}
                          <ExternalLink size={14} />
                        </a>
                      </div>
                        </div>
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                      </div>

                    
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        html {
          scroll-behavior: auto;
        }
      `}</style>
    </div>
  );
}