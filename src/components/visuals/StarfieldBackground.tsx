import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'

export interface StarfieldBackgroundProps {
  variant?: 'full' | 'subtle'
  className?: string
  fallbackImage?: string
}

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  layer: 1 | 2 | 3
  twinklePhase: number
  twinkleSpeed: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

const STAR_COLORS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#E0E7FF', '#E0E7FF', '#FEF3C7']
const SHOOTING_COLORS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#A5F3FC', '#C4B5FD']

function getStarCount(width: number, variant: 'full' | 'subtle', lowCores: boolean): number {
  const cap = lowCores ? 0.5 : 1
  if (width < 768) return Math.floor((variant === 'subtle' ? 200 : 400) * cap)
  if (width < 1024) return Math.floor((variant === 'subtle' ? 300 : 600) * cap)
  return Math.floor((variant === 'subtle' ? 400 : 800) * cap)
}

export function StarfieldBackground({
  variant = 'full',
  className = '',
  fallbackImage,
}: StarfieldBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()
  const { canPlayTierB } = useDeviceCapabilities()
  const [canvasFailed, setCanvasFailed] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animRef = useRef<number | null>(null)

  // Low-concurrency → reduced stars but still animate
  const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4

  // deviceMemory < 4 GB → static fallback (canPlayTierB is false when memory < 4)
  const showCanvas = !prefersReducedMotion && canPlayTierB && !canvasFailed

  useEffect(() => {
    if (!showCanvas) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      setCanvasFailed(true)
      return
    }

    let stars: Star[] = []
    let shootingStars: ShootingStar[] = []
    let lastShootingAt = 0
    let nextShootingDelay = 6000 + Math.random() * 4000
    let nebulaPhase = 0
    let isPaused = false
    let isInView = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function initStars(width: number, height: number) {
      const count = getStarCount(width, variant, lowCores)
      stars = []
      for (let i = 0; i < count; i++) {
        const roll = Math.random()
        const layer: 1 | 2 | 3 = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3
        const radius =
          layer === 1 ? 0.5 + Math.random() * 0.5
          : layer === 2 ? 0.8 + Math.random() * 0.7
          : 1.0 + Math.random() * 1.0
        const baseOpacity =
          layer === 1 ? 0.3 + Math.random() * 0.3
          : layer === 2 ? 0.5 + Math.random() * 0.3
          : 0.7 + Math.random() * 0.3
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseOpacity,
          layer,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.0005 + Math.random() * 0.001,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        })
      }
    }

    function spawnShootingStar(width: number, height: number) {
      const startX = Math.random() * width * 0.5
      const startY = Math.random() * height * 0.4
      const angle = -(0.5 + Math.random() * 0.35)
      const speed = 12
      const flip = Math.random() < 0.5 ? 1 : -1
      shootingStars.push({
        x: flip === -1 ? width - startX : startX,
        y: startY,
        vx: Math.cos(angle) * speed * flip,
        vy: Math.abs(Math.sin(angle)) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 30,
        color: SHOOTING_COLORS[Math.floor(Math.random() * SHOOTING_COLORS.length)],
      })
    }

    function resize() {
      // canvas/container/ctx are non-null: checked above before this closure is defined
      const rect = container!.getBoundingClientRect()
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      canvas!.style.width = `${rect.width}px`
      canvas!.style.height = `${rect.height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      initStars(rect.width, rect.height)
    }

    function draw(timestamp: number) {
      if (!ctx) return

      if (isPaused || !isInView) {
        animRef.current = requestAnimationFrame(draw)
        return
      }

      const width = canvas!.width / dpr
      const height = canvas!.height / dpr

      ctx.clearRect(0, 0, width, height)

      // Nebula — two barely-visible drifting radial gradients (full variant only)
      if (variant === 'full') {
        nebulaPhase += 0.0003
        const nX1 = width * (0.3 + 0.1 * Math.sin(nebulaPhase))
        const nY1 = height * (0.4 + 0.1 * Math.cos(nebulaPhase * 0.7))
        const g1 = ctx.createRadialGradient(nX1, nY1, 0, nX1, nY1, width * 0.5)
        g1.addColorStop(0, 'rgba(99,102,241,0.04)')
        g1.addColorStop(1, 'rgba(99,102,241,0)')
        ctx.fillStyle = g1
        ctx.fillRect(0, 0, width, height)

        const nX2 = width * (0.7 + 0.1 * Math.cos(nebulaPhase * 0.9))
        const nY2 = height * (0.6 + 0.1 * Math.sin(nebulaPhase * 0.6))
        const g2 = ctx.createRadialGradient(nX2, nY2, 0, nX2, nY2, width * 0.5)
        g2.addColorStop(0, 'rgba(139,92,246,0.03)')
        g2.addColorStop(1, 'rgba(139,92,246,0)')
        ctx.fillStyle = g2
        ctx.fillRect(0, 0, width, height)
      }

      // Stars
      for (const star of stars) {
        const twinkle = Math.sin(star.twinklePhase + timestamp * star.twinkleSpeed) * 0.2 + 0.8
        ctx.globalAlpha = star.baseOpacity * twinkle

        if (star.layer === 2) { star.x += 0.02; if (star.x > width + 5) star.x = -5 }
        if (star.layer === 3) { star.x += 0.05; if (star.x > width + 5) star.x = -5 }

        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Shooting stars — full variant, ≥ 768px only
      if (variant === 'full' && width >= 768) {
        if (timestamp - lastShootingAt > nextShootingDelay) {
          spawnShootingStar(width, height)
          lastShootingAt = timestamp
          nextShootingDelay = 6000 + Math.random() * 4000
        }

        shootingStars = shootingStars.filter(s => {
          s.life++
          s.x += s.vx
          s.y += s.vy
          if (s.life > s.maxLife) return false

          const lifeRatio = s.life / s.maxLife
          const alpha =
            lifeRatio < 0.2 ? lifeRatio * 5
            : lifeRatio > 0.7 ? (1 - lifeRatio) * 3.33
            : 1

          const mag = Math.hypot(s.vx, s.vy)
          const trailLen = 80
          const tx = s.x - (s.vx / mag) * trailLen
          const ty = s.y - (s.vy / mag) * trailLen

          const grad = ctx.createLinearGradient(s.x, s.y, tx, ty)
          grad.addColorStop(0, s.color)
          grad.addColorStop(1, 'rgba(255,255,255,0)')

          ctx.globalAlpha = alpha
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()

          ctx.fillStyle = s.color
          ctx.beginPath()
          ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2)
          ctx.fill()

          return true
        })
        ctx.globalAlpha = 1
      }

      animRef.current = requestAnimationFrame(draw)
    }

    const handleVisibility = () => { isPaused = document.visibilityState !== 'visible' }
    document.addEventListener('visibilitychange', handleVisibility)

    const io = new IntersectionObserver(([entry]) => { isInView = entry.isIntersecting }, { threshold: 0 })
    io.observe(container)

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    animRef.current = requestAnimationFrame(draw)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
      io.disconnect()
      ro.disconnect()
    }
  }, [showCanvas, variant, lowCores])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0A1F 100%)' }}
    >
      {showCanvas ? (
        <canvas ref={canvasRef} className="block w-full h-full" />
      ) : fallbackImage ? (
        <img
          src={fallbackImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      ) : null}
    </div>
  )
}
