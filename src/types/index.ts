export type QuestionCategory =
  // ── TOEIC Part 5 Core ─────────────────────────────────────────────────────
  | 'word_form' | 'preposition' | 'conjunction' | 'verb' | 'pronoun'
  | 'article' | 'vocab' | 'collocation' | 'gerund_infinitive' | 'passive' | 'relative_clause'
  // ── TOEIC Part 5 Advanced ─────────────────────────────────────────────────
  | 'connector' | 'adjective_adverb' | 'false_friend' | 'compound_adj'
  | 'inversion' | 'future_ability'
  // ── English Grammar Module ────────────────────────────────────────────────
  | 'tense_perfect' | 'tense_continuous' | 'conditionals' | 'modal_verbs'
  | 'reported_speech' | 'comparative' | 'quantifiers' | 'question_form'
  | 'time_clauses' | 'agreement'
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TOEICPart = 'part1' | 'part2' | 'part3' | 'part4' | 'part5' | 'part6' | 'part7';
export type VocabCategory = 'finance' | 'hr' | 'marketing' | 'operations' | 'legal' | 'travel' | 'office' | 'meetings' | 'customer_service' | 'manufacturing' | 'reports';

export interface GrammarQuestion {
  id: number;
  cat: QuestionCategory;
  diff: Difficulty;
  q: string;
  opts: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  exp: string;
  optExps?: [string, string, string, string];
  trap?: string;
  rule?: string;
  tip?: string;
  fr?: string;
  // Extended metadata for Part 5 upgrade
  subtopic?: string;
  trapType?: string;
  tags?: string[];
  linkedDictionaryWords?: string[];
  linkedLessonIds?: string[];
}

export interface VocabWord {
  word: string;
  pos: string;
  cat: VocabCategory;
  fr: string;
  def: string;
  toeicDef: string;
  example: string;
  exampleFr: string;
  collocations: string[];
  memoryTip?: string;
  falseFriend?: string;
  level: 1 | 2 | 3;
}

export interface Passage {
  id: number;
  title: string;
  type: 'email' | 'memo' | 'advertisement' | 'notice' | 'article' | 'form' | 'report';
  difficulty: Difficulty;
  estimatedTime: number;
  wordCount: number;
  text: string;
  questions: PassageQuestion[];
}

export interface PassageQuestion {
  q: string;
  opts: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  type: 'detail' | 'inference' | 'main_idea' | 'vocabulary' | 'not_true' | 'reference';
  exp: string;
  trap?: string;
}

// ── Part 6 — Text Completion ──────────────────────────────────────────────────

export type Part6DocType =
  | 'email' | 'memo' | 'press_release' | 'job_ad'
  | 'notice' | 'advertisement' | 'announcement' | 'business_update'

export type Part6BlankType = 'grammar' | 'vocabulary' | 'collocation' | 'connector' | 'coherence'

export interface Part6Question {
  number: 1 | 2 | 3 | 4
  opts: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  exp: string                               // why the correct answer is right
  optExps: [string, string, string, string] // why each option is right/wrong
  type: Part6BlankType
  fr?: string
}

export interface Part6Passage {
  id: number
  title: string
  docType: Part6DocType
  difficulty: Difficulty
  topic: string
  body: string   // text with {{1}} {{2}} {{3}} {{4}} markers
  questions: [Part6Question, Part6Question, Part6Question, Part6Question]
  linkedLessonId?: string
  tags: string[]
}

export interface Part6Session {
  id: string
  timestamp: number
  passageId: number
  answers: (0 | 1 | 2 | 3 | null)[]
  correct: number
  total: number
}

export interface TrapExample {
  id: number;
  category: string;
  title: string;
  setup: string;
  wrongAnswer: string;
  wrongLogic: string;
  rightAnswer: string;
  rightLogic: string;
  memoCue: string;
  miniExercise?: { q: string; opts: string[]; correct: number; exp: string; };
}

export interface BootcampDay {
  day: number;
  theme: string;
  mission: string;
  tasks: BootcampTask[];
  goal: string;
  timeEstimate: number;
}

export interface BootcampTask {
  id: string;
  label: string;
  detail: string;
  module: string;
  minutes: number;
  priority: 'critical' | 'high' | 'medium';
}

export interface BootcampPlan {
  duration: 7 | 10 | 14;
  name: string;
  days: BootcampDay[];
}

export interface QuestionAttempt {
  questionId: number;
  correct: boolean;
  timeSpent: number;
  selectedAnswer: number;
  cat: QuestionCategory;
  timestamp: number;
}

export interface GrammarSession {
  id: string;
  timestamp: number;
  category: string;
  count: number;
  correct: number;
  totalTime: number;
  attempts: QuestionAttempt[];
}

export interface VocabSession {
  id: string;
  timestamp: number;
  category: string;
  cardsReviewed: number;
  known: number;
}

export interface ReadingSession {
  id: string;
  timestamp: number;
  passageId: number;
  correct: number;
  total: number;
  totalTime: number;
}

export interface ErrorEntry {
  id: string;
  timestamp: number;
  part: TOEICPart;
  category: QuestionCategory | string;
  question: string;
  opts: string[];
  correctAnswer: number;
  userAnswer: number;
  explanation: string;
  trap?: string;
  occurrences: number;
  lastSeen: number;
  resolved: boolean;
  dangerLevel: 'low' | 'medium' | 'high' | 'critical';
}

export type VocabRatingValue = 'known' | 'learning' | 'unknown' | null

// ── Activity / Presence ───────────────────────────────────────────────────────

export type ActivityType =
  | 'login' | 'drill_start' | 'drill_complete'
  | 'lesson_start' | 'lesson_complete'
  | 'part6_start' | 'part6_complete'
  | 'reading_start' | 'reading_complete'
  | 'mock_start' | 'mock_complete'
  | 'vocab_session' | 'topic_open'
  | 'error_made' | 'error_resolved'
  | 'assignment_complete' | 'gapfill_complete'

export interface ActivityEvent {
  ts: number
  type: ActivityType
  label: string
  meta?: { category?: string; score?: number; correct?: number; total?: number; lessonId?: string }
}

export type PresenceStatus = 'active' | 'idle' | 'offline'

// ── Action Plans ─────────────────────────────────────────────────────────────

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low'
export type ActionType = 'drill' | 'lesson' | 'part6' | 'reading' | 'vocab' | 'review_errors' | 'mock' | 'gapfill'

export interface ActionPlanItem {
  id: string
  priority: ActionPriority
  type: ActionType
  title: string
  reason: string
  estimatedMinutes: number
  path: string
  category?: string
  lessonId?: string
}

// ── Alerts ────────────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface PlatformAlert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  action?: { label: string; path: string }
  category?: string
}

// ── Badges ────────────────────────────────────────────────────────────────────

export type BadgeCategory = 'grammar' | 'vocabulary' | 'streak' | 'accuracy' | 'completion' | 'mock' | 'part6' | 'special'

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  category: BadgeCategory
}

// ── Mock Results (enhanced) ───────────────────────────────────────────────────

export interface MockResult {
  id: string
  timestamp: number
  totalScore: number
  listeningScore: number
  readingScore: number
  part5Correct: number
  part5Total: number
  part6Correct: number
  part6Total: number
  part7Correct: number
  part7Total: number
  durationSeconds: number
  weakCategories: string[]
}

// ── Review Together ───────────────────────────────────────────────────────────

export interface ReviewTogetherItem {
  id: string
  studentId: string
  errorId?: string
  topic: string
  note: string
  priority: 'urgent' | 'normal'
  createdAt: number
}

// ── Assignments ───────────────────────────────────────────────────────────────

export type AssignmentType = 'drill' | 'lesson' | 'part6' | 'vocab' | 'reading' | 'custom'

export interface TeacherAssignment {
  id: string
  studentId: string
  title: string
  description?: string
  type: AssignmentType
  category?: string      // for drill/vocab type — maps to QuestionCategory
  lessonId?: string      // for lesson type — maps to courses.ts lesson id
  topicId?: string       // for topic repair — maps to topics.ts topic id
  targetCount?: number   // e.g. "do 20 questions"
  dueDate?: number       // timestamp
  createdAt: number
}

export interface StudentMeta {
  id: string
  name: string
  avatar: string        // emoji
  color: string         // hex accent color
  createdAt: number
  lastStudied: number | null
  targetScore: number
  googleId?: string
  email?: string
  photoUrl?: string
};

export interface Mission {
  id: string
  title: string
  description: string
  type: 'daily' | 'error_repair' | 'weekly' | 'boss'
  target: number
  progress: number
  completed: boolean
  xpReward: number
  icon?: string
  category?: string
}

export type MasteryLevel = 'weak' | 'developing' | 'proficient' | 'mastered'

// ── Topic System ──────────────────────────────────────────────────────────────

export type TopicMasteryLevel =
  | 'not_started'   // never practiced
  | 'introduced'    // seen lesson or <5 attempts
  | 'fragile'       // accuracy < 55%
  | 'developing'    // accuracy 55–74%
  | 'proficient'    // accuracy 75–89%
  | 'mastered'      // accuracy 90%+

export type TopicROI = 'critical' | 'high' | 'medium' | 'low'

export type TopicCategory =
  | 'grammar' | 'vocabulary' | 'traps' | 'strategy' | 'reading'

export interface TopicExample {
  correct: string
  incorrect?: string
  note?: string
}

export interface Topic {
  id: string
  title: string
  subtitle: string
  category: TopicCategory
  subcategory?: string
  description: string
  whyItMatters: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  toeicROI: TopicROI
  toeicParts: TOEICPart[]
  drillCategory?: QuestionCategory    // maps to grammarQuestions.cat
  linkedLessonIds: string[]           // maps to courses.ts lesson IDs
  traps: string[]                     // common traps as strings
  examples: TopicExample[]            // brief pedagogical examples
  memoryTip?: string
  tags: string[]
  icon: string
  frequencyRank: number               // 1 = highest exam frequency
}

export interface TopicMastery {
  topicId: string
  level: TopicMasteryLevel
  accuracy: number          // 0–100
  attemptCount: number
  recentErrorCount: number
  lastPracticed: number | null
  reviewUrgency: 'critical' | 'high' | 'medium' | 'low' | 'none'
  lessonCompleted: boolean
}

// ── Course / Lesson System ────────────────────────────────────────────────────

export type LessonCategory =
  | 'grammar' | 'vocabulary' | 'traps' | 'strategy' | 'reading' | 'business_english'

export type SectionType =
  | 'intro' | 'rule' | 'examples' | 'trap' | 'comparison'
  | 'memory_tip' | 'toeic_tip' | 'french_note' | 'why_wrong'
  | 'table' | 'objectives' | 'flashcard_suggestion'

export interface ExampleSentence {
  en: string
  fr?: string
  isCorrect: boolean
  explanation?: string
}

export interface LessonSection {
  type: SectionType
  title?: string
  content?: string
  contentFr?: string
  examples?: ExampleSentence[]
  // Table section fields (used when type === 'table')
  tableHeaders?: string[]
  tableRows?: string[][]
  tableCaption?: string
  tableNote?: string
  tableAccent?: string
  // List fields (used for objectives, flashcard_suggestion)
  items?: string[]
  itemsFr?: string[]
}

// ── Dictionary System ─────────────────────────────────────────────────────────

export interface DictionaryEntry {
  id: string
  word: string
  pos: string[]                   // e.g. ['noun'], ['verb', 'noun']
  phonetic?: string               // simple pronunciation guide
  definition: string              // original definition
  definitionFr?: string           // French support
  examples: string[]              // 2-3 usage sentences
  examplesFr?: string[]           // French sentence translations
  grammarNote?: string            // usage/grammar note
  plural?: string                 // noun plural form
  irregularForms?: string[]       // verb: [past, past participle]
  collocations?: string[]         // common word combinations
  synonyms?: string[]
  antonyms?: string[]
  phrasalVerbs?: string[]         // e.g. "carry out", "give up"
  verbPrep?: string[]             // e.g. "agree with", "rely on"
  toeicContext?: string           // how/where it appears on TOEIC
  commonMistakes?: string[]       // typical learner errors
  confusedWith?: string[]         // easily confused words
  level: 1 | 2 | 3               // 1=basic, 2=intermediate, 3=advanced
  tags?: string[]                 // for filtering/search
  linkedCategory?: string         // maps to QuestionCategory
}

export interface SavedWord {
  word: string
  savedAt: number
  listIds: string[]
  note?: string
  hasFlashcard: boolean
}

export interface VocabList {
  id: string
  name: string
  description?: string
  words: string[]
  createdAt: number
  updatedAt: number
  source: 'manual' | 'teacher' | 'auto_weak' | 'auto_errors'
  color?: string
  teacherNote?: string
}

export interface WordFlashcard {
  id: string
  word: string
  front: string
  back: string
  hint?: string
  createdAt: number
  reviewed: boolean
  lastReviewedAt?: number
  // Spaced repetition (SM-2)
  nextReview?: number
  interval?: number
  easeFactor?: number
  consecutiveCorrect?: number
}

export interface MiniQuizQuestion {
  q: string
  opts: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  exp: string
  optExps?: [string, string, string, string]
}

export interface Lesson {
  id: string
  title: string
  subtitle: string
  category: LessonCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
  objective: string
  whyItMatters: string
  whyItMattersFr?: string
  xpReward: number
  linkedCategory?: string          // GrammarDrill category to link to
  linkedGapFill?: boolean
  icon?: string
  sections: LessonSection[]
  miniQuiz: MiniQuizQuestion[]
  memorySummary: string[]
  memorySummaryFr?: string[]
  nextLessonIds?: string[]
  objectives?: string[]            // "What you'll learn" bullet points
  linkedDictWords?: string[]       // dictionary entries to surface in Next Actions
  tags?: string[]
}

export type PathStepType = 'lesson' | 'drill' | 'gapfill' | 'mock' | 'review'

export interface PathStep {
  type: PathStepType
  lessonId?: string
  drillCategory?: string
  label: string
  description: string
  estimatedMinutes: number
  // Extended metadata (flags.learningPaths)
  cefrLevel?: CefrLevel
  skillTags?: SkillTag[]
}

export interface LearningPath {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  description: string
  estimatedDays: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  steps: PathStep[]
  xpReward: number
  // Extended metadata (flags.learningPaths) — all optional, additive
  cefrRange?: string
  cefrStart?: CefrLevel
  cefrEnd?: CefrLevel
  targetToeicRange?: string
  toeicTrack?: ToeicTrack
  prerequisites?: string[]
  estimatedHours?: number
  skillTags?: SkillTag[]
  version?: string
  // Extended metadata (flags.tracks / v3) — all optional, additive
  trackId?: TrackId
  studentPersonas?: StudentPersona[]
  targetCert?: string
  // Extended metadata (flags.dualPortal / v4) — optional, additive
  portalId?: ContentPortalId
}

// ── §2 Lexora Broad Suite — Level System ──────────────────────────────────────

export type CefrLevel = 'not_assessed' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type ToeicTrack = 'survival_450' | 'operational_650' | 'advanced_785' | 'expert_900'

export type SkillTag =
  | 'grammar_foundations'
  | 'vocabulary'
  | 'sentence_structure'
  | 'part5'
  | 'part6'
  | 'part7'
  | 'business_english'
  | 'practical_english'
  | 'reading_strategy'
  | 'connectors'
  | 'word_forms'
  | 'traps'
  | 'collocations'
  | 'phrasal_verbs'
  | 'modals'
  | 'tenses'
  | 'conditionals'
  | 'comparatives'
  | 'prepositions'
  | 'pronouns'
  | 'articles'
  | 'relative_clauses'
  | 'passive_voice'
  | 'everyday_vocab'
  | 'false_friends'
  | 'score_prediction'
  | 'spaced_repetition'
  | string  // extensible without type churn

export interface LearningPathProgressEntry {
  pathId: string
  completedSteps: number[]   // step indices completed
  startedAt: number
  lastActivityAt: number
  xpEarned: number
}

// ── §2 v4 — Dual-Portal Architecture ─────────────────────────────────────────

// Which portal a user is viewing (runtime state)
export type PortalId = 'english' | 'finance'

// Portal association for content items (can span both portals)
export type ContentPortalId = PortalId | 'mixed'

// Top-level portal definition
export interface Portal {
  id: PortalId
  title: string
  titleFr: string
  subtitle: string           // working name: "Lexora Lingua" / "Lexora Markets"
  description: string
  descriptionFr: string
  icon: string
  flagKey: string            // FeatureFlag key that gates access to this portal
  defaultTheme: 'light' | 'dark'
  accentColor: string        // CSS hex, used for portal switch button indicator
}

// Which portals the user has access to + their default
export interface UserPortals {
  english: boolean
  finance: boolean
  default: PortalId
}

// ── §2 v3 — Track Architecture ────────────────────────────────────────────────

export type TrackId =
  | 'english'
  | 'market_finance'
  | 'financial_english'
  | 'certifications'
  | 'trading'

// §4 v3 — Market Finance level (F0 = no exposure → F4 = specialist)
export type MarketFinanceLevel = 'F0' | 'F1' | 'F2' | 'F3' | 'F4'

// §4 v3 — Per-certification status
export type CertStatus = 'notTaken' | 'studying' | 'mockReady' | 'examReady' | 'passed'

// §4 v3 — Trading / TA level
export type TradingLevel = 'T0' | 'T1' | 'T2' | 'T3'

// §4 v3 — Student persona tags (for path targeting)
export type StudentPersona =
  | 'st_intern'      // Sales & Trading internship applicant
  | 'ib_analyst'     // Investment Banking analyst applicant
  | 'asset_mgmt'     // Asset Management / hedge fund applicant
  | 'amf_prep'       // AMF certification candidate
  | 'cfa_prep'       // CFA Level 1 candidate
  | 'aci_prep'       // ACI Dealing Certificate candidate
  | 'general'        // General English / TOEIC improvement

// §4 v3 — Profile vector: one level per active track
export interface ProfileVector {
  english: CefrLevel
  toeic: number | null          // estimated TOEIC score, null = not assessed
  marketFinance: MarketFinanceLevel
  amf: CertStatus
  cfaL1: CertStatus
  aci: CertStatus
  trading: TradingLevel
  // §5 v4 — Financial English axis (optional, additive — populated by FE probe)
  financialEnglish?: CefrLevel | null
}

// ── LEXORA Finance — Content System ──────────────────────────────────────────

export type FinanceModuleStatus = 'available' | 'beta' | 'coming_soon'

export interface FinanceModule {
  id: string
  level: MarketFinanceLevel | 'F5'
  title: string
  titleFr: string
  description: string
  descriptionFr: string
  topics: string[]
  status: FinanceModuleStatus
  icon: string
  color: string
  estimatedHours: number
  order: number
  route?: string
}

export type FinanceCategory =
  | 'fixed_income' | 'derivatives' | 'equity' | 'macro'
  | 'trading' | 'risk' | 'structured' | 'fx' | 'credit' | 'general'

export interface FinanceDictEntry {
  id: string
  term: string
  termFr: string
  category: FinanceCategory
  definition: string
  definitionFr: string
  simpleExplanation: string
  professionalExplanation: string
  example: string
  marketContext: string
  collocations: string[]
  relatedTerms: string[]
  interviewAngle?: string
  formula?: string
}

export type InterviewSection =
  | 'technical' | 'markets' | 'trade_ideas' | 'behavioral' | 'brainteasers'

export type InterviewRole = 'sales_trading' | 'ib' | 'asset_mgmt' | 'all'

export interface FinanceInterviewQ {
  id: string
  question: string
  section: InterviewSection
  roles: InterviewRole[]
  difficulty: 1 | 2 | 3
  shortAnswer: string
  detailedAnswer: string
  commonMistakes: string[]
  vocabulary: string[]
  followUps: string[]
}

export interface FinanceExpression {
  id: string
  expression: string
  englishMeaning: string
  frenchExplanation: string
  marketContext: string
  example: string
  toeicConnection?: string
  category: 'rates' | 'equity' | 'credit' | 'fx' | 'macro' | 'general'
}

// ── Phrasal Verbs System ──────────────────────────────────────────────────────

export type PhrasalVerbCategory =
  | 'work_career'        // set up, call in, take apart…
  | 'communication'      // point out, bring up, go along with…
  | 'movement_travel'    // take off, show up, run into…
  | 'emotions_mental'    // fall for, get over, let down…
  | 'general_action'     // figure out, work out, get around to…

export type PhrasalVerbSet = 1 | 2 | 3 | 4

export interface PhrasalVerbEntry {
  id: string
  verb: string              // full phrasal verb, e.g. "go along with"
  base: string              // base verb, e.g. "go"
  particle: string          // particle(s), e.g. "along with"
  set: PhrasalVerbSet
  category: PhrasalVerbCategory
  definition: string
  definitionFr: string
  example: string
  exampleFr: string
  toeicContext?: string
  synonyms?: string[]
  separable: boolean        // can object split the verb, e.g. "pick it out" ✓ / "look after him" ✓ but particle stays
  level: 1 | 2 | 3
}

// §2 v3 — Track (top-level content unit)
export interface Track {
  id: TrackId
  title: string
  titleFr: string
  description: string
  descriptionFr: string
  icon: string
  order: number
  flagKey: string               // FeatureFlag key that gates this track in UI
  color: string
  studentPersonas: StudentPersona[]
  // §2 v4 — portal association (optional, additive)
  portalId?: ContentPortalId
}
