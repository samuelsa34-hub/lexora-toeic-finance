// Cloud sync layer — Firebase Realtime Database + BroadcastChannel fallback.
//
// Two-tier sync:
//   Tier 1 — BroadcastChannel (always active): same browser, any tab, instant.
//   Tier 2 — Firebase Realtime Database (when configured): any device, global.
//
// Firebase data structure:
//   /classes/{classCode}/students/{studentId}/
//     profile:        { name, avatar, color, email, photoUrl, targetScore, updatedAt }
//     presence:       { ts: number, online: boolean }
//     recentActivity: ActivityEvent[]  (last 50)
//     stats:          { score, accuracy, sessions, errors, xp, streak, ... }

import { ref, set, update, onValue } from 'firebase/database'
import { db, FIREBASE_ENABLED } from '../config/firebase'
import type { ActivityEvent } from '../types'
import type { AppState } from '../store/useAppStore'

// ── Debug logging ─────────────────────────────────────────────────────────────
const LOG = (...args: unknown[]) => console.log('[Firebase]', ...args)
const WARN = (...args: unknown[]) => console.warn('[Firebase]', ...args)

// Log activation state once on module load so it's visible in DevTools on startup
if (FIREBASE_ENABLED) {
  LOG('✅ ENABLED — shared backend is active. All reads/writes go to Firebase Realtime Database.')
} else {
  WARN('🚫 DISABLED — no .env.local found or VITE_FIREBASE_DATABASE_URL is missing.',
       'Running in local-only mode. Cross-device monitoring will NOT work.',
       'Create .env.local from .env.local.template and restart the dev server.')
}

// ── Firebase live connection state ────────────────────────────────────────────
// Firebase SDK exposes /.info/connected — a boolean that goes true/false as
// the WebSocket to Google's servers connects or disconnects.
// This is the only reliable way to know if the app is actually talking to Firebase.

export type FirebaseConnState = 'unconfigured' | 'connecting' | 'connected' | 'disconnected'

let _connState: FirebaseConnState = FIREBASE_ENABLED ? 'connecting' : 'unconfigured'
const _listeners = new Set<(s: FirebaseConnState) => void>()

function emitConn(s: FirebaseConnState) {
  if (s !== _connState) {
    _connState = s
    LOG(`connection → ${s}`)
    _listeners.forEach(fn => fn(s))
  }
}

// Subscribe to Firebase's built-in .info/connected ref
if (FIREBASE_ENABLED && db) {
  onValue(ref(db, '.info/connected'), snap => {
    emitConn(snap.val() === true ? 'connected' : 'disconnected')
  }, () => emitConn('disconnected'))
}

/** Returns current Firebase connection state synchronously. */
export function getFirebaseConnState(): FirebaseConnState { return _connState }

/** Subscribes to Firebase connection state changes. Returns unsubscribe fn. */
export function onFirebaseConnState(fn: (s: FirebaseConnState) => void): () => void {
  _listeners.add(fn)
  fn(_connState) // immediate call with current value
  return () => _listeners.delete(fn)
}

// ── BroadcastChannel (Tier 1 — same-browser, any tab) ─────────────────────────
// Works without any server or Firebase config. The teacher tab subscribes to
// a named channel; student tabs post to it when they join or update.

export interface LocalBroadcastMessage {
  type: 'student_joined' | 'student_updated' | 'presence'
  classCode: string
  studentId: string
  profile: { name: string; avatar: string; color: string; email?: string; photoUrl?: string; targetScore: number }
  stats?: Partial<CloudStats>
  presence?: { ts: number; online: boolean }
  recentActivity?: ActivityEvent[]
}

function getChannel(classCode: string): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  try { return new BroadcastChannel(`toeic-class-${classCode}`) }
  catch { return null }
}

// Called by student: broadcasts join/update event to any teacher tab watching this class code.
export function localBroadcastStudent(
  classCode: string,
  msg: Omit<LocalBroadcastMessage, 'type' | 'classCode'>,
): void {
  const ch = getChannel(classCode)
  if (!ch) return
  const payload: LocalBroadcastMessage = { type: 'student_joined', classCode, ...msg }
  ch.postMessage(payload)
  ch.close()
}

// Called by teacher tab: subscribes to student join/update events for a class code.
// Returns a cleanup function.
export function subscribeToLocalClass(
  classCode: string,
  onMessage: (msg: LocalBroadcastMessage) => void,
): () => void {
  const ch = getChannel(classCode)
  if (!ch) return () => {}
  ch.onmessage = (e: MessageEvent<LocalBroadcastMessage>) => {
    if (e.data?.classCode === classCode) onMessage(e.data)
  }
  return () => ch.close()
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface CloudProfile {
  name: string
  avatar: string
  color: string
  email: string
  photoUrl: string
  targetScore: number
  updatedAt: number
}

export interface CloudPresence {
  ts: number
  online: boolean
}

export interface CloudStats {
  score: number | null
  accuracy: number | null
  sessions: number
  errors: number
  xp: number
  streak: number
  completedLessons: number
  part6Acc: number | null
  weakCats: string[]
  trend: 'up' | 'down' | 'flat'
}

export interface CloudStudentData {
  profile?: Partial<CloudProfile>
  presence?: CloudPresence
  recentActivity?: ActivityEvent[]
  stats?: Partial<CloudStats>
}

export type CloudClassData = Record<string, CloudStudentData>

// ── Helpers ───────────────────────────────────────────────────────────────────

function studentPath(classCode: string, studentId: string): string {
  // Firebase keys cannot contain . # $ [ ] /
  // Class codes are CLASS-XXXXXX (safe). Student IDs use _ and alphanumeric (safe).
  return `classes/${classCode}/students/${studentId}`
}

function computeStats(state: AppState): CloudStats {
  const sessions = state.grammarSessions ?? []
  const recent = sessions.slice(-10)
  const avgAcc = recent.length > 0
    ? recent.reduce((s, sess) => s + sess.correct / sess.count, 0) / recent.length
    : null
  const score = avgAcc !== null
    ? Math.min(990, 150 + Math.round(avgAcc * 345) + Math.round((state.profile?.targetScore ?? 900) / 4))
    : null

  let trend: 'up' | 'down' | 'flat' = 'flat'
  if (sessions.length >= 6) {
    const prev = sessions.slice(-6, -3).reduce((s, x) => s + x.correct / x.count, 0) / 3
    const cur = sessions.slice(-3).reduce((s, x) => s + x.correct / x.count, 0) / 3
    trend = cur > prev + 0.05 ? 'up' : cur < prev - 0.05 ? 'down' : 'flat'
  }

  const catAcc: Record<string, { c: number; t: number }> = {}
  for (const sess of sessions)
    for (const a of sess.attempts ?? []) {
      if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
      catAcc[a.cat].t++; if (a.correct) catAcc[a.cat].c++
    }
  const weakCats = Object.entries(catAcc)
    .filter(([, v]) => v.t >= 3 && v.c / v.t < 0.7)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
    .slice(0, 3).map(([k]) => k)

  const p6 = state.part6Sessions ?? []
  const part6Acc = p6.length > 0
    ? Math.round(p6.reduce((s, sess) => s + sess.correct / sess.total, 0) / p6.length * 100)
    : null

  return {
    score,
    accuracy: avgAcc !== null ? Math.round(avgAcc * 100) : null,
    sessions: sessions.length,
    errors: (state.errorNotebook ?? []).filter(e => !e.resolved).length,
    xp: state.profile?.xp ?? 0,
    streak: state.profile?.streak ?? 0,
    completedLessons: (state.completedLessons ?? []).length,
    part6Acc,
    weakCats,
    trend,
  }
}

// ── Student writes ────────────────────────────────────────────────────────────

// Called on login: writes full student data so teacher sees them immediately.
export async function cloudWriteLogin(
  classCode: string,
  studentId: string,
  profile: Omit<CloudProfile, 'updatedAt'>,
  appState: AppState,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) {
    WARN('cloudWriteLogin called but Firebase is disabled — write skipped. Student will NOT appear on teacher dashboard across devices.')
    return
  }
  LOG(`cloudWriteLogin → classes/${classCode}/students/${studentId}`, { name: profile.name })
  try {
    await set(ref(db, studentPath(classCode, studentId)), {
      profile: { ...profile, updatedAt: Date.now() },
      presence: { ts: Date.now(), online: true },
      stats: computeStats(appState),
      recentActivity: (appState.activityLog ?? []).slice(-50),
    })
    LOG(`cloudWriteLogin ✅ — student "${profile.name}" is now visible to teacher globally`)
  } catch (e) {
    console.error('[Firebase] cloudWriteLogin FAILED. Check: (1) Firebase rules allow write, (2) databaseURL is correct, (3) network access.', e)
    throw e
  }
}

// Called every 30 s: keeps presence.ts fresh so teacher sees idle students as online.
export async function cloudWritePresence(
  classCode: string,
  studentId: string,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  LOG(`cloudWritePresence → ${studentId} online=true`)
  try {
    await update(ref(db, `${studentPath(classCode, studentId)}/presence`), {
      ts: Date.now(),
      online: true,
    })
  } catch (e) {
    console.error('[Firebase] cloudWritePresence failed:', e)
  }
}

// Called on beforeunload: marks student offline immediately.
export function cloudWriteOffline(
  classCode: string,
  studentId: string,
): void {
  if (!FIREBASE_ENABLED || !db) return
  // Use sendBeacon-style fire-and-forget via set (sync is unreliable on unload)
  try {
    update(ref(db, `${studentPath(classCode, studentId)}/presence`), {
      ts: Date.now(),
      online: false,
    })
  } catch { /* non-fatal */ }
}

// Called on debounced state change: syncs stats + recent activity.
export async function cloudWriteSnapshot(
  classCode: string,
  studentId: string,
  appState: AppState,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  try {
    await update(ref(db, studentPath(classCode, studentId)), {
      stats: computeStats(appState),
      recentActivity: (appState.activityLog ?? []).slice(-50),
    })
  } catch (e) {
    console.error('[cloudSync] cloudWriteSnapshot failed:', e)
  }
}

// ── Teacher reads ─────────────────────────────────────────────────────────────

// Subscribes to all students in a class. Returns an unsubscribe function.
// onData is called immediately with current data, then on every change.
export function subscribeToClass(
  classCode: string,
  onData: (data: CloudClassData) => void,
): () => void {
  if (!FIREBASE_ENABLED || !db) {
    WARN('subscribeToClass called but Firebase is disabled — teacher will only see local students.')
    return () => {}
  }
  LOG(`subscribeToClass → listening on classes/${classCode}/students`)
  const classRef = ref(db, `classes/${classCode}/students`)
  const unsubscribe = onValue(classRef, snap => {
    const data = (snap.val() ?? {}) as CloudClassData
    const count = Object.keys(data).length
    LOG(`subscribeToClass update — ${count} student(s) in Firebase for class ${classCode}`)
    onData(data)
  }, (e) => {
    console.error('[Firebase] subscribeToClass FAILED. Check: (1) rules allow read on classes/{classCode}/students, (2) database URL is correct.', e)
  })
  return unsubscribe
}
