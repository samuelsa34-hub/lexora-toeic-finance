import React from 'react'
import { ResponsiveImage, type ResponsiveImageProps } from './ResponsiveImage'

export interface ModelViewer3DProps {
  /** glTF/GLB model URL — used in Phase 6 when <model-viewer> ships */
  modelSrc?: string
  /** Static image shown until Phase 6 interactive 3D is implemented */
  fallbackImage: ResponsiveImageProps
  alt?: string
  className?: string
}

/**
 * Phase 6 stub — returns the fallback image immediately.
 * Replace body with <model-viewer> element once Phase 6 is approved.
 */
export function ModelViewer3D({ fallbackImage, className }: ModelViewer3DProps) {
  return <ResponsiveImage {...fallbackImage} className={className} />
}
