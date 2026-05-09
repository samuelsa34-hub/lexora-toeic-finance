import type { AppState } from '../store/useAppStore'
import type { StudentMeta } from '../types'
import { CAT_LABELS } from './constants'

export interface PreMeetingSummary {
  studentName: string
  estimatedScore: number | null
  targetScore: number
  gap: number | null
  overallAccuracy: number | null
  totalSessions: number
  studyDays: number
  weakCategories: Array<{ cat: string; pct: number }>
  strongCategories: Array<{ cat: string; pct: number }>
  repeatedMistakes: Array<{ topic: string; count: number; example: string }>
  unresolvedErrors: number
  part6Accuracy: number | null
  lessonsCompleted: number
  suggestedAgenda: string[]
  interventionNotes: string[]
}

export function generatePreMeetingSummary(
  snap: Partial<AppState> | null,
  student: StudentMeta,
  teacherNote?: string
): PreMeetingSummary {
  if (!snap) {
    return {
      studentName: student.name, estimatedScore: null, targetScore: student.targetScore,
      gap: null, overallAccuracy: null, totalSessions: 0, studyDays: 0,
      weakCategories: [], strongCategories: [], repeatedMistakes: [],
      unresolvedErrors: 0, part6Accuracy: null, lessonsCompleted: 0,
      suggestedAgenda: ['Get started — no data yet'], interventionNotes: [],
    }
  }

  const sessions = snap.grammarSessions ?? []
  const errors = snap.errorNotebook ?? []
  const p6 = snap.part6Sessions ?? []

  const totalQ = sessions.reduce((s, x) => s + x.count, 0)
  const totalC = sessions.reduce((s, x) => s + x.correct, 0)
  const overallAccuracy = totalQ > 0 ? Math.round(totalC / totalQ * 100) : null
  const recent = sessions.slice(-10)
  const recentAcc = recent.length > 0 ? recent.reduce((s, x) => s + x.correct / x.count, 0) / recent.length : null
  const estimatedScore = recentAcc !== null ? Math.min(990, 150 + Math.round(recentAcc * 345) + Math.round(student.targetScore / 4)) : null
  const gap = estimatedScore !== null ? student.targetScore - estimatedScore : null

  // Categories
  const catAcc: Record<string, { c: number; t: number }> = {}
  for (const sess of sessions) {
    for (const a of sess.attempts ?? []) {
      if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
      catAcc[a.cat].t++; if (a.correct) catAcc[a.cat].c++
    }
  }
  const cats = Object.entries(catAcc)
    .filter(([, v]) => v.t >= 3)
    .map(([k, v]) => ({ cat: CAT_LABELS[k] ?? k, key: k, pct: Math.round(v.c / v.t * 100) }))
    .sort((a, b) => a.pct - b.pct)
  const weakCategories = cats.slice(0, 3).map(x => ({ cat: x.cat, pct: x.pct }))
  const strongCategories = cats.slice(-3).reverse().filter(x => x.pct >= 75).map(x => ({ cat: x.cat, pct: x.pct }))

  // Repeated mistakes
  const catErrors: Record<string, { count: number; example: string }> = {}
  for (const e of errors.filter(e => !e.resolved)) {
    const key = CAT_LABELS[e.category] ?? e.category
    if (!catErrors[key]) catErrors[key] = { count: 0, example: e.question.slice(0, 60) + '…' }
    catErrors[key].count += e.occurrences
  }
  const repeatedMistakes = Object.entries(catErrors)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
    .map(([topic, { count, example }]) => ({ topic, count, example }))

  const part6Accuracy = p6.length >= 2
    ? Math.round(p6.reduce((s, x) => s + x.correct / x.total, 0) / p6.length * 100)
    : null

  // Unique study days
  const studyDays = new Set(sessions.map(s => new Date(s.timestamp).toDateString())).size

  // Agenda
  const suggestedAgenda: string[] = []
  if (repeatedMistakes.length > 0) suggestedAgenda.push(`Review repeated mistakes: ${repeatedMistakes[0].topic}`)
  if (weakCategories.length > 0) suggestedAgenda.push(`Focus drill: ${weakCategories[0].cat} (${weakCategories[0].pct}%)`)
  if (gap !== null && gap > 100) suggestedAgenda.push(`Discuss score gap (${gap} pts to target) — identify highest-leverage areas`)
  if (part6Accuracy !== null && part6Accuracy < 65) suggestedAgenda.push('Review Part 6 strategy — text completion technique')
  suggestedAgenda.push('Assign next week\'s targeted practice')

  // Intervention notes
  const interventionNotes: string[] = []
  if (weeksSinceSession(sessions) >= 2) interventionNotes.push('Student has not studied consistently — motivation check needed')
  if (repeatedMistakes.some(m => m.count >= 5)) interventionNotes.push('Pattern of repeated errors — targeted correction required')
  if (gap !== null && gap > 150) interventionNotes.push(`Large gap to target (${gap} pts) — review exam date and expectations`)
  if (teacherNote) interventionNotes.push(`Teacher note: ${teacherNote}`)

  return {
    studentName: student.name, estimatedScore, targetScore: student.targetScore, gap,
    overallAccuracy, totalSessions: sessions.length, studyDays,
    weakCategories, strongCategories, repeatedMistakes, unresolvedErrors: errors.filter(e => !e.resolved).length,
    part6Accuracy, lessonsCompleted: (snap.completedLessons ?? []).length,
    suggestedAgenda, interventionNotes,
  }
}

function weeksSinceSession(sessions: AppState['grammarSessions']): number {
  if (!sessions.length) return 99
  const last = Math.max(...sessions.map(s => s.timestamp))
  return Math.floor((Date.now() - last) / (7 * 86_400_000))
}
