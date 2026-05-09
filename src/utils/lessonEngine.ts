import { lessons as LESSONS, CATEGORY_TO_LESSON } from '../data/courses'
import { phrasalVerbLessons } from '../data/phrasalVerbLessons'
import { LEARNING_PATHS } from '../data/learningPaths'
import type { Lesson, LearningPath } from '../types'

const ALL_LESSONS: Lesson[] = [...LESSONS, ...phrasalVerbLessons]

// ── Lesson lookup ──────────────────────────────────────────────────────────────

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find(l => l.id === id)
}

export function getLessonsByCategory(category: string): Lesson[] {
  return LESSONS.filter(l => l.category === category)
}

export function getLessonForCategory(drillCategory: string): Lesson | undefined {
  const lessonId = CATEGORY_TO_LESSON[drillCategory]
  if (!lessonId) return undefined
  return getLessonById(lessonId)
}

// ── Path lookup ────────────────────────────────────────────────────────────────

export function getPathById(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find(p => p.id === id)
}

// ── Recommendation engine ──────────────────────────────────────────────────────

/**
 * Given a list of weak category keys (e.g. 'word_form', 'preposition'),
 * return the best next lesson to study.
 * Priority: (1) first weak category that has a linked lesson, (2) fallback to word_form.
 */
export function getRecommendedLesson(weakCategories: string[], completedLessonIds: string[]): Lesson | undefined {
  for (const cat of weakCategories) {
    const lessonId = CATEGORY_TO_LESSON[cat]
    if (!lessonId) continue
    // Prefer lessons not yet completed
    if (!completedLessonIds.includes(lessonId)) {
      const lesson = getLessonById(lessonId)
      if (lesson) return lesson
    }
  }
  // All weak-category lessons done — find any uncompleted lesson
  const uncompleted = LESSONS.filter(l => !completedLessonIds.includes(l.id))
  if (uncompleted.length > 0) return uncompleted[0]
  // Everything done — recommend the first lesson as a review
  return LESSONS[0]
}

// ── Repair lessons (error-driven) ──────────────────────────────────────────────

/**
 * Given an error notebook entry's category, find the most relevant lesson
 * to repair that knowledge gap.
 */
export function getRepairLesson(errorCategory: string): Lesson | undefined {
  // Direct lookup first
  const direct = getLessonForCategory(errorCategory)
  if (direct) return direct

  // Fuzzy match by category type
  const catMap: Record<string, string> = {
    vocab: 'vocab_finance',
    collocation: 'vocab_finance',
    part5: 'strategy_part5',
    part6: 'strategy_part7',
    part7: 'strategy_part7',
    reading: 'strategy_part7',
  }
  const fallbackId = catMap[errorCategory]
  if (fallbackId) return getLessonById(fallbackId)

  return undefined
}

/**
 * Given a list of unresolved error entries, return the top 3 most relevant
 * repair lessons (deduplicated by lesson ID).
 */
export function getRepairLessons(errorCategories: string[]): Lesson[] {
  const seen = new Set<string>()
  const result: Lesson[] = []
  for (const cat of errorCategories) {
    const lesson = getRepairLesson(cat)
    if (lesson && !seen.has(lesson.id)) {
      seen.add(lesson.id)
      result.push(lesson)
      if (result.length >= 3) break
    }
  }
  return result
}

// ── Progress helpers ───────────────────────────────────────────────────────────

export function getPathProgress(path: LearningPath, completedLessonIds: string[]): number {
  const lessonSteps = path.steps.filter(s => s.type === 'lesson' && s.lessonId)
  if (lessonSteps.length === 0) return 0
  const doneCount = lessonSteps.filter(s => s.lessonId && completedLessonIds.includes(s.lessonId)).length
  return Math.round((doneCount / lessonSteps.length) * 100)
}

export function isPathComplete(path: LearningPath, completedLessonIds: string[]): boolean {
  const lessonSteps = path.steps.filter(s => s.type === 'lesson' && s.lessonId)
  return lessonSteps.every(s => s.lessonId && completedLessonIds.includes(s.lessonId))
}

// ── Category label helpers ─────────────────────────────────────────────────────

export const LESSON_CATEGORY_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  traps: 'Trap Lab',
  strategy: 'Strategy',
  reading: 'Reading',
  business_english: 'Business English',
}

export const LESSON_CATEGORY_ICONS: Record<string, string> = {
  grammar: '📝',
  vocabulary: '📚',
  traps: '⚠️',
  strategy: '🗺️',
  reading: '📖',
  business_english: '💼',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-amber-400',
  advanced: 'text-red-400',
}
