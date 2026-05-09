// User profile + progress sync for authenticated Firebase users.
// Data structure in Realtime Database:
//   /users/{uid}/profile  → UserProfile (role, name, email, …)
//   /users/{uid}/snapshot → StudentSnapshot (progress data, mirrors localStorage)

import { ref, set, get, update } from 'firebase/database'
import { db, FIREBASE_ENABLED } from '../config/firebase'
import type { AppState } from '../store/useAppStore'

export type AuthRole = 'student' | 'teacher' | 'admin'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: AuthRole
  createdAt: number
  lastLoginAt: number
  provider: string
  // student-only
  joinedClassCode?: string
  // teacher-only
  teacherClassCode?: string
}

// ── Profile helpers ────────────────────────────────────────────────────────────

/** Read a user profile. Returns null if it doesn't exist yet (new user). */
export async function readUserProfile(uid: string): Promise<UserProfile | null> {
  if (!FIREBASE_ENABLED || !db) return null
  try {
    const snap = await get(ref(db, `users/${uid}/profile`))
    return snap.exists() ? (snap.val() as UserProfile) : null
  } catch { return null }
}

/** Create a brand-new user profile (first sign-in). */
export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, 'createdAt' | 'lastLoginAt'>,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  await set(ref(db, `users/${uid}/profile`), {
    ...data,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  })
}

/** Update only the changed fields of a user profile. */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  await update(ref(db, `users/${uid}/profile`), { ...updates, lastLoginAt: Date.now() })
}

// ── Progress helpers ───────────────────────────────────────────────────────────

const PROGRESS_KEYS: (keyof AppState)[] = [
  'profile', 'grammarSessions', 'questionHistory', 'vocabRatings',
  'vocabSessions', 'readingSessions', 'errorNotebook', 'missions',
  'missionsDate', 'completedLessons', 'part6Sessions', 'completedAssignments',
  'activityLog', 'alertDismissals', 'savedWords', 'vocabLists', 'wordFlashcards',
  'recentDictSearches',
]

/** Write student progress to Firebase. Called on debounced state change. */
export async function writeUserProgress(uid: string, appState: AppState): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  const snapshot: Record<string, unknown> = { syncedAt: Date.now() }
  for (const key of PROGRESS_KEYS) {
    snapshot[key] = appState[key as keyof AppState]
  }
  try {
    await update(ref(db, `users/${uid}/snapshot`), snapshot)
  } catch { /* non-fatal — localStorage is the fallback */ }
}

/** Read student progress from Firebase. Used on sign-in to restore cross-device state. */
export async function readUserProgress(uid: string): Promise<Record<string, unknown> | null> {
  if (!FIREBASE_ENABLED || !db) return null
  try {
    const snap = await get(ref(db, `users/${uid}/snapshot`))
    return snap.exists() ? (snap.val() as Record<string, unknown>) : null
  } catch { return null }
}
