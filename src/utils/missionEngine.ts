import type { Mission } from '../types'
import { CAT_LABELS } from './constants'

export function generateDailyMissions(weakCats: string[], unresolvedErrors: number): Mission[] {
  const today = new Date().toDateString()
  const missions: Mission[] = []

  // Always: grammar drill mission
  missions.push({
    id: `dm_grammar_${today}`,
    title: 'Daily Drill',
    description: 'Answer 20 grammar questions',
    type: 'daily',
    target: 20,
    progress: 0,
    completed: false,
    xpReward: 80,
    icon: '📝',
  })

  // Weak area mission
  if (weakCats.length > 0) {
    const cat = weakCats[0]
    missions.push({
      id: `dm_weak_${today}_${cat}`,
      title: 'Target Weakness',
      description: `Drill ${CAT_LABELS[cat] || cat} — your gap zone`,
      type: 'daily',
      target: 10,
      progress: 0,
      completed: false,
      xpReward: 100,
      icon: '🎯',
      category: cat,
    })
  }

  // Vocab mission
  missions.push({
    id: `dm_vocab_${today}`,
    title: 'Vocab Sprint',
    description: 'Rate 10 vocabulary flashcards',
    type: 'daily',
    target: 10,
    progress: 0,
    completed: false,
    xpReward: 50,
    icon: '📚',
  })

  // Error repair mission
  if (unresolvedErrors >= 3) {
    missions.push({
      id: `dm_errors_${today}`,
      title: 'Error Repair',
      description: `Resolve ${Math.min(3, unresolvedErrors)} notebook errors`,
      type: 'error_repair',
      target: Math.min(3, unresolvedErrors),
      progress: 0,
      completed: false,
      xpReward: 120,
      icon: '🔧',
    })
  }

  return missions
}

export function isNewMissionsDay(missionsDate: string | null): boolean {
  return missionsDate !== new Date().toDateString()
}
