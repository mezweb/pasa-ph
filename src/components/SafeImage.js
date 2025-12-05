'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * SafeImage - Image component with fallback handling
 *
 * Props:
 * - src: Image source URL
 * - alt: Alt text
 * - fallbackIcon: Emoji or icon to show on error (default: 📦)
 * - fallbackType: 'product', 'profile', 'generic' (auto-selects icon)
 * - width, height: Image dimensions
 * - style: Custom styles
 * - showLoader: Show loading skeleton (default: true)
 * - All other Image props
 */
export default function SafeImage({
  src,
  alt = '',
  fallbackIcon = null,
  fallbackType = 'generic',
  width,
  height,
  style = {},
  showLoader = true,
  className = '',
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackIcons = {
    product: '📦',
    profile: '👤',
    seller: '✈️',
    buyer: '🛒',
    shop: '🏪',
    food: '🍱',
    beauty: '💄',
    electronics: '📱',
    generic: '🖼️'
  };

  const icon = fallbackIcon || fallbackIcons[fallbackType] || fallbackIcons.generic;

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  // If error occurred, show fallback
  if (imageError || !src) {
    return (
      <div
        style={{
          width: width || '100%',
          height: height || '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '8px',
          fontSize: '3rem',
          ...style
        }}
        className={className}
      >
        {icon}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: width || '100%', height: height || '200px', ...style }} className={className}>
      {/* Loading Skeleton */}
      {imageLoading && showLoader && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'pulse 1.5s ease-in-out infinite',
            borderRadius: '8px',
            zIndex: 1
          }}
        />
      )}

      {/* Actual Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          objectFit: 'cover',
          borderRadius: '8px',
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          ...style
        }}
        {...props}
      />

      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * SafeAvatar - Avatar image with fallback
 */
export function SafeAvatar({ src, alt = 'Avatar', size = 48, style = {}, ...props }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: `${size / 2}px`,
          fontWeight: 'bold',
          ...style
        }}
        {...props}
      >
        {alt.charAt(0).toUpperCase() || '👤'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        ...style
      }}
      {...props}
    />
  );
}

/**
 * SafeBackgroundImage - Div with background image and fallback
 */
export function SafeBackgroundImage({
  src,
  fallbackColor = '#f0f0f0',
  children,
  style = {},
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const backgroundStyle = imageError || !src
    ? { background: fallbackColor }
    : {
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };

  return (
    <div
      style={{
        ...backgroundStyle,
        ...style
      }}
      {...props}
    >
      {/* Hidden image to detect load/error */}
      {src && !imageError && (
        <img
          src={src}
          alt=""
          style={{ display: 'none' }}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
        />
      )}
      {children}
    </div>
  );
}
