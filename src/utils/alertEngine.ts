import type { AppState } from '../store/useAppStore'
import type { PlatformAlert } from '../types'
import type { StudentMeta } from '../types'
import { CAT_LABELS } from './constants'

let _c = 0
function aid() { return `alert_${++_c}` }

// ── Student alerts (from their own store) ────────────────────────────────────
export function generateStudentAlerts(store: AppState): PlatformAlert[] {
  const alerts: PlatformAlert[] = []
  const { grammarSessions, errorNotebook, profile, part6Sessions, completedAssignments } = store

  // Exam countdown
  if (profile.examDate) {
    const days = Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86_400_000)
    if (days <= 3 && days > 0) {
      alerts.push({ id: aid(), severity: 'critical', title: `Exam in ${days} day${days === 1 ? '' : 's'}!`, message: 'Review your top mistakes and do a final light mock.', action: { label: 'Review Mistakes', path: '/errors' } })
    } else if (days <= 7 && days > 3) {
      alerts.push({ id: aid(), severity: 'warning', title: `${days} days to exam`, message: 'Prioritize weak topics and reduce new material.', action: { label: 'Priority Center', path: '/priority' } })
    }
  }

  // Inactivity
  const allTs = [...grammarSessions, ...part6Sessions].map(s => s.timestamp)
  if (allTs.length > 0) {
    const daysSince = Math.floor((Date.now() - Math.max(...allTs)) / 86_400_000)
    if (daysSince >= 5) {
      alerts.push({ id: aid(), severity: 'critical', title: `${daysSince}-day study gap`, message: 'You need to restart today. Even 15 minutes matters.', action: { label: 'Start Now', path: '/grammar' } })
    } else if (daysSince >= 3) {
      alerts.push({ id: aid(), severity: 'warning', title: 'Study gap detected', message: `You haven't practiced in ${daysSince} days.`, action: { label: 'Resume', path: '/grammar' } })
    }
  }

  // Repeated category errors
  const catErrors: Record<string, number> = {}
  for (const e of errorNotebook.filter(e => !e.resolved)) {
    catErrors[e.category] = (catErrors[e.category] ?? 0) + e.occurrences
  }
  const topErrors = Object.entries(catErrors).sort((a, b) => b[1] - a[1]).slice(0, 2)
  for (const [cat, count] of topErrors) {
    if (count >= 4) {
      alerts.push({ id: aid(), severity: 'warning', title: `Repeat pattern: ${CAT_LABELS[cat] ?? cat}`, message: `You've missed this type ${count} times. Time for a targeted drill.`, action: { label: 'Drill Now', path: '/grammar' }, category: cat })
    }
  }

  // Accuracy drop
  if (grammarSessions.length >= 8) {
    const catAcc: Record<string, { older: number[]; newer: number[] }> = {}
    const older = grammarSessions.slice(-8, -4)
    const newer = grammarSessions.slice(-4)
    for (const sess of [...older, ...newer]) {
      for (const a of sess.attempts ?? []) {
        if (!catAcc[a.cat]) catAcc[a.cat] = { older: [], newer: [] }
        const isNewer = newer.includes(sess)
        catAcc[a.cat][isNewer ? 'newer' : 'older'].push(a.correct ? 1 : 0)
      }
    }
    for (const [cat, { older: o, newer: n }] of Object.entries(catAcc)) {
      if (o.length < 3 || n.length < 3) continue
      const avgO = o.reduce((s, x) => s + x, 0) / o.length
      const avgN = n.reduce((s, x) => s + x, 0) / n.length
      if (avgN < avgO - 0.15) {
        alerts.push({ id: aid(), severity: 'warning', title: `Declining: ${CAT_LABELS[cat] ?? cat}`, message: `Accuracy dropped ${Math.round((avgO - avgN) * 100)}% recently in this area.`, action: { label: 'Review', path: '/grammar' }, category: cat })
        break // one at a time
      }
    }
  }

  // Part 6 low accuracy
  if (part6Sessions.length >= 3) {
    const avg = part6Sessions.slice(-5).reduce((s, x) => s + x.correct / x.total, 0) / Math.min(5, part6Sessions.length)
    if (avg < 0.5) {
      alerts.push({ id: aid(), severity: 'warning', title: 'Part 6 needs work', message: `Only ${Math.round(avg * 100)}% average on text completion.`, action: { label: 'Practice Part 6', path: '/part6' } })
    }
  }

  return alerts
}

// ── Teacher alerts: per student ──────────────────────────────────────────────
export function generateTeacherStudentAlerts(
  snap: Partial<AppState> | null,
  student: StudentMeta
): PlatformAlert[] {
  if (!snap) return []
  const alerts: PlatformAlert[] = []
  const sessions = snap.grammarSessions ?? []
  const errors = snap.errorNotebook ?? []
  const lastTs = [...sessions, ...(snap.part6Sessions ?? [])].map(s => s.timestamp)
  if (lastTs.length > 0) {
    const days = Math.floor((Date.now() - Math.max(...lastTs)) / 86_400_000)
    if (days >= 7) alerts.push({ id: aid(), severity: 'critical', title: `${student.name} inactive ${days}d`, message: 'May need direct intervention.', action: { label: 'View Student', path: '' } })
    else if (days >= 4) alerts.push({ id: aid(), severity: 'warning', title: `${student.name} not active recently`, message: `Last session ${days} days ago.` })
  }
  const unresolved = errors.filter(e => !e.resolved).length
  if (unresolved >= 10) {
    alerts.push({ id: aid(), severity: 'warning', title: `${student.name}: ${unresolved} unresolved errors`, message: 'Student is accumulating mistakes without resolution.' })
  }
  return alerts
}

// ── Teacher: class-wide weakness patterns ───────────────────────────────────
export function generateClassAlerts(
  allSnaps: Record<string, Partial<AppState>>,
  students: StudentMeta[]
): PlatformAlert[] {
  const alerts: PlatformAlert[] = []
  const catWeakCount: Record<string, number> = {}
  for (const snap of Object.values(allSnaps)) {
    const catAcc: Record<string, { c: number; t: number }> = {}
    for (const sess of snap.grammarSessions ?? []) {
      for (const a of sess.attempts ?? []) {
        if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
        catAcc[a.cat].t++; if (a.correct) catAcc[a.cat].c++
      }
    }
    for (const [cat, { c, t }] of Object.entries(catAcc)) {
      if (t >= 3 && c / t < 0.65) catWeakCount[cat] = (catWeakCount[cat] ?? 0) + 1
    }
  }
  for (const [cat, count] of Object.entries(catWeakCount).sort((a, b) => b[1] - a[1])) {
    if (count >= 2) {
      alerts.push({ id: aid(), severity: count >= 3 ? 'warning' : 'info', title: `Class weakness: ${CAT_LABELS[cat] ?? cat}`, message: `${count} student${count > 1 ? 's' : ''} struggling in this category — consider a group review session.`, category: cat })
    }
  }
  const inactiveCount = students.filter(s => {
    const snap = allSnaps[s.id]
    if (!snap) return true
    const ts = [...(snap.grammarSessions ?? []), ...(snap.part6Sessions ?? [])].map(x => x.timestamp)
    if (!ts.length) return true
    return Date.now() - Math.max(...ts) > 4 * 86_400_000
  }).length
  if (inactiveCount >= 2) {
    alerts.push({ id: aid(), severity: 'warning', title: `${inactiveCount} students inactive 4+ days`, message: 'May need a motivational nudge or assignment to re-engage.' })
  }
  return alerts
}
