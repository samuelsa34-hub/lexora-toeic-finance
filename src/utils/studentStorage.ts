import type { AppState } from '../store/useAppStore'

const PREFIX = 'toeic-warroom-student-'

const DATA_KEYS: (keyof AppState)[] = [
  'profile', 'grammarSessions', 'questionHistory', 'vocabRatings',
  'vocabSessions', 'readingSessions', 'errorNotebook', 'missions',
  'missionsDate', 'completedLessons', 'part6Sessions', 'completedAssignments',
  'activityLog', 'alertDismissals',
]

export type StudentSnapshot = Pick<AppState, typeof DATA_KEYS[number]>

export function saveStudentSnapshot(id: string, state: AppState): void {
  const snapshot: Partial<StudentSnapshot> = {}
  for (const key of DATA_KEYS) {
    (snapshot as Record<string, unknown>)[key] = state[key]
  }
  localStorage.setItem(PREFIX + id, JSON.stringify(snapshot))
}

export function loadStudentSnapshot(id: string): StudentSnapshot | null {
  const raw = localStorage.getItem(PREFIX + id)
  if (!raw) return null
  try { return JSON.parse(raw) as StudentSnapshot }
  catch { return null }
}

export function deleteStudentSnapshot(id: string): void {
  localStorage.removeItem(PREFIX + id)
}

// ── Lightweight presence heartbeat ────────────────────────────────────────────
// Written every 30 s by the student app (App.tsx) so the teacher can detect
// that a student tab is still open, even when no study events are firing.
// Kept separate from activityLog to avoid polluting the event history.
const PRESENCE_PREFIX = 'toeic-warroom-presence-'

export function writePresence(studentId: string): void {
  localStorage.setItem(PRESENCE_PREFIX + studentId, String(Date.now()))
}

export function readPresence(studentId: string): number | null {
  const raw = localStorage.getItem(PRESENCE_PREFIX + studentId)
  return raw ? Number(raw) : null
}

export function getAllStudentSnapshots(): Record<string, StudentSnapshot> {
  const result: Record<string, StudentSnapshot> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(PREFIX)) continue
    const id = key.slice(PREFIX.length)
    const raw = localStorage.getItem(key)
    if (!raw) continue
    try { result[id] = JSON.parse(raw) as StudentSnapshot }
    catch { /* skip corrupt entries */ }
  }
  return result
}
