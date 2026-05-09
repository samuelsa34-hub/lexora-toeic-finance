import { useState, useCallback, useRef } from 'react'
import { GOOGLE_CLIENT_ID, GOOGLE_CALENDAR_SCOPE } from '../config/google'

export interface CalendarEvent {
  id: string
  summary: string
  start: { dateTime: string }
  end: { dateTime: string }
  description?: string
  htmlLink?: string
}

interface UseGoogleCalendarReturn {
  connected: boolean
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  connect: () => void
  createEvent: (params: { title: string; start: Date; durationMinutes: number; description?: string }) => Promise<CalendarEvent | null>
  fetchUpcoming: () => Promise<void>
}

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tokenRef = useRef<string | null>(null)
  const clientRef = useRef<{ requestAccessToken: (c?: object) => void } | null>(null)

  const ensureClient = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || !window.google) return null
    if (clientRef.current) return clientRef.current
    clientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_CALENDAR_SCOPE,
      callback: async (tokenResponse: { access_token?: string; error?: string }) => {
        if (tokenResponse.error || !tokenResponse.access_token) {
          setError(tokenResponse.error ?? 'Authorization failed')
          return
        }
        tokenRef.current = tokenResponse.access_token
        setConnected(true)
        setError(null)
        await fetchEvents(tokenResponse.access_token)
      },
    })
    return clientRef.current
  }, [])

  const connect = useCallback(() => {
    const client = ensureClient()
    if (!client) { setError('Google not available — set VITE_GOOGLE_CLIENT_ID'); return }
    client.requestAccessToken()
  }, [ensureClient])

  const fetchEvents = useCallback(async (token?: string) => {
    const t = token ?? tokenRef.current
    if (!t) return
    setLoading(true)
    try {
      const now = new Date().toISOString()
      const end = new Date(Date.now() + 30 * 86400000).toISOString()
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&timeMax=${encodeURIComponent(end)}&q=TOEIC&singleEvents=true&orderBy=startTime&maxResults=20`,
        { headers: { Authorization: `Bearer ${t}` } }
      )
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = await res.json()
      setEvents(data.items ?? [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async ({ title, start, durationMinutes, description }: {
    title: string; start: Date; durationMinutes: number; description?: string
  }): Promise<CalendarEvent | null> => {
    if (!tokenRef.current) { setError('Not connected'); return null }
    const end = new Date(start.getTime() + durationMinutes * 60000)
    const body = {
      summary: title,
      description: description ?? '',
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }] },
    }
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenRef.current}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create event')
      const event = await res.json() as CalendarEvent
      setEvents(prev => [...prev, event].sort((a, b) =>
        new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
      ))
      return event
    } catch (e) {
      setError((e as Error).message)
      return null
    }
  }, [])

  return { connected, events, loading, error, connect, createEvent, fetchUpcoming: () => fetchEvents() }
}
