import React, { useState } from 'react'
import { GradientPlaceholder, type VisualEntity } from './GradientPlaceholder'

export interface ResponsiveImageSources {
  avif?: string
  webp?: string
  fallback: string
}

export interface ResponsiveImageProps {
  sources: ResponsiveImageSources
  alt: string
  'aria-hidden'?: boolean
  /** true for the LCP image on a page — disables lazy loading and async decoding */
  priority?: boolean
  className?: string
  width?: number
  height?: number
  /**
   * CSS sizes attribute for responsive srcset, e.g. "(max-width: 768px) 100vw, 50vw"
   * Required when the image fills different proportions at different breakpoints.
   */
  sizes?: string
  onError?: () => void
  /** Entity-themed gradient shown if the image fails to load */
  fallbackEntity?: VisualEntity
}

export function ResponsiveImage({
  sources,
  alt,
  priority = false,
  className = '',
  width,
  height,
  sizes,
  onError,
  fallbackEntity,
  'aria-hidden': ariaHidden,
}: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    setFailed(true)
    onError?.()
  }

  if (failed && fallbackEntity) {
    return (
      <div className={`relative overflow-hidden ${className}`} aria-hidden={ariaHidden ?? true}>
        <GradientPlaceholder entity={fallbackEntity} />
      </div>
    )
  }

  return (
    <picture className={className} style={{ display: 'block' }}>
      {sources.avif && (
        <source srcSet={sources.avif} type="image/avif" />
      )}
      {sources.webp && (
        <source srcSet={sources.webp} type="image/webp" />
      )}
      <img
        src={sources.fallback}
        alt={alt}
        aria-hidden={ariaHidden}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        width={width}
        height={height}
        sizes={sizes}
        onError={handleError}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </picture>
  )
}
