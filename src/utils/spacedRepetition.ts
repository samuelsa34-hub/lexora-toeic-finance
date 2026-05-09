import type { WordFlashcard } from '../types'

export type SRRating = 0 | 1 | 2 | 3  // 0=Again, 1=Hard, 2=Good, 3=Easy

export interface SRResult {
  nextReview: number
  interval: number
  easeFactor: number
  consecutiveCorrect: number
}

const ONE_DAY = 86_400_000
const MIN_EASE = 1.3

/**
 * SM-2 variant. Returns new SR state for a card after a rating.
 * - 0 (Again): reset to 1 day, lower ease
 * - 1 (Hard):  short-step interval, lower ease
 * - 2 (Good):  standard SM-2 progression
 * - 3 (Easy):  faster progression, raise ease
 */
export function applySpacedRepetition(
  rating: SRRating,
  interval: number = 1,
  easeFactor: number = 2.5,
  consecutive: number = 0,
): SRResult {
  const easeAdjust = rating === 0 ? -0.2 : rating === 1 ? -0.15 : rating === 3 ? 0.1 : 0
  const newEase = Math.max(MIN_EASE, easeFactor + easeAdjust)

  let nextInterval: number
  let nextConsecutive: number

  if (rating === 0) {
    nextInterval = 1
    nextConsecutive = 0
  } else if (rating === 1) {
    nextInterval = Math.max(1, Math.ceil(interval * 1.2))
    nextConsecutive = consecutive
  } else if (rating === 2) {
    if (consecutive === 0) nextInterval = 1
    else if (consecutive === 1) nextInterval = 4
    else nextInterval = Math.ceil(interval * newEase)
    nextConsecutive = consecutive + 1
  } else {
    // Easy
    if (consecutive === 0) nextInterval = 4
    else nextInterval = Math.ceil(interval * newEase * 1.3)
    nextConsecutive = consecutive + 1
  }

  return {
    nextReview: Date.now() + nextInterval * ONE_DAY,
    interval: nextInterval,
    easeFactor: newEase,
    consecutiveCorrect: nextConsecutive,
  }
}

/** Returns cards that are due for review today (nextReview <= now, or never reviewed). */
export function getDueFlashcards(cards: WordFlashcard[]): WordFlashcard[] {
  const now = Date.now()
  return cards.filter(c => !c.nextReview || c.nextReview <= now)
}

export function getDueFlashcardCount(cards: WordFlashcard[]): number {
  return getDueFlashcards(cards).length
}
