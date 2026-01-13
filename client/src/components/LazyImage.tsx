import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  fallback?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  width,
  height,
  fallback = '/placeholder.svg'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Lädt Bilder 100px bevor sie sichtbar sind
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && 'bg-slate-200 animate-pulse',
        placeholderClassName
      )}
      style={{ width, height }}
    >
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      )}
    </div>
  );
}

// Optimierte Bild-URL für verschiedene Größen
export function getOptimizedImageUrl(src: string, width: number): string {
  // Wenn es ein lokales Bild ist, direkt zurückgeben
  if (src.startsWith('/')) return src;
  
  // Für externe Bilder könnte hier ein Image-CDN verwendet werden
  // z.B. Cloudinary, imgix, etc.
  return src;
}
