import { useMemo } from 'react'

export interface DeviceCapabilities {
  /** Browser exposes a WebGL context (required for Tier C interactive 3D) */
  hasWebGL: boolean
  /** navigator.deviceMemory in GB; defaults to 4 when API is unavailable */
  deviceMemory: number
  /** Safe to load looping video (Tier B): deviceMemory >= 4 GB */
  canPlayTierB: boolean
  /** Safe to run interactive 3D (Tier C): WebGL support + deviceMemory >= 4 GB */
  canPlayTierC: boolean
}

// navigator.deviceMemory is a non-standard Chrome API — extend Navigator type locally
type NavigatorWithMemory = Navigator & { readonly deviceMemory?: number }

export function useDeviceCapabilities(): DeviceCapabilities {
  return useMemo<DeviceCapabilities>(() => {
    if (typeof window === 'undefined') {
      return { hasWebGL: false, deviceMemory: 4, canPlayTierB: true, canPlayTierC: false }
    }

    const hasWebGL = !!(
      window.WebGLRenderingContext &&
      (() => {
        try {
          const canvas = document.createElement('canvas')
          return canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        } catch {
          return false
        }
      })()
    )

    const deviceMemory = (navigator as NavigatorWithMemory).deviceMemory ?? 4

    return {
      hasWebGL,
      deviceMemory,
      canPlayTierB: deviceMemory >= 4,
      canPlayTierC: hasWebGL && deviceMemory >= 4,
    }
  }, [])
}
