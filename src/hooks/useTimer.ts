import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  const clear = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } }

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => { setIsRunning(false); clear(); }, [])
  const reset = useCallback((t?: number) => { setIsRunning(false); clear(); setTimeLeft(t ?? initialSeconds) }, [initialSeconds])
  const restart = useCallback((t?: number) => { clear(); setTimeLeft(t ?? initialSeconds); setIsRunning(true) }, [initialSeconds])

  useEffect(() => {
    if (!isRunning) { clear(); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clear(); setIsRunning(false); setTimeout(() => onExpireRef.current?.(), 0); return 0 }
        return prev - 1
      })
    }, 1000)
    return clear
  }, [isRunning])

  const pct = initialSeconds > 0 ? timeLeft / initialSeconds : 0
  const urgency: 'normal' | 'warning' | 'critical' =
    timeLeft <= initialSeconds * 0.2 ? 'critical' : timeLeft <= initialSeconds * 0.45 ? 'warning' : 'normal'

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${s}s`
  }

  return { timeLeft, isRunning, pct, urgency, formatted: formatTime(timeLeft), start, pause, reset, restart }
}
