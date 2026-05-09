export interface PlacementQuestion {
  id: number
  cat: string
  q: string
  opts: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  exp: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const placementQuestions: PlacementQuestion[] = [
  // ── EASY (8 questions) ─────────────────────────────────────────────────────

  {
    id: 1,
    cat: 'pronoun',
    difficulty: 'easy',
    q: 'The manager informed ___ team about the changes during the meeting.',
    opts: ['his', 'him', 'he', 'himself'],
    correct: 0,
    exp: '"His" is a possessive adjective modifying the noun "team." "Him" is an object pronoun, "he" is a subject pronoun.',
  },
  {
    id: 2,
    cat: 'preposition',
    difficulty: 'easy',
    q: 'The quarterly review meeting is scheduled ___ 10 AM on Monday.',
    opts: ['in', 'on', 'at', 'by'],
    correct: 2,
    exp: '"At" is used for specific times (at 10 AM, at noon). "On" is used for days.',
  },
  {
    id: 3,
    cat: 'verb',
    difficulty: 'easy',
    q: 'The annual report ___ by the finance team last Friday.',
    opts: ['submits', 'submitted', 'was submitted', 'has submitted'],
    correct: 2,
    exp: '"Was submitted" (passive voice, past) is correct. The subject (report) receives the action, so passive is needed.',
  },
  {
    id: 4,
    cat: 'connector',
    difficulty: 'easy',
    q: 'Sales declined in Q3; ___, the company launched a major recovery plan.',
    opts: ['however', 'because', 'although', 'while'],
    correct: 0,
    exp: '"However" signals a contrast/pivot. The semicolon before it confirms this is a linking adverb between two clauses.',
  },
  {
    id: 5,
    cat: 'word_form',
    difficulty: 'easy',
    q: 'The CEO made an important ___ to expand into the Asian market.',
    opts: ['decide', 'decisive', 'decidedly', 'decision'],
    correct: 3,
    exp: 'A noun ("decision") is needed after the adjective "important" and before the infinitive "to expand."',
  },
  {
    id: 6,
    cat: 'vocab',
    difficulty: 'easy',
    q: 'Employees must ___ their expense reports within 30 days of travel.',
    opts: ['deliver', 'submit', 'achieve', 'perform'],
    correct: 1,
    exp: '"Submit" is the standard TOEIC collocation for forms and reports. You submit documents, reports, and applications.',
  },
  {
    id: 7,
    cat: 'adjective_adverb',
    difficulty: 'easy',
    q: 'The team worked ___ to complete the project ahead of schedule.',
    opts: ['efficient', 'efficiency', 'efficiently', 'more efficient'],
    correct: 2,
    exp: '"Efficiently" is an adverb modifying the verb "worked." Only adverbs modify verbs.',
  },
  {
    id: 8,
    cat: 'preposition',
    difficulty: 'easy',
    q: 'Ms. Park is responsible ___ managing the entire supply chain.',
    opts: ['to', 'of', 'for', 'with'],
    correct: 2,
    exp: '"Responsible for" is a fixed collocation. "Responsible for doing something" = in charge of it.',
  },

  // ── MEDIUM (12 questions) ─────────────────────────────────────────────────

  {
    id: 9,
    cat: 'pronoun',
    difficulty: 'medium',
    q: 'The director asked the team to send ___ the final report before noon.',
    opts: ['he', 'his', 'him', 'himself'],
    correct: 2,
    exp: '"Him" is an object pronoun — it is the indirect object of "send." Subject pronouns (he) cannot follow a verb directly.',
  },
  {
    id: 10,
    cat: 'connector',
    difficulty: 'medium',
    q: '___ the heavy rain, the outdoor conference continued as planned.',
    opts: ['Although', 'Despite', 'Even though', 'Because'],
    correct: 1,
    exp: '"Despite" is a preposition followed by a noun phrase ("the heavy rain"). "Although/Even though" require a full clause (subject + verb).',
  },
  {
    id: 11,
    cat: 'verb',
    difficulty: 'medium',
    q: 'The new regulations ___ into effect next quarter.',
    opts: ['come', 'will come', 'came', 'have come'],
    correct: 1,
    exp: '"Next quarter" indicates future time, requiring "will come." "Come" (present) doesn\'t fit a future time reference.',
  },
  {
    id: 12,
    cat: 'word_form',
    difficulty: 'medium',
    q: 'Her thorough ___ of the contract revealed several inconsistencies.',
    opts: ['analyze', 'analytical', 'analyst', 'analysis'],
    correct: 3,
    exp: '"Analysis" is the noun form of "analyze." "Her ___ of" requires a noun: her analysis of the contract.',
  },
  {
    id: 13,
    cat: 'comparative',
    difficulty: 'medium',
    q: 'The updated software is ___ than the version released last year.',
    opts: ['more reliable', 'most reliable', 'reliably', 'reliably more'],
    correct: 0,
    exp: '"More reliable" is the correct comparative form for a two-syllable+ adjective. "Most reliable" is superlative (used when comparing 3+).',
  },
  {
    id: 14,
    cat: 'adjective_adverb',
    difficulty: 'medium',
    q: 'Profitability this quarter was ___ higher than analysts had predicted.',
    opts: ['considerable', 'consideration', 'considerably', 'consider'],
    correct: 2,
    exp: '"Considerably" is an adverb modifying the adjective "higher." Adverbs, not adjectives, modify other adjectives.',
  },
  {
    id: 15,
    cat: 'vocab',
    difficulty: 'medium',
    q: 'The merger is expected to ___ in significant operational savings.',
    opts: ['result', 'cause', 'make', 'bring'],
    correct: 0,
    exp: '"Result in" is the correct collocation meaning "to lead to a result." "Result in savings" is standard business English.',
  },
  {
    id: 16,
    cat: 'connector',
    difficulty: 'medium',
    q: 'The candidate had excellent qualifications; ___, she lacked direct industry experience.',
    opts: ['therefore', 'meanwhile', 'nonetheless', 'whereas'],
    correct: 2,
    exp: '"Nonetheless" signals contrast — she had good qualifications BUT still lacked experience. "Therefore" would show a consequence, not contrast.',
  },
  {
    id: 17,
    cat: 'word_form',
    difficulty: 'medium',
    q: 'The successful ___ of the new product line exceeded all expectations.',
    opts: ['launched', 'launching', 'launch', 'launchable'],
    correct: 2,
    exp: '"Launch" is the noun needed after the adjective "successful" and the determiner "The." "Launching" as a gerund would need a different structure.',
  },
  {
    id: 18,
    cat: 'verb',
    difficulty: 'medium',
    q: 'By the time the auditors arrived, the accounting team ___ all documents.',
    opts: ['prepared', 'has prepared', 'had prepared', 'prepares'],
    correct: 2,
    exp: '"Had prepared" (past perfect) shows an action completed before another past action ("auditors arrived"). This is a classic TOEIC sequence-of-events pattern.',
  },
  {
    id: 19,
    cat: 'preposition',
    difficulty: 'medium',
    q: 'The service contract is due to expire ___ the end of March.',
    opts: ['in', 'at', 'by', 'on'],
    correct: 2,
    exp: '"By" means "no later than" — the contract expires at or before the end of March. "On" would specify a single day.',
  },
  {
    id: 20,
    cat: 'vocab',
    difficulty: 'medium',
    q: 'We need to ___ the budget before the board meeting next week.',
    opts: ['finalize', 'finish', 'complete', 'close'],
    correct: 0,
    exp: '"Finalize" is the precise business English term for putting the last definitive touches on a document. It is the most natural TOEIC collocate for "budget" or "plan."',
  },

  // ── HARD (5 questions) ────────────────────────────────────────────────────

  {
    id: 21,
    cat: 'adjective_adverb',
    difficulty: 'hard',
    q: 'After the restructuring, investor confidence appeared ___.',
    opts: ['strongly', 'strong', 'strength', 'strengthen'],
    correct: 1,
    exp: '"Appear" is a linking verb. After linking verbs, use an adjective (strong) to describe the subject, NOT an adverb (strongly). This is the most common Part 5 trap.',
  },
  {
    id: 22,
    cat: 'verb',
    difficulty: 'hard',
    q: 'If the company ___ its marketing strategy, revenues would likely improve.',
    opts: ['revises', 'revised', 'will revise', 'revising'],
    correct: 1,
    exp: '"Revised" is the past form used in a Type 2 conditional (hypothetical). Structure: "If + past simple, would + base verb." This tests unreal present/future conditions.',
  },
  {
    id: 23,
    cat: 'word_form',
    difficulty: 'hard',
    q: 'The consultant\'s ___ approach to the supply chain problem impressed the board.',
    opts: ['innovate', 'innovative', 'innovatively', 'innovation'],
    correct: 1,
    exp: '"Innovative" is the adjective modifying "approach" (a noun). "Innovatively" is an adverb (modifies verbs/adjectives), "innovation" is a noun.',
  },
  {
    id: 24,
    cat: 'connector',
    difficulty: 'hard',
    q: '_____ customer satisfaction scores drop below 80%, the team must submit a remediation plan.',
    opts: ['Although', 'Since', 'Should', 'Unless'],
    correct: 3,
    exp: '"Unless" means "except if / if not." The sentence means: if scores do NOT stay above 80%, submit a plan. This tests the conditional meaning of "unless."',
  },
  {
    id: 25,
    cat: 'comparative',
    difficulty: 'hard',
    q: 'The ___ qualified applicant will be offered the position regardless of seniority.',
    opts: ['more', 'most', 'much', 'many'],
    correct: 1,
    exp: '"Most qualified" is the superlative — selecting the single best from a group. "More qualified" would compare only two candidates.',
  },
]

// Category labels for display
export const PLACEMENT_CAT_LABELS: Record<string, string> = {
  pronoun: 'Pronouns',
  preposition: 'Prepositions',
  verb: 'Verb Forms & Tense',
  connector: 'Connectors & Conjunctions',
  word_form: 'Word Forms',
  vocab: 'Business Vocabulary',
  adjective_adverb: 'Adjective vs Adverb',
  comparative: 'Comparatives & Superlatives',
}

// Score → level band mapping
export function scoreToBand(pct: number): { range: string; level: string; midpoint: number } {
  if (pct >= 0.88) return { range: '900+',    level: 'Near Native / Expert',   midpoint: 930 }
  if (pct >= 0.76) return { range: '785–900', level: 'Advanced',               midpoint: 843 }
  if (pct >= 0.60) return { range: '650–785', level: 'Upper Intermediate',     midpoint: 718 }
  if (pct >= 0.40) return { range: '500–650', level: 'Intermediate',           midpoint: 575 }
  if (pct >= 0.20) return { range: '300–500', level: 'Elementary',             midpoint: 400 }
  return              { range: '0–300',   level: 'Beginner',               midpoint: 200 }
}

// Category → recommended lesson ID
export const CAT_TO_LESSON: Record<string, string> = {
  adjective_adverb: 'adjective_adverb',
  verb: 'modal_verbs',
  connector: 'conjunction',
  word_form: 'word_form',
  pronoun: 'pronouns',
  preposition: 'preposition',
  comparative: 'adjective_adverb',
  vocab: 'vocab',
}
