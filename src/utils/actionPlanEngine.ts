import type { AppState } from '../store/useAppStore'
import type { ActionPlanItem, ActionPriority } from '../types'
import { CAT_LABELS } from './constants'

let _idCounter = 0
function mkId() { return `ap_${++_idCounter}` }

function item(
  priority: ActionPriority,
  type: ActionPlanItem['type'],
  title: string,
  reason: string,
  estimatedMinutes: number,
  path: string,
  extra?: Pick<ActionPlanItem, 'category' | 'lessonId'>
): ActionPlanItem {
  return { id: mkId(), priority, type, title, reason, estimatedMinutes, path, ...extra }
}

export function generateActionPlan(store: AppState): ActionPlanItem[] {
  const plan: ActionPlanItem[] = []
  const {
    grammarSessions, errorNotebook, completedLessons,
    part6Sessions, readingSessions, vocabRatings,
    profile, completedAssignments,
  } = store

  // ── 1. Repeated errors (same category, high frequency) ──────────────────────
  const catErrorCount: Record<string, number> = {}
  for (const e of errorNotebook.filter(e => !e.resolved)) {
    catErrorCount[e.category] = (catErrorCount[e.category] ?? 0) + e.occurrences
  }
  const worstCat = Object.entries(catErrorCount).sort((a, b) => b[1] - a[1])[0]
  if (worstCat && worstCat[1] >= 3) {
    plan.push(item('critical', 'drill',
      `Repair: ${CAT_LABELS[worstCat[0]] ?? worstCat[0]}`,
      `You have ${worstCat[1]} unresolved errors in this category`,
      15, '/grammar', { category: worstCat[0] }
    ))
  }

  // ── 2. Category accuracy below 60% ──────────────────────────────────────────
  const catAcc: Record<string, { c: number; t: number }> = {}
  for (const sess of grammarSessions) {
    for (const a of sess.attempts ?? []) {
      if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
      catAcc[a.cat].t++
      if (a.correct) catAcc[a.cat].c++
    }
  }
  const criticalCats = Object.entries(catAcc)
    .filter(([, v]) => v.t >= 5 && v.c / v.t < 0.6)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
    .slice(0, 2)

  for (const [cat, v] of criticalCats) {
    const pct = Math.round(v.c / v.t * 100)
    plan.push(item('high', 'drill',
      `Drill: ${CAT_LABELS[cat] ?? cat}`,
      `Your accuracy is only ${pct}% — needs urgent attention`,
      20, '/grammar', { category: cat }
    ))
  }

  // ── 3. Part 6 weak ──────────────────────────────────────────────────────────
  if (part6Sessions.length >= 2) {
    const avgAcc = part6Sessions.slice(-5).reduce((s, x) => s + x.correct / x.total, 0) / Math.min(5, part6Sessions.length)
    if (avgAcc < 0.65) {
      plan.push(item('high', 'part6',
        'Practice Part 6 Text Completion',
        `Your Part 6 accuracy is ${Math.round(avgAcc * 100)}% — below target`,
        20, '/part6'
      ))
    }
  } else if (part6Sessions.length === 0) {
    plan.push(item('medium', 'part6',
      'Try Part 6 for the first time',
      'Text Completion is worth 4 questions per passage on the real exam',
      20, '/part6'
    ))
  }

  // ── 4. Inactivity (no session in 3+ days) ───────────────────────────────────
  const allSessions = [...grammarSessions, ...readingSessions, ...part6Sessions]
  const lastActivity = allSessions.length > 0
    ? Math.max(...allSessions.map(s => s.timestamp))
    : null
  const daysSince = lastActivity ? Math.floor((Date.now() - lastActivity) / 86_400_000) : null
  if (daysSince !== null && daysSince >= 3) {
    plan.push(item('high', 'drill',
      'Restart with a warm-up drill',
      `You haven't practiced in ${daysSince} days — momentum matters`,
      10, '/grammar'
    ))
  }

  // ── 5. Vocab below threshold ─────────────────────────────────────────────────
  const knownVocab = Object.values(vocabRatings).filter(r => r === 'known').length
  if (knownVocab < 30) {
    plan.push(item('medium', 'vocab',
      'Expand your vocabulary',
      `Only ${knownVocab} words marked "known" — target 50+ for TOEIC 850+`,
      15, '/vocabulary'
    ))
  }

  // ── 6. Error notebook review ─────────────────────────────────────────────────
  const unresolvedErrors = errorNotebook.filter(e => !e.resolved)
  if (unresolvedErrors.length >= 5) {
    plan.push(item('medium', 'review_errors',
      `Review your ${unresolvedErrors.length} unresolved mistakes`,
      'Resolving past mistakes is the fastest way to stop losing points',
      15, '/errors'
    ))
  }

  // ── 7. Recommend next lesson ─────────────────────────────────────────────────
  const weakestCat = Object.entries(catAcc)
    .filter(([, v]) => v.t >= 3 && v.c / v.t < 0.75)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)[0]
  if (weakestCat && completedLessons.length < 10) {
    plan.push(item('medium', 'lesson',
      `Study the ${CAT_LABELS[weakestCat[0]] ?? weakestCat[0]} lesson`,
      'Understanding the rule is the first step to fixing the pattern',
      12, '/courses'
    ))
  }

  // ── 8. Score is stagnating → mock exam ───────────────────────────────────────
  if (grammarSessions.length >= 10) {
    const older = grammarSessions.slice(-10, -5).reduce((s, x) => s + x.correct / x.count, 0) / 5
    const newer = grammarSessions.slice(-5).reduce((s, x) => s + x.correct / x.count, 0) / 5
    if (Math.abs(newer - older) < 0.03) {
      plan.push(item('medium', 'mock',
        'Take a timed mock exam',
        'Your scores have plateaued — a mock will reveal the next gap',
        75, '/mock'
      ))
    }
  }

  // ── 9. Exam countdown ────────────────────────────────────────────────────────
  if (profile.examDate) {
    const daysLeft = Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86_400_000)
    if (daysLeft <= 7 && daysLeft > 0) {
      plan.push(item('critical', 'review_errors',
        `Final review — ${daysLeft} days to exam`,
        'Focus: review mistakes, do one mock, read strategy notes',
        30, '/errors'
      ))
    }
  }

  // ── 10. Fallback: keep drilling ───────────────────────────────────────────────
  if (plan.length === 0) {
    plan.push(item('medium', 'drill', 'Practice grammar', 'Regular drilling builds accuracy steadily', 15, '/grammar'))
    plan.push(item('low', 'vocab', 'Study vocabulary', 'TOEIC rewards wide vocabulary', 10, '/vocabulary'))
  }

  const order: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return plan.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 6)
}
