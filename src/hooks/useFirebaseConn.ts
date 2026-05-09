import { useState, useEffect } from 'react'
import { onFirebaseConnState, getFirebaseConnState, type FirebaseConnState } from '../utils/cloudSync'

/**
 * Reactively tracks Firebase WebSocket connection state.
 *
 * 'unconfigured' — .env.local missing or VITE_FIREBASE_DATABASE_URL not set
 * 'connecting'   — Firebase enabled, WebSocket handshake in progress
 * 'connected'    — live WebSocket to Google servers; all reads/writes are real-time
 * 'disconnected' — had a connection but lost it (network drop, etc.)
 */
export function useFirebaseConn(): FirebaseConnState {
  const [state, setState] = useState<FirebaseConnState>(getFirebaseConnState)
  useEffect(() => onFirebaseConnState(setState), [])
  return state
}
