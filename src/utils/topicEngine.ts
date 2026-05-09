import { TOPICS, TOPIC_BY_ID } from '../data/topics'
import type { Topic, TopicMastery, TopicMasteryLevel } from '../types'
import type { AppState } from '../store/useAppStore'

// ══════════════════════════════════════════════════════════════════════════════
// MASTERY COMPUTATION
// Derives topic mastery purely from existing store data — no new stored state.
// Sources: grammarSessions.attempts, errorNotebook, completedLessons
// ══════════════════════════════════════════════════════════════════════════════

export function computeTopicMastery(topic: Topic, store: AppState): TopicMastery {
  const { grammarSessions, errorNotebook, completedLessons } = store

  // ── Accuracy from grammar sessions ──────────────────────────────────────
  let accuracy = 0
  let attemptCount = 0
  let lastPracticed: number | null = null

  if (topic.drillCategory) {
    const dc = topic.drillCategory
    for (const session of grammarSessions) {
      for (const attempt of session.attempts) {
        if (attempt.cat === dc) {
          attemptCount++
          if (attempt.correct) accuracy++
          if (!lastPracticed || session.timestamp > lastPracticed) {
            lastPracticed = session.timestamp
          }
        }
      }
    }
    accuracy = attemptCount > 0 ? Math.round((accuracy / attemptCount) * 100) : 0
  }

  // ── Recent errors (last 14 days) ────────────────────────────────────────
  const twoWeeksAgo = Date.now() - 14 * 86400000
  const recentErrorCount = errorNotebook.filter(e => {
    if (e.resolved) return false
    if (e.lastSeen < twoWeeksAgo) return false
    // Match by drillCategory or by linked lesson in error category
    if (topic.drillCategory && e.category === topic.drillCategory) return true
    // Fallback: check if error category appears in the topic id (loose match)
    if (topic.linkedLessonIds.some(lid => lid === String(e.category))) return true
    return false
  }).length

  // ── Lesson completion ───────────────────────────────────────────────────
  const lessonCompleted = topic.linkedLessonIds.length > 0 &&
    topic.linkedLessonIds.some(lid => completedLessons.includes(lid))

  // ── Mastery level computation ───────────────────────────────────────────
  let level: TopicMasteryLevel
  if (topic.drillCategory) {
    if (attemptCount === 0 && !lessonCompleted) {
      level = 'not_started'
    } else if (attemptCount < 5 || accuracy < 40) {
      level = attemptCount === 0 ? 'introduced' : 'fragile'
    } else if (accuracy < 56) {
      level = 'fragile'
    } else if (accuracy < 72) {
      level = 'developing'
    } else if (accuracy < 88) {
      level = 'proficient'
    } else {
      level = 'mastered'
    }
  } else {
    // Lesson-only topics
    if (!lessonCompleted && recentErrorCount === 0 && attemptCount === 0) {
      level = 'not_started'
    } else if (!lessonCompleted) {
      level = 'introduced'
    } else if (recentErrorCount >= 3) {
      level = 'fragile'
    } else if (recentErrorCount >= 1) {
      level = 'developing'
    } else {
      level = 'proficient'
    }
  }

  // ── Review urgency ──────────────────────────────────────────────────────
  let reviewUrgency: TopicMastery['reviewUrgency'] = 'none'
  const daysSincePractice = lastPracticed
    ? Math.floor((Date.now() - lastPracticed) / 86400000)
    : Infinity

  if (level === 'fragile' && (recentErrorCount >= 2 || accuracy < 50)) {
    reviewUrgency = 'critical'
  } else if (level === 'fragile') {
    reviewUrgency = 'high'
  } else if (level === 'developing' && recentErrorCount >= 2) {
    reviewUrgency = 'high'
  } else if (level === 'developing') {
    reviewUrgency = 'medium'
  } else if (level === 'proficient' && daysSincePractice > 7) {
    reviewUrgency = 'medium'
  } else if (level === 'mastered' && daysSincePractice > 14) {
    reviewUrgency = 'low'
  }

  return {
    topicId: topic.id,
    level,
    accuracy,
    attemptCount,
    recentErrorCount,
    lastPracticed,
    reviewUrgency,
    lessonCompleted,
  }
}

// Compute mastery for all topics at once
export function computeAllTopicMastery(store: AppState): Record<string, TopicMastery> {
  const result: Record<string, TopicMastery> = {}
  for (const topic of TOPICS) {
    result[topic.id] = computeTopicMastery(topic, store)
  }
  return result
}

// ══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATION ENGINE
// ══════════════════════════════════════════════════════════════════════════════

export interface TopicRecommendation {
  topic: Topic
  mastery: TopicMastery
  reason: string
  ctaLabel: string
  priority: number   // 1 = highest
}

const ROI_SCORE: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const URGENCY_SCORE: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

const LEVEL_CTA: Record<TopicMasteryLevel, string> = {
  not_started: 'Start →',
  introduced:  'Learn →',
  fragile:     'Repair →',
  developing:  'Practice →',
  proficient:  'Review →',
  mastered:    '✓ Mastered',
}

export function getTopicCTA(level: TopicMasteryLevel): string {
  return LEVEL_CTA[level]
}

export function getRecommendedTopics(store: AppState, limit = 3): TopicRecommendation[] {
  const masteryMap = computeAllTopicMastery(store)

  return TOPICS
    .map(topic => {
      const mastery = masteryMap[topic.id]
      // Score = urgency weight + ROI weight + not-started bonus
      let score = URGENCY_SCORE[mastery.reviewUrgency] * 2 + ROI_SCORE[topic.toeicROI]
      let reason = ''

      if (mastery.level === 'fragile') {
        reason = `Accuracy ${mastery.accuracy}% — needs repair`
        score += 3
      } else if (mastery.level === 'not_started' && topic.toeicROI === 'critical') {
        reason = `Critical topic — not yet started`
        score += 4
      } else if (mastery.level === 'not_started') {
        reason = `Not started — high ROI`
        score += 2
      } else if (mastery.recentErrorCount > 0) {
        reason = `${mastery.recentErrorCount} recent error${mastery.recentErrorCount > 1 ? 's' : ''} in last 14 days`
        score += mastery.recentErrorCount
      } else if (mastery.level === 'developing') {
        reason = `In progress — accuracy ${mastery.accuracy}%`
      } else if (mastery.level === 'proficient' && mastery.reviewUrgency !== 'none') {
        reason = `Due for review`
      } else {
        reason = `${topic.toeicROI === 'critical' ? 'Critical' : 'High'} ROI topic`
      }

      return {
        topic,
        mastery,
        reason,
        ctaLabel: LEVEL_CTA[mastery.level],
        priority: score,
      }
    })
    .filter(r => r.mastery.level !== 'mastered')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}

export function getRepairTopics(store: AppState): { topic: Topic; mastery: TopicMastery }[] {
  const masteryMap = computeAllTopicMastery(store)
  return TOPICS
    .filter(t => {
      const m = masteryMap[t.id]
      return m.level === 'fragile' || (m.recentErrorCount >= 2 && m.level !== 'mastered')
    })
    .map(t => ({ topic: t, mastery: masteryMap[t.id] }))
    .sort((a, b) => b.mastery.recentErrorCount - a.mastery.recentErrorCount)
}

export function getWeakTopics(store: AppState): { topic: Topic; mastery: TopicMastery }[] {
  const masteryMap = computeAllTopicMastery(store)
  return TOPICS
    .filter(t => {
      const m = masteryMap[t.id]
      return m.level === 'fragile' || m.level === 'developing' || (m.attemptCount > 0 && m.accuracy < 75)
    })
    .map(t => ({ topic: t, mastery: masteryMap[t.id] }))
    .sort((a, b) => a.mastery.accuracy - b.mastery.accuracy)
}

export function getHighROITopics(): Topic[] {
  return TOPICS
    .filter(t => t.toeicROI === 'critical' || t.toeicROI === 'high')
    .sort((a, b) => a.frequencyRank - b.frequencyRank)
}

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════

export interface TopicAnalytics {
  totalTopics: number
  masteredCount: number
  proficientCount: number
  developingCount: number
  fragileCount: number
  notStartedCount: number
  masteryPct: number           // % proficient or mastered
  criticalRepairCount: number  // topics with critical urgency
  strongestTopics: { topic: Topic; mastery: TopicMastery }[]
  weakestTopics: { topic: Topic; mastery: TopicMastery }[]
  mostErrorProne: { topic: Topic; mastery: TopicMastery }[]
}

export function getTopicAnalytics(store: AppState): TopicAnalytics {
  const masteryMap = computeAllTopicMastery(store)
  const entries = TOPICS.map(t => ({ topic: t, mastery: masteryMap[t.id] }))

  const counts = {
    mastered: 0,
    proficient: 0,
    developing: 0,
    fragile: 0,
    not_started: 0,
    introduced: 0,
    critical: 0,
  }
  for (const { mastery: m } of entries) {
    counts[m.level]++
    if (m.reviewUrgency === 'critical') counts.critical++
  }

  const withAttempts = entries.filter(e => e.mastery.attemptCount > 3)

  return {
    totalTopics: TOPICS.length,
    masteredCount: counts.mastered,
    proficientCount: counts.proficient,
    developingCount: counts.developing,
    fragileCount: counts.fragile,
    notStartedCount: counts.not_started + counts.introduced,
    masteryPct: Math.round(((counts.mastered + counts.proficient) / TOPICS.length) * 100),
    criticalRepairCount: counts.critical,
    strongestTopics: withAttempts
      .sort((a, b) => b.mastery.accuracy - a.mastery.accuracy)
      .slice(0, 3),
    weakestTopics: withAttempts
      .filter(e => e.mastery.level !== 'mastered')
      .sort((a, b) => a.mastery.accuracy - b.mastery.accuracy)
      .slice(0, 3),
    mostErrorProne: entries
      .filter(e => e.mastery.recentErrorCount > 0)
      .sort((a, b) => b.mastery.recentErrorCount - a.mastery.recentErrorCount)
      .slice(0, 3),
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════════════════════════════════════

export const MASTERY_COLORS: Record<TopicMasteryLevel, string> = {
  not_started: '#3F3F46',
  introduced:  '#6366F1',
  fragile:     '#F43F5E',
  developing:  '#F59E0B',
  proficient:  '#6366F1',
  mastered:    '#10B981',
}

export const MASTERY_LABELS: Record<TopicMasteryLevel, string> = {
  not_started: 'Not started',
  introduced:  'Introduced',
  fragile:     'Fragile',
  developing:  'Developing',
  proficient:  'Proficient',
  mastered:    'Mastered',
}

export const MASTERY_PCT: Record<TopicMasteryLevel, number> = {
  not_started: 0,
  introduced:  15,
  fragile:     30,
  developing:  55,
  proficient:  78,
  mastered:    100,
}

export const ROI_COLORS: Record<string, string> = {
  critical: '#F43F5E',
  high:     '#F59E0B',
  medium:   '#6366F1',
  low:      '#52525B',
}

export const ROI_LABELS: Record<string, string> = {
  critical: 'Critical',
  high:     'High ROI',
  medium:   'Medium',
  low:      'Low',
}

export const CATEGORY_ACCENT: Record<string, string> = {
  grammar:    '#6366F1',
  vocabulary: '#10B981',
  traps:      '#F43F5E',
  strategy:   '#F59E0B',
  reading:    '#0EA5E9',
}

export const CATEGORY_LABELS: Record<string, string> = {
  grammar:    'Grammar',
  vocabulary: 'Vocabulary',
  traps:      'Traps',
  strategy:   'Strategy',
  reading:    'Reading',
}

export function getTopicById(id: string): Topic | undefined {
  return TOPIC_BY_ID[id]
}

export function formatLastPracticed(ts: number | null): string {
  if (!ts) return 'Never'
  const days = Math.floor((Date.now() - ts) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
