import type { GrammarSession, ReadingSession } from '../types'

export function computeEstimatedScore(
  baseScore: number,
  grammarSessions: GrammarSession[],
  readingSessions: ReadingSession[]
): { total: number; reading: number; listening: number } {
  let readingScore = Math.round(baseScore * 0.5)
  const listeningScore = Math.round(baseScore * 0.5)

  if (grammarSessions.length >= 2) {
    const recent = grammarSessions.slice(-8)
    const avgAcc = recent.reduce((s, sess) => s + sess.correct / sess.count, 0) / recent.length
    readingScore = Math.round(150 + avgAcc * 345)
  }

  if (readingSessions.length >= 1) {
    const recent = readingSessions.slice(-5)
    const avgAcc = recent.reduce((s, sess) => s + sess.correct / sess.total, 0) / recent.length
    readingScore = Math.min(495, readingScore + Math.round((avgAcc - 0.65) * 120))
  }

  readingScore = Math.max(5, Math.min(495, readingScore))
  const total = Math.min(990, Math.max(10, readingScore + listeningScore))
  return { total, reading: readingScore, listening: listeningScore }
}

export function projectedScoreIn7Days(currentScore: number, recentAccuracy: number): number {
  const dailyRate = recentAccuracy > 0.8 ? 18 : recentAccuracy > 0.65 ? 12 : 7
  return Math.min(990, currentScore + dailyRate * 7)
}

export function projectedScoreIn14Days(currentScore: number, recentAccuracy: number): number {
  const dailyRate = recentAccuracy > 0.8 ? 18 : recentAccuracy > 0.65 ? 12 : 7
  return Math.min(990, currentScore + dailyRate * 14)
}

export function getReadinessLevel(score: number, target: number): {
  label: string; color: string; pct: number
} {
  const pct = Math.min(100, Math.round((score / target) * 100))
  if (pct >= 98) return { label: 'TARGET REACHED', color: '#10B981', pct }
  if (pct >= 90) return { label: 'NEARLY READY', color: '#34D399', pct }
  if (pct >= 80) return { label: 'ON TRACK', color: '#6366F1', pct }
  if (pct >= 70) return { label: 'PROGRESSING', color: '#F59E0B', pct }
  return { label: 'NEEDS WORK', color: '#EF4444', pct }
}
