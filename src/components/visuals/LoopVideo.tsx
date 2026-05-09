import React, { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { ResponsiveImage, type ResponsiveImageProps } from './ResponsiveImage'

export interface LoopVideoSources {
  webm?: string
  mp4?: string
}

export interface LoopVideoProps {
  videoSources: LoopVideoSources
  /** Static poster image shown before video loads — also becomes the LCP candidate */
  poster: string
  /** Shown on mobile, reduced-motion, or when Tier B is not available */
  fallbackImage: ResponsiveImageProps
  /** Force image fallback regardless of device capability */
  reduceMotion?: boolean
  /** Window width below which image is shown instead of video (default: 768) */
  mobileBreakpoint?: number
  className?: string
}

export function LoopVideo({
  videoSources,
  poster,
  fallbackImage,
  reduceMotion = false,
  mobileBreakpoint = 768,
  className = '',
}: LoopVideoProps) {
  const prefersReducedMotion = useReducedMotion()
  const { canPlayTierB } = useDeviceCapabilities()
  const [windowWidth, setWindowWidth] = useState<number>(
    () => (typeof window !== 'undefined' ? window.innerWidth : 1280)
  )
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Pause video when reduced-motion preference changes at runtime
  useEffect(() => {
    if (!videoRef.current) return
    if (prefersReducedMotion || reduceMotion) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {/* autoplay blocked — static poster shows */})
    }
  }, [prefersReducedMotion, reduceMotion])

  const shouldShowVideo =
    !prefersReducedMotion &&
    !reduceMotion &&
    canPlayTierB &&
    windowWidth >= mobileBreakpoint &&
    !videoFailed

  if (!shouldShowVideo) {
    return <ResponsiveImage {...fallbackImage} className={className} />
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onError={() => setVideoFailed(true)}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    >
      {videoSources.webm && <source src={videoSources.webm} type="video/webm" />}
      {videoSources.mp4 && <source src={videoSources.mp4} type="video/mp4" />}
    </video>
  )
}
