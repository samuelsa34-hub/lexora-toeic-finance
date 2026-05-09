import type { AppState } from '../store/useAppStore'
import { CAT_LABELS } from './constants'

export interface WeeklyReport {
  weekStart: number
  weekEnd: number
  sessionsThisWeek: number
  questionsAnswered: number
  accuracy: number | null
  studyMinutesEstimate: number
  lessonsCompleted: string[]
  errorsAdded: number
  errorsResolved: number
  topImprovement: string | null
  topDecline: string | null
  weeklyXP: number
  highlights: string[]
  nextWeekFocus: string[]
}

export function generateWeeklyReport(store: AppState): WeeklyReport {
  const now = Date.now()
  const weekStart = now - 7 * 86_400_000
  const weekEnd = now

  const weeklySessions = store.grammarSessions.filter(s => s.timestamp >= weekStart)
  const prevSessions = store.grammarSessions.filter(s => s.timestamp < weekStart && s.timestamp >= weekStart - 7 * 86_400_000)

  const questionsAnswered = weeklySessions.reduce((s, x) => s + x.count, 0)
  const correctThisWeek = weeklySessions.reduce((s, x) => s + x.correct, 0)
  const accuracy = questionsAnswered > 0 ? Math.round(correctThisWeek / questionsAnswered * 100) : null

  const studyMinutesEstimate = Math.ceil(questionsAnswered * 0.8 + (store.part6Sessions ?? []).filter(s => s.timestamp >= weekStart).length * 12)

  // Category improvement vs previous week
  const catThis: Record<string, { c: number; t: number }> = {}
  const catPrev: Record<string, { c: number; t: number }> = {}
  for (const sess of weeklySessions) {
    for (const a of sess.attempts ?? []) {
      if (!catThis[a.cat]) catThis[a.cat] = { c: 0, t: 0 }
      catThis[a.cat].t++; if (a.correct) catThis[a.cat].c++
    }
  }
  for (const sess of prevSessions) {
    for (const a of sess.attempts ?? []) {
      if (!catPrev[a.cat]) catPrev[a.cat] = { c: 0, t: 0 }
      catPrev[a.cat].t++; if (a.correct) catPrev[a.cat].c++
    }
  }
  let topImprovement: string | null = null
  let topDecline: string | null = null
  let bestDelta = 0, worstDelta = 0
  for (const [cat, cur] of Object.entries(catThis)) {
    const prev = catPrev[cat]
    if (!prev || prev.t < 3 || cur.t < 3) continue
    const delta = cur.c / cur.t - prev.c / prev.t
    if (delta > bestDelta) { bestDelta = delta; topImprovement = CAT_LABELS[cat] ?? cat }
    if (delta < worstDelta) { worstDelta = delta; topDecline = CAT_LABELS[cat] ?? cat }
  }

  // Lessons completed this week (approximated from store)
  const lessonsCompleted: string[] = [] // Would need timestamps on completedLessons to filter by week

  const errorsAdded = store.errorNotebook.filter(e => e.lastSeen >= weekStart).length
  const errorsResolved = store.errorNotebook.filter(e => e.resolved && e.lastSeen >= weekStart).length

  const weeklyXP = weeklySessions.reduce((s, x) => s + Math.round(x.correct * 2.5), 0)

  const highlights: string[] = []
  if (questionsAnswered >= 100) highlights.push(`Answered ${questionsAnswered} questions this week!`)
  if (accuracy !== null && accuracy >= 80) highlights.push(`${accuracy}% accuracy — excellent precision`)
  if (store.profile.streak >= 7) highlights.push(`${store.profile.streak}-day study streak maintained`)
  if (errorsResolved >= 5) highlights.push(`Resolved ${errorsResolved} mistakes`)
  if (topImprovement) highlights.push(`Big improvement in ${topImprovement}`)

  const nextWeekFocus: string[] = []
  if (topDecline) nextWeekFocus.push(`Focus on ${topDecline} — it dropped this week`)
  const weakCats = Object.entries(catThis)
    .filter(([, v]) => v.t >= 3 && v.c / v.t < 0.65)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
    .slice(0, 2)
    .map(([k]) => CAT_LABELS[k] ?? k)
  for (const cat of weakCats) nextWeekFocus.push(`Drill ${cat} — below 65% accuracy`)
  if ((store.part6Sessions ?? []).length < 3) nextWeekFocus.push('Try Part 6 text completion')
  if (nextWeekFocus.length === 0) nextWeekFocus.push('Keep drilling — maintain consistency')

  return {
    weekStart, weekEnd, sessionsThisWeek: weeklySessions.length, questionsAnswered,
    accuracy, studyMinutesEstimate, lessonsCompleted, errorsAdded, errorsResolved,
    topImprovement, topDecline, weeklyXP, highlights, nextWeekFocus,
  }
}

export function exportWeeklyReportCSV(report: WeeklyReport, studentName: string): string {
  const rows = [
    ['Student', studentName],
    ['Week', `${new Date(report.weekStart).toLocaleDateString()} – ${new Date(report.weekEnd).toLocaleDateString()}`],
    ['Sessions', report.sessionsThisWeek],
    ['Questions answered', report.questionsAnswered],
    ['Accuracy', report.accuracy !== null ? `${report.accuracy}%` : '—'],
    ['Study time (est.)', `${report.studyMinutesEstimate} min`],
    ['XP earned', report.weeklyXP],
    ['Errors added', report.errorsAdded],
    ['Errors resolved', report.errorsResolved],
    ['Top improvement', report.topImprovement ?? '—'],
    ['Top decline', report.topDecline ?? '—'],
    ['Next week focus', report.nextWeekFocus.join('; ')],
  ]
  return rows.map(r => r.map(String).join(',')).join('\n')
}
