'use client';

interface ParallaxSectionProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  height?: string;
}

export default function ParallaxSection({ 
  imageUrl, 
  title, 
  subtitle,
  height = 'h-96'
}: ParallaxSectionProps) {
  return (
    <div 
      className={`relative ${height} overflow-hidden w-full`}
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        willChange: 'background-position'
      }}
    >
      {/* Dark Overlay - Simplified for mobile */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center px-4 mb-4 drop-shadow-lg">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base md:text-xl text-white/90 text-center px-4 max-w-2xl drop-shadow-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}