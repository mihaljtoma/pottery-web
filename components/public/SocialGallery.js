'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useTranslations, useLocale } from 'next-intl';
export default function SocialGallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeStart, setSwipeStart] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(0); // 0 = none, -1 = left, 1 = right
  const containerRef = useRef(null);
  const [screenSize, setScreenSize] = useState('mobile');
  const { settings } = useSettings();
const t = useTranslations('socialGallery');
const locale = useLocale();
  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setScreenSize('desktop');
      } else if (window.innerWidth >= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data.slice(0, 12) : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate fixed offsets and rotations based on card index
  const getCardTransform = (cardIndex) => {
    const seed = cardIndex * 12345;
    const pseudo1 = Math.sin(seed) * 10000;
    const pseudo2 = Math.sin(seed * 2) * 10000;
    const pseudo3 = Math.sin(seed * 3) * 10000;
    const pseudo4 = Math.sin(seed * 4) * 10000;
    const pseudo5 = Math.sin(seed * 5) * 10000;

    const offsetX = ((pseudo1 % 40) - 20);
    const offsetY = ((pseudo2 % 40) - 20);
    const rotation = ((pseudo5 % 60) - 30);

    return { offsetX, offsetY, rotation };
  };

  // Configuration based on screen size
  const getConfig = () => {
    switch (screenSize) {
      case 'desktop':
        return { 
          visibleCards: 9,
          cardAspect: 'aspect-[3/4]',
          cardWidth: '320px',
          cardHeight: '430px'
        };
      case 'tablet':
        return { 
          visibleCards: 9,
          cardAspect: 'aspect-square',
          cardWidth: '320px',
          cardHeight: '430px'
        };
      default: // mobile
        return { 
          visibleCards: 9,
          cardAspect: 'aspect-[3/4]',
          cardWidth: '240px',
          cardHeight: '320px'
        };
    }
  };

  const config = getConfig();

  const handleNextCard = (direction = -1) => {
    if (isAnimating || posts.length === 0) return;
    setSwipeDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
      setIsAnimating(false);
      setSwipeDirection(0);
    }, 600);
  };

  const handleContainerClick = (e) => {
    // Don't trigger on badge click
    const badgeElement = e.target.closest('[data-badge]');
    if (badgeElement) return;
    
    // Click anywhere else to advance left
    handleNextCard(-1);
  };

  const handleMouseDown = (e) => {
    // Don't start on badge
    const badgeElement = e.target.closest('[data-badge]');
    if (badgeElement) return;
    
    setSwipeStart({
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    });
  };

  const handleMouseUp = (e) => {
    // Don't process if started on badge
    const badgeElement = e.target.closest('[data-badge]');
    if (badgeElement) return;
    
    if (!swipeStart) return;

    const endX = e.clientX;
    const endY = e.clientY;
    const diffX = swipeStart.x - endX;
    const diffY = swipeStart.y - endY;
    const timeDiff = Date.now() - swipeStart.time;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const isSwipe = distance > 50 && timeDiff < 500;

    if (isSwipe) {
      // Calculate angle for 8 directions
      const angle = Math.atan2(diffY, diffX) * (180 / Math.PI);
      
      let direction = 0;
      
      if (angle > -22.5 && angle <= 22.5) {
        direction = 1; // right
      } else if (angle > 22.5 && angle <= 67.5) {
        direction = 2; // down-right
      } else if (angle > 67.5 && angle <= 112.5) {
        direction = 3; // down
      } else if (angle > 112.5 && angle <= 157.5) {
        direction = 4; // down-left
      } else if (angle > 157.5 || angle <= -157.5) {
        direction = -1; // left
      } else if (angle > -157.5 && angle <= -112.5) {
        direction = -4; // up-left
      } else if (angle > -112.5 && angle <= -67.5) {
        direction = -3; // up
      } else if (angle > -67.5 && angle <= -22.5) {
        direction = -2; // up-right
      }
      
      handleNextCard(direction);
    }

    setSwipeStart(null);
  };

  const handleTouchStart = (e) => {
    // Don't start swipe if clicking on badge
    const badgeElement = e.target.closest('[data-badge]');
    if (badgeElement) return;
    
    setSwipeStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e) => {
    // Don't process if started on badge
    const badgeElement = e.target.closest('[data-badge]');
    if (badgeElement) return;
    
    if (!swipeStart) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = swipeStart.x - endX;
    const diffY = swipeStart.y - endY;
    const timeDiff = Date.now() - swipeStart.time;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const isSwipe = distance > 50 && timeDiff < 500;

    // Prevent default scroll behavior
    if (isSwipe) {
      e.preventDefault();
    }

    if (isSwipe) {
      // Calculate angle for 8 directions
      const angle = Math.atan2(diffY, diffX) * (180 / Math.PI);
      
      // 8 directions: 0=right, 45=down-right, 90=down, 135=down-left, 180/-180=left, -135=up-left, -90=up, -45=up-right
      let direction = 0;
      
      if (angle > -22.5 && angle <= 22.5) {
        direction = 1; // right
      } else if (angle > 22.5 && angle <= 67.5) {
        direction = 2; // down-right
      } else if (angle > 67.5 && angle <= 112.5) {
        direction = 3; // down
      } else if (angle > 112.5 && angle <= 157.5) {
        direction = 4; // down-left
      } else if (angle > 157.5 || angle <= -157.5) {
        direction = -1; // left
      } else if (angle > -157.5 && angle <= -112.5) {
        direction = -4; // up-left
      } else if (angle > -112.5 && angle <= -67.5) {
        direction = -3; // up
      } else if (angle > -67.5 && angle <= -22.5) {
        direction = -2; // up-right
      }
      
      handleNextCard(direction);
    }

    setSwipeStart(null);
  };

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-16 bg-amber-50   flex items-center overflow-x-hidden">

      

      <div className="w-full mx-auto px-4 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
            <Instagram size={16} />
            {t('badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('instruction')}
          </p>
        </div>

        {/* Flipbook Stack Container - All cards in one place, layered */}
        <div
          ref={containerRef}
          className="relative cursor-pointer touch-none"
          style={{
            width: config.cardWidth,
            height: config.cardHeight,
            perspective: '1000px',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleContainerClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* Render visible cards */}
          {Array.from({ length: config.visibleCards }).map((_, stackIndex) => {
            const postIndex = (currentIndex + stackIndex) % posts.length;
            const post = posts[postIndex];
            const zIndex = config.visibleCards - stackIndex;
            const isTopCard = stackIndex === 0;

            // Get fixed transform for this card index
            const transform = getCardTransform(postIndex);

            // Animation: slide top card in direction of swipe (8 directions)
            let animationOffsetX = 0;
            let animationOffsetY = 0;
            if (isAnimating && isTopCard) {
              const speed = 500;
              switch(swipeDirection) {
                case 1: // right
                  animationOffsetX = -speed;
                  break;
                case -1: // left
                  animationOffsetX = speed;
                  break;
                case 2: // down-right
                  animationOffsetX = -speed * 0.7;
                  animationOffsetY = -speed * 0.7;
                  break;
                case -2: // up-right
                  animationOffsetX = -speed * 0.7;
                  animationOffsetY = speed * 0.7;
                  break;
                case 3: // down
                  animationOffsetY = -speed;
                  break;
                case -3: // up
                  animationOffsetY = speed;
                  break;
                case 4: // down-left
                  animationOffsetX = speed * 0.7;
                  animationOffsetY = -speed * 0.7;
                  break;
                case -4: // up-left
                  animationOffsetX = speed * 0.7;
                  animationOffsetY = speed * 0.7;
                  break;
                default:
                  animationOffsetX = speed;
              }
            }

            // Stack offset - small vertical offset for each layer
            const stackOffsetY = stackIndex * 3;

            return (
              <div
                key={`card-${currentIndex}-${stackIndex}`}
                className="absolute inset-0 w-full h-full"
                style={{
                  zIndex,
                  pointerEvents: isTopCard ? 'auto' : 'none',
                }}
              >
                {/* Card with photograph borders */}
                <div
                  className={`relative w-full h-full rounded-none overflow-hidden border-8 border-white`}
                  style={{
                    boxShadow: `0 ${8 + stackIndex * 3}px ${16 + stackIndex * 6}px rgba(0, 0, 0, ${0.15 + stackIndex * 0.08}), inset 0 0 0 1px rgba(255, 255, 255, 0.5)`,
                    transformStyle: 'preserve-3d',
                    // Position in same place with small stack offset, rotation, and animation
                    transform: `
                      translateX(${transform.offsetX + animationOffsetX}px)
                      translateY(${transform.offsetY + animationOffsetY + stackOffsetY}px)
                      rotate(${transform.rotation}deg)
                    `,
                    opacity: isTopCard && isAnimating ? 0 : 1,
                    transition: isAnimating 
                      ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out'
                      : 'none',
                  }}
                >
                  {/* Image */}
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Gallery image'}
                    fill
                    className="object-cover"
                    priority={stackIndex === 0}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Instagram Badge */}
                  <div 
                    data-badge
                    className="absolute top-4 right-4 bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (post.postUrl) {
                        window.open(post.postUrl, '_blank');
                      }
                    }}
                  >
                    <Instagram size={18} className="text-white" />
                  </div>

                  {/* Content Overlay - Bottom (Only on top card) */}
                  {isTopCard && (
                    <div className="absolute bottom-0 left-0 right-0  md:p-6 bg-gradient-to-t from-black/90 to-transparent">
                      
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className=""
                        >
                      
                        </a>
                      )}
                    </div>
                  )}

                
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 md:mt-12 flex items-center justify-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / posts.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs md:text-sm font-semibold text-gray-700 min-w-fit">
            {currentIndex + 1}/{posts.length}
          </span>
        </div>

        {/* Call to Action */}
        {settings.instagramUrl && (
          <div className="mt-8 md:mt-12 text-center">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
             <Instagram size={18} />
              {t('followButton')}
              <ExternalLink size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}