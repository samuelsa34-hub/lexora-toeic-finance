// Admin-only Firebase RTDB helpers.
// All writes are protected by RTDB security rules that require role === 'admin'.

import { ref, get, update, onValue, push, serverTimestamp, type Unsubscribe } from 'firebase/database'
import { db, FIREBASE_ENABLED } from '../config/firebase'
import type { AuthRole } from './userSync'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AdminUserRecord {
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: AuthRole
  createdAt: number
  lastLoginAt: number
  provider: string
  joinedClassCode?: string
  teacherClassCode?: string
}

export interface AdminClassRecord {
  code: string
  teacherUid?: string
  teacherName?: string
  studentCount: number
  students: Record<string, { name: string; lastSeen: number; online?: boolean }>
}

export interface AuditLogEntry {
  id: string
  ts: number
  adminUid: string
  adminEmail: string
  action: string
  targetUid?: string
  targetEmail?: string
  detail?: string
}

// ── Users ──────────────────────────────────────────────────────────────────────

/** One-shot read of all users (for Overview stats). */
export async function fetchAllUsers(): Promise<AdminUserRecord[]> {
  if (!FIREBASE_ENABLED || !db) return []
  try {
    const snap = await get(ref(db, 'users'))
    if (!snap.exists()) return []
    const result: AdminUserRecord[] = []
    snap.forEach(child => {
      const profile = child.val()?.profile
      if (profile) result.push({ uid: child.key as string, ...profile })
    })
    return result
  } catch { return [] }
}

/** Real-time subscription to all users. Returns unsubscribe fn. */
export function subscribeToAllUsers(
  cb: (users: AdminUserRecord[]) => void,
): Unsubscribe {
  if (!FIREBASE_ENABLED || !db) return () => {}
  return onValue(ref(db, 'users'), snap => {
    const result: AdminUserRecord[] = []
    snap.forEach(child => {
      const profile = child.val()?.profile
      if (profile) result.push({ uid: child.key as string, ...profile })
    })
    cb(result)
  })
}

/** Change a user's role. Writes to /users/{uid}/profile/role. */
export async function changeUserRole(
  uid: string,
  newRole: AuthRole,
): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  await update(ref(db, `users/${uid}/profile`), { role: newRole })
}

// ── Classes ────────────────────────────────────────────────────────────────────

/** Real-time subscription to all classes. Returns unsubscribe fn. */
export function subscribeToAllClasses(
  cb: (classes: AdminClassRecord[]) => void,
): Unsubscribe {
  if (!FIREBASE_ENABLED || !db) return () => {}
  return onValue(ref(db, 'classes'), snap => {
    const result: AdminClassRecord[] = []
    snap.forEach(child => {
      const data = child.val() ?? {}
      const students = data.students ?? {}
      result.push({
        code: child.key as string,
        teacherUid: data.teacherUid,
        teacherName: data.teacherName,
        studentCount: Object.keys(students).length,
        students,
      })
    })
    cb(result)
  })
}

// ── Audit log ──────────────────────────────────────────────────────────────────

/** Write an audit log entry to /adminLogs. */
export async function writeAuditLog(entry: Omit<AuditLogEntry, 'id' | 'ts'>): Promise<void> {
  if (!FIREBASE_ENABLED || !db) return
  try {
    await push(ref(db, 'adminLogs'), {
      ...entry,
      ts: serverTimestamp(),
    })
  } catch { /* non-fatal */ }
}

/** Real-time subscription to audit logs (most-recent 200). Returns unsubscribe fn. */
export function subscribeToAuditLogs(
  cb: (logs: AuditLogEntry[]) => void,
): Unsubscribe {
  if (!FIREBASE_ENABLED || !db) return () => {}
  return onValue(ref(db, 'adminLogs'), snap => {
    const result: AuditLogEntry[] = []
    snap.forEach(child => {
      result.push({ id: child.key as string, ...child.val() })
    })
    cb(result.reverse().slice(0, 200))
  })
}
