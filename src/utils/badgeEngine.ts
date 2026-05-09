import type { AppState } from '../store/useAppStore'
import type { Badge } from '../types'

interface BadgeDef {
  id: string
  title: string
  description: string
  icon: string
  category: Badge['category']
  check: (s: AppState) => boolean
}

const BADGE_DEFS: BadgeDef[] = [
  // Streaks
  { id: 'streak_3', title: '3-Day Warrior', description: '3-day study streak', icon: '🔥', category: 'streak', check: s => s.profile.streak >= 3 },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day study streak', icon: '⚡', category: 'streak', check: s => s.profile.streak >= 7 },
  { id: 'streak_14', title: '2-Week Titan', description: '14-day study streak', icon: '💥', category: 'streak', check: s => s.profile.streak >= 14 },
  { id: 'streak_30', title: 'Iron Discipline', description: '30-day study streak', icon: '🏆', category: 'streak', check: s => s.profile.streak >= 30 },

  // Accuracy
  { id: 'acc_75', title: 'Solid Foundation', description: 'Overall accuracy ≥ 75%', icon: '🎯', category: 'accuracy', check: s => overallAcc(s) >= 75 },
  { id: 'acc_85', title: 'Precision Machine', description: 'Overall accuracy ≥ 85%', icon: '🔬', category: 'accuracy', check: s => overallAcc(s) >= 85 },
  { id: 'acc_90', title: 'Sharpshooter', description: 'Overall accuracy ≥ 90%', icon: '💎', category: 'accuracy', check: s => overallAcc(s) >= 90 },

  // Volume
  { id: 'q50', title: 'First 50', description: 'Answered 50 questions', icon: '✏️', category: 'grammar', check: s => totalQuestions(s) >= 50 },
  { id: 'q200', title: 'Grinder', description: 'Answered 200 questions', icon: '⚙️', category: 'grammar', check: s => totalQuestions(s) >= 200 },
  { id: 'q500', title: 'Machine', description: 'Answered 500 questions', icon: '🚀', category: 'grammar', check: s => totalQuestions(s) >= 500 },

  // Vocabulary
  { id: 'vocab_20', title: 'Word Collector', description: '20+ words marked Known', icon: '📚', category: 'vocabulary', check: s => vocabKnown(s) >= 20 },
  { id: 'vocab_50', title: 'Vocabulary Builder', description: '50+ words marked Known', icon: '📖', category: 'vocabulary', check: s => vocabKnown(s) >= 50 },
  { id: 'vocab_80', title: 'Lexicon Master', description: '80 words mastered', icon: '🧠', category: 'vocabulary', check: s => vocabKnown(s) >= 80 },

  // Lessons
  { id: 'lesson_1', title: 'First Lesson', description: 'Completed your first lesson', icon: '🎓', category: 'completion', check: s => s.completedLessons.length >= 1 },
  { id: 'lesson_5', title: 'Scholar', description: 'Completed 5 lessons', icon: '📝', category: 'completion', check: s => s.completedLessons.length >= 5 },
  { id: 'lesson_10', title: 'Academic', description: 'Completed 10 lessons', icon: '🏅', category: 'completion', check: s => s.completedLessons.length >= 10 },

  // Errors resolved
  { id: 'resolve_5', title: 'Error Slayer', description: 'Resolved 5 mistakes', icon: '🛡️', category: 'completion', check: s => s.errorNotebook.filter(e => e.resolved).length >= 5 },
  { id: 'resolve_20', title: 'Correction Master', description: 'Resolved 20 mistakes', icon: '⚔️', category: 'completion', check: s => s.errorNotebook.filter(e => e.resolved).length >= 20 },

  // Part 6
  { id: 'part6_first', title: 'Text Completion', description: 'Completed first Part 6', icon: '📄', category: 'part6', check: s => (s.part6Sessions?.length ?? 0) >= 1 },
  { id: 'part6_ace', title: 'Part 6 Ace', description: '80%+ accuracy in Part 6 (5+ sessions)', icon: '✨', category: 'part6', check: s => part6Acc(s) >= 0.8 && (s.part6Sessions?.length ?? 0) >= 5 },

  // Mock
  { id: 'mock_first', title: 'Test Taker', description: 'Completed first mock exam', icon: '📊', category: 'mock', check: s => s.grammarSessions.some(x => x.category === 'mock' || x.count >= 30) },

  // XP
  { id: 'xp_500', title: '500 XP', description: 'Reached 500 XP', icon: '⭐', category: 'special', check: s => s.profile.xp >= 500 },
  { id: 'xp_2000', title: '2000 XP', description: 'Reached 2000 XP', icon: '🌟', category: 'special', check: s => s.profile.xp >= 2000 },
  { id: 'xp_5000', title: 'Elite', description: 'Reached 5000 XP', icon: '💫', category: 'special', check: s => s.profile.xp >= 5000 },
]

function overallAcc(s: AppState): number {
  const total = s.grammarSessions.reduce((sum, x) => sum + x.count, 0)
  const correct = s.grammarSessions.reduce((sum, x) => sum + x.correct, 0)
  return total > 0 ? Math.round(correct / total * 100) : 0
}
function totalQuestions(s: AppState): number {
  return s.grammarSessions.reduce((sum, x) => sum + x.count, 0)
}
function vocabKnown(s: AppState): number {
  return Object.values(s.vocabRatings).filter(r => r === 'known').length
}
function part6Acc(s: AppState): number {
  const sessions = s.part6Sessions ?? []
  if (!sessions.length) return 0
  return sessions.reduce((sum, x) => sum + x.correct / x.total, 0) / sessions.length
}

export function computeBadges(store: AppState): Badge[] {
  return BADGE_DEFS
    .filter(def => def.check(store))
    .map(({ id, title, description, icon, category }) => ({ id, title, description, icon, category }))
}

export function computeNextBadge(store: AppState): BadgeDef | null {
  const earned = new Set(computeBadges(store).map(b => b.id))
  return BADGE_DEFS.find(d => !earned.has(d.id)) ?? null
}

export { BADGE_DEFS }
