'use client';

import { useState } from 'react';

/**
 * FastImage: Zero-delay high performance image loader
 * Solves late photo loading by combining:
 * 1. Instant 0ms CSS shimmer gradient skeleton
 * 2. Direct browser image loading (no Next.js image proxy bottleneck)
 * 3. Graceful sacred SVG fallback on network delay/error
 */
export default function FastImage({
  src,
  alt = 'ShraddhaSetu Sacred Image',
  width,
  height,
  priority = false,
  className = '',
  style = {},
  onClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`fast-img-container ${loaded ? 'is-loaded' : 'is-loading'} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: '100%',
        background: 'linear-gradient(135deg, #FFF9F0 0%, #FEEBC8 50%, #FFF9F0 100%)',
        ...style,
      }}
      onClick={onClick}
    >
      {/* 0ms Instant Golden Temple Shimmer Layer */}
      {!loaded && !error && (
        <div
          className="fast-img-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(254,235,200,0.6) 50%, rgba(255,255,255,0) 100%)',
            animation: 'fastShimmer 1.2s infinite ease-in-out',
            zIndex: 1,
          }}
        />
      )}

      {!error ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0.4,
            filter: loaded ? 'none' : 'blur(4px)',
            transition: 'opacity 0.25s ease-in, filter 0.25s ease-in',
            position: 'relative',
            zIndex: 2,
          }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '16px',
            textAlign: 'center',
            color: '#801318',
            background: '#FFF8F0',
          }}
        >
          <span style={{ fontSize: '28px', marginBottom: '4px' }}>🕉️</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#B45309' }}>{alt}</span>
        </div>
      )}
    </div>
  );
}
