import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GrammarSession, VocabSession, ReadingSession, ErrorEntry, QuestionAttempt, VocabRatingValue, QuestionCategory, Mission, Part6Session, ActivityEvent, SavedWord, VocabList, WordFlashcard, LearningPathProgressEntry, ProfileVector, PortalId, UserPortals } from '../types'
import { xpForGrammarSession, xpForVocabSession, xpForReadingSession } from '../utils/xpEngine'
import { generateDailyMissions, isNewMissionsDay } from '../utils/missionEngine'
import { applySpacedRepetition, type SRRating } from '../utils/spacedRepetition'

export interface PlacementResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  estimatedScore: number
  estimatedRange: string
  levelBand: string
  categoryAccuracy: Record<string, { correct: number; total: number; pct: number }>
  weakCategories: string[]
  strongCategories: string[]
  recommendedLessonIds: string[]
  completedAt: number
}

interface Profile {
  baseScore: number;
  targetScore: number;
  examDate: string | null;
  dailyGoalMinutes: number;
  streak: number;
  lastStudyDate: string | null;
  totalStudyMinutes: number;
  theme: 'dark' | 'light';
  bootcampDuration: 7 | 10 | 14;
  bootcampStartDate: string | null;
  completedBootcampTasks: string[];
  language: 'en' | 'fr';
  name: string;
  xp: number;
  // ── Placement / Onboarding ────────────────────────────────────────────────
  placementTestCompleted: boolean;
  placementTestCompletedAt: number | null;
  placementResults: PlacementResults | null;
  isLegacyDefault: boolean;   // true for accounts created before this feature
}

interface VariationRecord {
  groupId: string;
  triggeredByQuestionId: number;
  startedAt: number;
  completedAt: number;
  score: number;
  total: number;
  repaired: boolean;
}

interface AppState {
  profile: Profile;
  grammarSessions: GrammarSession[];
  questionHistory: Record<number, QuestionAttempt[]>;
  vocabRatings: Record<string, VocabRatingValue>;
  vocabSessions: VocabSession[];
  readingSessions: ReadingSession[];
  errorNotebook: ErrorEntry[];
  missions: Mission[];
  missionsDate: string | null;
  completedLessons: string[];
  part6Sessions: Part6Session[];
  completedAssignments: string[];
  activityLog: ActivityEvent[];
  alertDismissals: string[];
  // ── Dictionary & Vocabulary system ────────────────────────────────────────
  savedWords: Record<string, SavedWord>;
  vocabLists: VocabList[];
  wordFlashcards: WordFlashcard[];
  recentDictSearches: string[];
  // ── Native Expressions ────────────────────────────────────────────────────
  expressionProgress: Record<string, 'known' | 'learning'>;
  // ── Variation Practice ────────────────────────────────────────────────────
  variationRecords: Record<string, VariationRecord>;
  // ── Grammar Detective ─────────────────────────────────────────────────────
  grammarDetectiveStats: { attempts: number; correct: number; byRole: Record<string, { attempts: number; correct: number }> };
  // ── Learning Path Progress (flags.learningPaths) ─────────────────────────
  learningPathProgress: Record<string, LearningPathProgressEntry> | null;
  // ── Profile Vector (flags.tracks) ────────────────────────────────────────
  profileVector: ProfileVector | null;
  // ── Dual-Portal State (flags.dualPortal) ──────────────────────────────────
  activePortal: PortalId;
  userPortals: UserPortals;

  updateProfile: (updates: Partial<Profile>) => void;
  addGrammarSession: (s: GrammarSession) => void;
  recordAttempt: (a: QuestionAttempt) => void;
  rateVocab: (word: string, rating: VocabRatingValue) => void;
  addVocabSession: (s: VocabSession) => void;
  addReadingSession: (s: ReadingSession) => void;
  addError: (e: Omit<ErrorEntry, 'id' | 'occurrences' | 'lastSeen' | 'resolved'>) => void;
  resolveError: (id: string) => void;
  clearResolvedErrors: () => void;
  completeBootcampTask: (taskId: string) => void;
  addPart6Session: (s: Part6Session) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  completeAssignment: (assignmentId: string) => void;
  logActivity: (event: Omit<ActivityEvent, 'ts'>) => void;
  dismissAlert: (id: string) => void;
  addStudyMinutes: (min: number) => void;
  addXP: (amount: number) => void;
  advanceMission: (missionId: string, delta?: number) => void;
  refreshMissionsIfNeeded: () => void;
  resetAll: () => void;
  // Dictionary actions
  saveWord: (word: string, note?: string) => void;
  unsaveWord: (word: string) => void;
  updateWordNote: (word: string, note: string) => void;
  createVocabList: (name: string, description?: string, color?: string) => string;
  deleteVocabList: (listId: string) => void;
  addWordToList: (word: string, listId: string) => void;
  removeWordFromList: (word: string, listId: string) => void;
  addWordFlashcard: (word: string, front: string, back: string, hint?: string) => void;
  removeWordFlashcard: (id: string) => void;
  markFlashcardReviewed: (id: string) => void;
  reviewFlashcard: (id: string, rating: SRRating) => void;
  addDictSearch: (word: string) => void;
  rateExpression: (id: string, status: 'known' | 'learning') => void;
  logVariationPractice: (triggeredBy: number, groupId: string, score: number, total: number) => void;
  recordGrammarDetective: (role: string, correct: boolean) => void;
  completePlacementTest: (results: PlacementResults) => void;
  updateLearningPathProgress: (pathId: string, stepIndex: number) => void;
  updateProfileVector: (updates: Partial<ProfileVector>) => void;
  switchPortal: (to: PortalId) => void;
  setUserPortals: (updates: Partial<UserPortals>) => void;
}

const defaultProfile: Profile = {
  baseScore: 0,
  targetScore: 785,
  examDate: null,
  dailyGoalMinutes: 60,
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  theme: 'dark',
  bootcampDuration: 14,
  bootcampStartDate: null,
  completedBootcampTasks: [],
  language: 'fr',
  name: 'Warrior',
  xp: 0,
  placementTestCompleted: false,
  placementTestCompletedAt: null,
  placementResults: null,
  isLegacyDefault: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      grammarSessions: [],
      questionHistory: {},
      vocabRatings: {},
      vocabSessions: [],
      readingSessions: [],
      errorNotebook: [],
      missions: [],
      missionsDate: null,
      completedLessons: [],
      part6Sessions: [],
      completedAssignments: [],
      activityLog: [],
      alertDismissals: [],
      savedWords: {},
      vocabLists: [],
      wordFlashcards: [],
      recentDictSearches: [],
      expressionProgress: {},
      variationRecords: {},
      grammarDetectiveStats: { attempts: 0, correct: 0, byRole: {} },
      learningPathProgress: null,
      profileVector: null,
      activePortal: 'english',
      userPortals: { english: true, finance: false, default: 'english' },

      updateProfile: (updates) => set(s => ({ profile: { ...s.profile, ...updates } })),

      addGrammarSession: (session) => {
        const { profile } = get()
        const xp = xpForGrammarSession(session.correct, session.count, profile.streak)
        set(s => ({ grammarSessions: [...s.grammarSessions.slice(-50), session] }));
        get().addStudyMinutes(Math.ceil(session.totalTime / 60));
        get().addXP(xp)
        // advance daily drill mission
        get().advanceMission(`dm_grammar_${new Date().toDateString()}`, session.count)
        // advance weak-cat mission if applicable
        if (session.category && session.category !== 'adaptive' && session.category !== 'all') {
          get().advanceMission(`dm_weak_${new Date().toDateString()}_${session.category}`, session.count)
        }
      },

      recordAttempt: (attempt) => set(s => ({
        questionHistory: {
          ...s.questionHistory,
          [attempt.questionId]: [...(s.questionHistory[attempt.questionId] || []).slice(-5), attempt]
        }
      })),

      rateVocab: (word, rating) => set(s => ({ vocabRatings: { ...s.vocabRatings, [word]: rating } })),

      addVocabSession: (session) => {
        const xp = xpForVocabSession(session.known)
        set(s => ({ vocabSessions: [...s.vocabSessions.slice(-50), session] }));
        get().addStudyMinutes(Math.ceil(session.cardsReviewed / 4));
        get().addXP(xp)
        get().advanceMission(`dm_vocab_${new Date().toDateString()}`, session.cardsReviewed)
      },

      addReadingSession: (session) => {
        const xp = xpForReadingSession(session.correct, session.total)
        set(s => ({ readingSessions: [...s.readingSessions.slice(-20), session] }));
        get().addStudyMinutes(session.total * 1.5);
        get().addXP(xp)
      },

      addPart6Session: (session) => {
        set(s => ({ part6Sessions: [...s.part6Sessions.slice(-30), session] }))
        get().addStudyMinutes(Math.ceil(session.total * 1.2))
      },

      addError: (entry) => set(s => {
        const existing = s.errorNotebook.find(e =>
          e.question === entry.question && !e.resolved
        );
        if (existing) {
          return {
            errorNotebook: s.errorNotebook.map(e =>
              e.id === existing.id
                ? { ...e, occurrences: e.occurrences + 1, lastSeen: Date.now() }
                : e
            )
          };
        }
        const newEntry: ErrorEntry = {
          ...entry,
          id: `err_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          occurrences: 1,
          lastSeen: Date.now(),
          resolved: false,
          dangerLevel: entry.dangerLevel ?? 'high',
        };
        return { errorNotebook: [...s.errorNotebook, newEntry] };
      }),

      resolveError: (id) => {
        set(s => ({
          errorNotebook: s.errorNotebook.map(e => e.id === id ? { ...e, resolved: true } : e)
        }))
        get().advanceMission(`dm_errors_${new Date().toDateString()}`, 1)
      },

      clearResolvedErrors: () => set(s => ({
        errorNotebook: s.errorNotebook.filter(e => !e.resolved)
      })),

      completeLesson: (lessonId, xpReward) => {
        const { completedLessons } = get()
        if (!completedLessons.includes(lessonId)) {
          set(s => ({ completedLessons: [...s.completedLessons, lessonId] }))
          get().addXP(xpReward)
        }
      },

      completeAssignment: (assignmentId) => set(s => ({
        completedAssignments: s.completedAssignments.includes(assignmentId)
          ? s.completedAssignments
          : [...s.completedAssignments, assignmentId],
      })),

      logActivity: (event) => set(s => ({
        activityLog: [...s.activityLog.slice(-99), { ...event, ts: Date.now() }],
      })),

      dismissAlert: (id) => set(s => ({
        alertDismissals: s.alertDismissals.includes(id) ? s.alertDismissals : [...s.alertDismissals, id],
      })),

      completeBootcampTask: (taskId) => set(s => ({
        profile: {
          ...s.profile,
          completedBootcampTasks: s.profile.completedBootcampTasks.includes(taskId)
            ? s.profile.completedBootcampTasks
            : [...s.profile.completedBootcampTasks, taskId]
        }
      })),

      addStudyMinutes: (min) => {
        const today = new Date().toDateString();
        set(s => {
          const isNewDay = s.profile.lastStudyDate !== today;
          const newStreak = isNewDay
            ? (s.profile.lastStudyDate === new Date(Date.now() - 86400000).toDateString()
              ? s.profile.streak + 1
              : 1)
            : s.profile.streak;
          return {
            profile: {
              ...s.profile,
              totalStudyMinutes: s.profile.totalStudyMinutes + min,
              lastStudyDate: today,
              streak: newStreak,
            }
          };
        });
      },

      addXP: (amount) => set(s => ({
        profile: { ...s.profile, xp: s.profile.xp + amount }
      })),

      advanceMission: (missionId, delta = 1) => set(s => ({
        missions: s.missions.map(m => {
          if (m.id !== missionId || m.completed) return m
          const newProgress = Math.min(m.progress + delta, m.target)
          const completed = newProgress >= m.target
          return { ...m, progress: newProgress, completed }
        })
      })),

      refreshMissionsIfNeeded: () => {
        const { missionsDate, errorNotebook } = get()
        if (!isNewMissionsDay(missionsDate)) return
        const store = get()
        const weakCats = getWeakCategories(store)
        const unresolvedErrors = errorNotebook.filter(e => !e.resolved).length
        const newMissions = generateDailyMissions(weakCats, unresolvedErrors)
        set({ missions: newMissions, missionsDate: new Date().toDateString() })
      },

      // ── Dictionary actions ──────────────────────────────────────────────────

      saveWord: (word, note) => set(s => ({
        savedWords: {
          ...s.savedWords,
          [word]: s.savedWords[word]
            ? { ...s.savedWords[word], note: note ?? s.savedWords[word].note }
            : { word, savedAt: Date.now(), listIds: [], note, hasFlashcard: false },
        }
      })),

      unsaveWord: (word) => set(s => {
        const next = { ...s.savedWords }
        delete next[word]
        return { savedWords: next }
      }),

      updateWordNote: (word, note) => set(s => ({
        savedWords: s.savedWords[word]
          ? { ...s.savedWords, [word]: { ...s.savedWords[word], note } }
          : s.savedWords
      })),

      createVocabList: (name, description, color) => {
        const id = `vl_${Date.now()}_${Math.random().toString(36).slice(2)}`
        set(s => ({
          vocabLists: [...s.vocabLists, {
            id, name, description, color, words: [],
            createdAt: Date.now(), updatedAt: Date.now(), source: 'manual' as const,
          }]
        }))
        return id
      },

      deleteVocabList: (listId) => set(s => ({
        vocabLists: s.vocabLists.filter(l => l.id !== listId),
        savedWords: Object.fromEntries(
          Object.entries(s.savedWords).map(([w, sw]) => [
            w, { ...sw, listIds: sw.listIds.filter(id => id !== listId) }
          ])
        ),
      })),

      addWordToList: (word, listId) => set(s => ({
        vocabLists: s.vocabLists.map(l =>
          l.id === listId && !l.words.includes(word)
            ? { ...l, words: [...l.words, word], updatedAt: Date.now() }
            : l
        ),
        savedWords: {
          ...s.savedWords,
          [word]: s.savedWords[word]
            ? { ...s.savedWords[word], listIds: s.savedWords[word].listIds.includes(listId) ? s.savedWords[word].listIds : [...s.savedWords[word].listIds, listId] }
            : { word, savedAt: Date.now(), listIds: [listId], hasFlashcard: false },
        }
      })),

      removeWordFromList: (word, listId) => set(s => ({
        vocabLists: s.vocabLists.map(l =>
          l.id === listId ? { ...l, words: l.words.filter(w => w !== word), updatedAt: Date.now() } : l
        ),
        savedWords: s.savedWords[word]
          ? { ...s.savedWords, [word]: { ...s.savedWords[word], listIds: s.savedWords[word].listIds.filter(id => id !== listId) } }
          : s.savedWords,
      })),

      addWordFlashcard: (word, front, back, hint) => {
        const id = `wf_${Date.now()}_${Math.random().toString(36).slice(2)}`
        set(s => ({
          wordFlashcards: [...s.wordFlashcards, { id, word, front, back, hint, createdAt: Date.now(), reviewed: false }],
          savedWords: s.savedWords[word]
            ? { ...s.savedWords, [word]: { ...s.savedWords[word], hasFlashcard: true } }
            : { ...s.savedWords, [word]: { word, savedAt: Date.now(), listIds: [], hasFlashcard: true } },
        }))
      },

      removeWordFlashcard: (id) => set(s => ({
        wordFlashcards: s.wordFlashcards.filter(f => f.id !== id),
      })),

      markFlashcardReviewed: (id) => set(s => ({
        wordFlashcards: s.wordFlashcards.map(f =>
          f.id === id ? { ...f, reviewed: true, lastReviewedAt: Date.now() } : f
        ),
      })),

      reviewFlashcard: (id, rating) => set(s => ({
        wordFlashcards: s.wordFlashcards.map(f => {
          if (f.id !== id) return f
          const sr = applySpacedRepetition(rating, f.interval, f.easeFactor, f.consecutiveCorrect)
          return {
            ...f,
            reviewed: true,
            lastReviewedAt: Date.now(),
            nextReview: sr.nextReview,
            interval: sr.interval,
            easeFactor: sr.easeFactor,
            consecutiveCorrect: sr.consecutiveCorrect,
          }
        }),
      })),

      addDictSearch: (word) => set(s => {
        const prev = s.recentDictSearches.filter(w => w !== word)
        return { recentDictSearches: [word, ...prev].slice(0, 20) }
      }),

      rateExpression: (id, status) => set(s => ({
        expressionProgress: { ...s.expressionProgress, [id]: status },
      })),

      logVariationPractice: (triggeredBy, groupId, score, total) => {
        const key = `vp_${triggeredBy}_${Date.now()}`
        set(s => ({
          variationRecords: {
            ...s.variationRecords,
            [key]: {
              groupId,
              triggeredByQuestionId: triggeredBy,
              startedAt: Date.now(),
              completedAt: Date.now(),
              score,
              total,
              repaired: score >= Math.ceil(total * 0.6),
            },
          },
        }))
      },

      completePlacementTest: (results) => set(s => ({
        profile: {
          ...s.profile,
          baseScore: results.estimatedScore,
          placementTestCompleted: true,
          placementTestCompletedAt: results.completedAt,
          placementResults: results,
          isLegacyDefault: false,
        },
      })),

      recordGrammarDetective: (role, correct) => set(s => {
        const prev = s.grammarDetectiveStats
        const prevRole = prev.byRole[role] ?? { attempts: 0, correct: 0 }
        return {
          grammarDetectiveStats: {
            attempts: prev.attempts + 1,
            correct: prev.correct + (correct ? 1 : 0),
            byRole: {
              ...prev.byRole,
              [role]: { attempts: prevRole.attempts + 1, correct: prevRole.correct + (correct ? 1 : 0) },
            },
          },
        }
      }),

      updateProfileVector: (updates) => set(s => ({
        profileVector: {
          english:       'not_assessed',
          toeic:         null,
          marketFinance: 'F0',
          amf:           'notTaken',
          cfaL1:         'notTaken',
          aci:           'notTaken',
          trading:       'T0',
          ...(s.profileVector ?? {}),
          ...updates,
        },
      })),

      switchPortal: (to) => set(s => ({
        activePortal: to,
        userPortals: { ...s.userPortals, [to]: true },
      })),

      setUserPortals: (updates) => set(s => ({
        userPortals: { ...s.userPortals, ...updates },
      })),

      updateLearningPathProgress: (pathId, stepIndex) => set(s => {
        const existing = s.learningPathProgress?.[pathId]
        const now = Date.now()
        const entry: LearningPathProgressEntry = existing
          ? {
              ...existing,
              completedSteps: existing.completedSteps.includes(stepIndex)
                ? existing.completedSteps
                : [...existing.completedSteps, stepIndex],
              lastActivityAt: now,
            }
          : { pathId, completedSteps: [stepIndex], startedAt: now, lastActivityAt: now, xpEarned: 0 }
        return { learningPathProgress: { ...(s.learningPathProgress ?? {}), [pathId]: entry } }
      }),

      resetAll: () => set({
        profile: defaultProfile,
        grammarSessions: [],
        questionHistory: {},
        vocabRatings: {},
        vocabSessions: [],
        readingSessions: [],
        errorNotebook: [],
        missions: [],
        missionsDate: null,
        completedLessons: [],
        part6Sessions: [],
        completedAssignments: [],
        activityLog: [],
        alertDismissals: [],
        savedWords: {},
        vocabLists: [],
        wordFlashcards: [],
        recentDictSearches: [],
        expressionProgress: {},
        variationRecords: {},
        grammarDetectiveStats: { attempts: 0, correct: 0, byRole: {} },
        learningPathProgress: null,
        profileVector: null,
        activePortal: 'english',
        userPortals: { english: true, finance: false, default: 'english' },
      }),
    }),
    { name: 'toeic-warroom-v2' }
  )
);

export function estimateScore(store: AppState): { total: number; reading: number; listening: number; assessed: boolean } {
  const { grammarSessions, readingSessions, profile } = store;

  // New user who has not taken the placement test yet
  if (!profile.placementTestCompleted && profile.baseScore === 0 && grammarSessions.length === 0) {
    return { total: 0, reading: 0, listening: 0, assessed: false }
  }

  // Use placement baseline or a reasonable default for legacy users
  const baseline = profile.baseScore > 0 ? profile.baseScore : 500
  let readingScore = Math.round(baseline / 2);

  if (grammarSessions.length > 0) {
    const recent = grammarSessions.slice(-10);
    const acc = recent.reduce((sum, s) => sum + (s.correct / s.count), 0) / recent.length;
    readingScore = 150 + Math.round(acc * 345);
  }

  if (readingSessions.length > 0) {
    const recent = readingSessions.slice(-5);
    const acc = recent.reduce((sum, s) => sum + (s.correct / s.total), 0) / recent.length;
    const readingBoost = Math.round((acc - 0.5) * 100);
    readingScore = Math.min(495, readingScore + readingBoost);
  }

  const listeningScore = Math.round(baseline / 2);
  const total = Math.min(990, Math.max(10, readingScore + listeningScore));
  return { total, reading: readingScore, listening: listeningScore, assessed: true };
}

export function getCategoryAccuracy(store: AppState): Record<string, { correct: number; total: number; pct: number }> {
  const result: Record<string, { correct: number; total: number; pct: number }> = {};
  for (const session of store.grammarSessions) {
    for (const attempt of session.attempts) {
      if (!result[attempt.cat]) result[attempt.cat] = { correct: 0, total: 0, pct: 0 };
      result[attempt.cat].total++;
      if (attempt.correct) result[attempt.cat].correct++;
    }
  }
  for (const cat of Object.keys(result)) {
    result[cat].pct = Math.round(result[cat].correct / result[cat].total * 100);
  }
  return result;
}

export function getWeakCategories(store: AppState): string[] {
  const acc = getCategoryAccuracy(store);
  return Object.entries(acc)
    .filter(([, v]) => v.total >= 3)
    .sort((a, b) => a[1].pct - b[1].pct)
    .slice(0, 3)
    .map(([k]) => k);
}

export type { AppState };
export type { QuestionCategory };
export type { SRRating };
