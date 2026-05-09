// Shared constants across all modules — single source of truth

export const CAT_LABELS: Record<string, string> = {
  // TOEIC Part 5 Core
  word_form: 'Word Form',
  preposition: 'Prepositions',
  conjunction: 'Conjunctions',
  verb: 'Verb Tense',
  pronoun: 'Pronouns',
  article: 'Articles',
  vocab: 'Vocabulary',
  collocation: 'Collocations',
  gerund_infinitive: 'Gerund/Inf.',
  passive: 'Passive Voice',
  relative_clause: 'Relative Clauses',
  // TOEIC Part 5 Advanced
  connector: 'Connectors',
  adjective_adverb: 'Adj vs Adverb',
  false_friend: 'False Friends',
  compound_adj: 'Compound Adj.',
  inversion: 'Inversion',
  future_ability: 'Future Ability',
  reading: 'Reading',
  part5: 'Part 5',
  part6: 'Part 6',
  part7: 'Part 7',
  // English Grammar Module
  tense_perfect: 'Perfect Tenses',
  tense_continuous: 'Continuous Tenses',
  conditionals: 'Conditionals',
  modal_verbs: 'Modal Verbs',
  reported_speech: 'Reported Speech',
  comparative: 'Comparatives',
  quantifiers: 'Quantifiers',
  question_form: 'Question Forms',
  time_clauses: 'Time Clauses',
  agreement: 'Subject-Verb Agreement',
}

export const MODULE_ROUTES: Record<string, string> = {
  grammar: '/grammar',
  gapfill: '/gapfill',
  vocabulary: '/vocabulary',
  reading: '/reading',
  listening: '/listening',
  errors: '/errors',
  strategy: '/strategy',
  mock: '/mock',
  traps: '/traps',
  analytics: '/analytics',
  bootcamp: '/bootcamp',
}

export const MODULE_ICONS: Record<string, string> = {
  grammar: '📝',
  gapfill: '🎮',
  vocabulary: '📚',
  reading: '📖',
  listening: '🎧',
  errors: '🔍',
  strategy: '🗺',
  mock: '🎓',
  traps: '⚠️',
  analytics: '📊',
  bootcamp: '⚡',
}

export const DANGER_COLORS: Record<string, string> = {
  low: 'emerald',
  medium: 'amber',
  high: 'red',
  critical: 'red',
}

export const DIFF_COLORS: Record<string, string> = {
  easy: 'emerald',
  medium: 'amber',
  hard: 'red',
}

export const ANSWER_LABELS = ['A', 'B', 'C', 'D'] as const
