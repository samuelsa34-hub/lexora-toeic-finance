export type Rank =
  | 'Recruit' | 'Cadet' | 'Soldier' | 'Warrior' | 'Veteran'
  | 'Elite' | 'Commando' | 'Specialist' | 'Master' | 'Grand Master'

export interface LevelInfo {
  level: number
  rank: Rank
  xpForLevel: number
  xpForNext: number
  progress: number // 0–100
}

export const RANK_NAMES: Rank[] = [
  'Recruit', 'Cadet', 'Soldier', 'Warrior', 'Veteran',
  'Elite', 'Commando', 'Specialist', 'Master', 'Grand Master',
]

// XP required to REACH each level index
export const LEVEL_XP = [0, 100, 300, 600, 1200, 2500, 5000, 10000, 20000, 40000]

export const RANK_COLORS: Record<Rank, string> = {
  'Recruit':      '#64748B',
  'Cadet':        '#6366F1',
  'Soldier':      '#8B5CF6',
  'Warrior':      '#EC4899',
  'Veteran':      '#F59E0B',
  'Elite':        '#EF4444',
  'Commando':     '#10B981',
  'Specialist':   '#06B6D4',
  'Master':       '#F97316',
  'Grand Master': '#FBBF24',
}

export const RANK_ICONS: Record<Rank, string> = {
  'Recruit':      '🔰',
  'Cadet':        '⚡',
  'Soldier':      '⚔️',
  'Warrior':      '🛡️',
  'Veteran':      '🌟',
  'Elite':        '💥',
  'Commando':     '🎯',
  'Specialist':   '🔮',
  'Master':       '👑',
  'Grand Master': '🏆',
}

export function levelFromXP(xp: number): LevelInfo {
  let level = 0
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) { level = i; break }
  }
  const isMax = level === LEVEL_XP.length - 1
  const xpForLevel = LEVEL_XP[level]
  const xpForNext = isMax ? LEVEL_XP[level] : LEVEL_XP[level + 1]
  const progress = isMax
    ? 100
    : Math.round(((xp - xpForLevel) / (xpForNext - xpForLevel)) * 100)
  return { level, rank: RANK_NAMES[level], xpForLevel, xpForNext, progress }
}

export function xpForGrammarSession(correct: number, total: number, dailyStreak: number): number {
  if (total === 0) return 0
  const base = correct * 12
  const perfectBonus = correct === total && total >= 10 ? 50 : 0
  const streakBonus = Math.min(dailyStreak * 8, 64)
  const accuracyBonus = correct / total >= 0.9 ? 30 : correct / total >= 0.75 ? 15 : 0
  return base + perfectBonus + streakBonus + accuracyBonus
}

export function xpForVocabSession(known: number): number {
  return known * 6
}

export function xpForReadingSession(correct: number, total: number): number {
  if (total === 0) return 0
  const base = correct * 18
  const perfectBonus = correct === total && total >= 3 ? 40 : 0
  return base + perfectBonus
}

export function xpForGapFill(correct: number, mode: string, maxCombo: number): number {
  const base = correct * 10
  const modeBonus = mode === 'speed' ? Math.round(base * 0.8) : mode === 'survival' ? Math.round(base * 0.5) : mode === 'combo' ? Math.round(base * 0.4) : 0
  const comboBonus = mode === 'combo' ? Math.min(maxCombo * 5, 60) : 0
  return base + modeBonus + comboBonus
}
