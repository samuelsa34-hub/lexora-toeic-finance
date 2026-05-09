import React, { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Clock, BookOpen, Brain, TrendingUp, Zap, Target, ChevronRight, BarChart2, BookMarked, AlertTriangle, Shield, GraduationCap, ClipboardList, CheckCircle2, Gamepad2, Library, FileText, Timer, Sparkles, FlaskConical } from 'lucide-react'
import { useAppStore, estimateScore, getCategoryAccuracy, getWeakCategories } from '../../store/useAppStore'
import { getDueFlashcardCount } from '../../utils/spacedRepetition'
import { useRegistryStore } from '../../store/useRegistryStore'
import { useThemeStore } from '../../store/useThemeStore'
import { bootcampPlans } from '../../data/bootcampPlans'
import { ProgressRing } from '../../components/ui/ProgressRing'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { projectedScoreIn7Days } from '../../utils/scoreEngine'
import { CAT_LABELS } from '../../utils/constants'
import { levelFromXP, RANK_COLORS, RANK_ICONS } from '../../utils/xpEngine'
import { getRecommendedLesson } from '../../utils/lessonEngine'
import { getRecommendedTopics, MASTERY_COLORS, MASTERY_LABELS, CATEGORY_ACCENT, getTopicCTA } from '../../utils/topicEngine'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Mission } from '../../types'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const store = useAppStore()
  const { profile, grammarSessions, readingSessions, vocabRatings, errorNotebook, completeBootcampTask, missions, refreshMissionsIfNeeded, wordFlashcards } = store
  const dueFlashcardCount = getDueFlashcardCount(wordFlashcards)
  const score = estimateScore(store)
  const weakCats = getWeakCategories(store)
  const catAcc = getCategoryAccuracy(store)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const chartTickColor = isDark ? '#64748B' : '#78716C'
  const chartTooltipBg = isDark ? '#0D1626' : '#FFFFFF'
  const chartTooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(28,24,20,0.09)'
  const chartLabelColor = isDark ? '#64748B' : '#78716C'

  useEffect(() => { refreshMissionsIfNeeded() }, [])

  const totalQuestionsAnswered = grammarSessions.reduce((s, sess) => s + sess.count, 0)
  const vocabKnown = Object.values(vocabRatings).filter(r => r === 'known').length
  const unresolvedErrors = errorNotebook.filter(e => !e.resolved).length

  const levelInfo = levelFromXP(profile.xp)
  const rankColor = RANK_COLORS[levelInfo.rank]
  const rankIcon = RANK_ICONS[levelInfo.rank]

  const currentBootcampPlan = useMemo(() => {
    return bootcampPlans.find(p => p.duration === profile.bootcampDuration) || bootcampPlans[2]
  }, [profile.bootcampDuration])

  const currentDay = useMemo(() => {
    if (!profile.bootcampStartDate) return currentBootcampPlan.days[0]
    const start = new Date(profile.bootcampStartDate)
    const today = new Date()
    const dayIndex = Math.floor((today.getTime() - start.getTime()) / 86400000)
    const clampedIndex = Math.max(0, Math.min(dayIndex, currentBootcampPlan.days.length - 1))
    return currentBootcampPlan.days[clampedIndex]
  }, [profile.bootcampStartDate, currentBootcampPlan])

  const daysUntilExam = useMemo(() => {
    if (!profile.examDate) return null
    const diff = new Date(profile.examDate).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / 86400000))
  }, [profile.examDate])

  const recentSessions = [...grammarSessions].reverse().slice(0, 4)

  const hasData = grammarSessions.length >= 2
  const recentAccuracy = grammarSessions.length > 0
    ? grammarSessions.slice(-5).reduce((s, sess) => s + sess.correct / sess.count, 0) / Math.min(5, grammarSessions.length)
    : null

  const proj7 = recentAccuracy !== null ? projectedScoreIn7Days(score.total, recentAccuracy) : null

  const chartData = grammarSessions.slice(-8).map((sess, i) => ({
    name: `S${i + 1}`,
    pct: Math.round(sess.correct / sess.count * 100),
  }))

  const completedTodayTasks = currentDay.tasks.filter(t =>
    profile.completedBootcampTasks.includes(t.id)
  ).length

  const targetPct = Math.min(100, Math.round((score.total / profile.targetScore) * 100))

  const activeMissions = missions.filter(m => !m.completed)
  const completedMissions = missions.filter(m => m.completed)

  const completedLessons = useAppStore(s => s.completedLessons)
  const recommendedLesson = useMemo(
    () => getRecommendedLesson(weakCats, completedLessons),
    [weakCats, completedLessons]
  )

  const priorityTopics = useMemo(
    () => getRecommendedTopics(store, 3),
    [store.grammarSessions, store.errorNotebook, store.completedLessons]
  )

  const registry = useRegistryStore()
  const myAssignments = useMemo(() => {
    if (!registry.currentStudentId) return []
    return registry.assignments
      .filter(a => a.studentId === registry.currentStudentId)
      .sort((a, b) => (a.dueDate ?? Infinity) - (b.dueDate ?? Infinity))
  }, [registry.assignments, registry.currentStudentId])
  const pendingAssignments = myAssignments.filter(a => !store.completedAssignments.includes(a.id))

  const todaysFocus = useMemo(() => {
    const overdueAssign = pendingAssignments.find(a => a.dueDate && a.dueDate < Date.now()) ?? null
    const topAssign = overdueAssign ?? (pendingAssignments[0] ?? null)
    const topWeak = weakCats[0] ?? null
    if (topAssign) return { kind: 'assign' as const, assign: topAssign, overdue: overdueAssign !== null }
    if (topWeak) return { kind: 'weak' as const, cat: topWeak }
    if (recommendedLesson) return { kind: 'lesson' as const }
    return null
  }, [pendingAssignments, weakCats, recommendedLesson])

  const isLegacyUnassessed = profile.isLegacyDefault && !profile.placementTestCompleted
  const isAssessed = profile.placementTestCompleted

  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-6 max-w-6xl mx-auto pb-24 sm:pb-6 page-enter">

      {/* Legacy recalibration banner */}
      {isLegacyUnassessed && (
        <button
          onClick={() => navigate('/placement')}
          className="w-full text-left rounded-xl p-4 flex items-start gap-3 transition-all hover:opacity-90"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.22)' }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.15)' }}>
            <FlaskConical className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-stone-900 dark:text-white mb-0.5">
              Calibrate your level with a placement test
            </p>
            <p className="text-xs text-stone-400 dark:text-slate-500">
              Your score is estimated from defaults. Take 25 questions to get an accurate baseline and personalized plan.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
            Day {currentDay.day} of {profile.bootcampDuration} · {currentDay.theme}
          </p>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight leading-tight">
            {getGreeting()},{' '}
            <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="text-stone-400 dark:text-slate-500 text-sm mt-1 leading-snug max-w-xs">{currentDay.mission}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {daysUntilExam !== null && (
            <Badge variant={daysUntilExam <= 3 ? 'red' : daysUntilExam <= 7 ? 'amber' : 'indigo'}>
              {daysUntilExam === 0 ? 'Exam today!' : `${daysUntilExam}d to exam`}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <Zap className="w-3 h-3" />
            {profile.xp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      {todaysFocus && (
        <div className="rounded-xl p-4" style={{
          background: todaysFocus.kind === 'assign'
            ? (todaysFocus.overdue ? 'rgba(239,68,68,0.06)' : 'rgba(139,92,246,0.06)')
            : todaysFocus.kind === 'weak' ? 'rgba(245,158,11,0.06)' : 'rgba(99,102,241,0.06)',
          border: `1px solid ${todaysFocus.kind === 'assign'
            ? (todaysFocus.overdue ? 'rgba(239,68,68,0.22)' : 'rgba(139,92,246,0.22)')
            : todaysFocus.kind === 'weak' ? 'rgba(245,158,11,0.22)' : 'rgba(99,102,241,0.22)'}`,
        }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background: todaysFocus.kind === 'assign'
                    ? (todaysFocus.overdue ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.12)')
                    : todaysFocus.kind === 'weak' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
                }}>
                {todaysFocus.kind === 'assign' ? '📋' : todaysFocus.kind === 'weak' ? '⚠️' : '📖'}
              </div>
              <div className="min-w-0">
                <div className="mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: todaysFocus.kind === 'assign' ? (todaysFocus.overdue ? '#DC2626' : '#7C3AED') : todaysFocus.kind === 'weak' ? '#D97706' : '#4F46E5' }}>
                    {todaysFocus.kind === 'assign' ? (todaysFocus.overdue ? '⚡ OVERDUE TASK' : '📌 TEACHER ASSIGNED') : todaysFocus.kind === 'weak' ? '⚠ TOP WEAKNESS' : '→ NEXT UP'}
                  </span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                  {todaysFocus.kind === 'assign'
                    ? todaysFocus.assign.title
                    : todaysFocus.kind === 'weak'
                    ? `Drill ${CAT_LABELS[todaysFocus.cat] || todaysFocus.cat} — your weakest area`
                    : recommendedLesson?.title ?? 'Recommended Lesson'}
                </p>
                <p className="text-xs text-stone-400 dark:text-slate-500 mt-0.5">
                  {todaysFocus.kind === 'assign'
                    ? (todaysFocus.assign.description || `${todaysFocus.assign.type} assignment`)
                    : todaysFocus.kind === 'weak'
                    ? `${catAcc[todaysFocus.cat]?.pct ?? '?'}% accuracy · needs focused practice`
                    : (recommendedLesson?.subtitle ?? 'Continue your lesson path')}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (todaysFocus.kind === 'assign') {
                  const a = todaysFocus.assign
                  if (a.type === 'drill' && a.category) navigate('/grammar', { state: { category: a.category } })
                  else if (a.type === 'lesson' && a.lessonId) navigate(`/courses/${a.lessonId}`, { state: { returnTo: '/' } })
                  else if (a.type === 'vocab') navigate('/vocabulary')
                  else if (a.type === 'part6') navigate('/part6')
                  else if (a.type === 'custom' && a.topicId) navigate(`/topics/${a.topicId}`)
                  else navigate('/grammar')
                } else if (todaysFocus.kind === 'weak') {
                  navigate('/grammar', { state: { category: todaysFocus.cat } })
                } else {
                  navigate(`/courses/${recommendedLesson?.id}`, { state: { returnTo: '/' } })
                }
              }}
              className="flex-shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: todaysFocus.kind === 'assign'
                  ? (todaysFocus.overdue ? 'rgba(239,68,68,0.10)' : 'rgba(139,92,246,0.10)')
                  : todaysFocus.kind === 'weak' ? 'rgba(245,158,11,0.10)' : 'rgba(99,102,241,0.10)',
                color: todaysFocus.kind === 'assign'
                  ? (todaysFocus.overdue ? '#DC2626' : '#7C3AED')
                  : todaysFocus.kind === 'weak' ? '#D97706' : '#4F46E5',
                border: `1px solid ${todaysFocus.kind === 'assign'
                  ? (todaysFocus.overdue ? 'rgba(239,68,68,0.25)' : 'rgba(139,92,246,0.25)')
                  : todaysFocus.kind === 'weak' ? 'rgba(245,158,11,0.25)' : 'rgba(99,102,241,0.25)'}`,
              }}>
              Start <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {weakCats.length > (todaysFocus.kind === 'weak' ? 1 : 0) && (
            <div className="flex items-center gap-2 mt-3 pt-3 flex-wrap" style={{ borderTop: '1px solid var(--dp-border-sm)' }}>
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Also fix:</span>
              {weakCats.slice(todaysFocus.kind === 'weak' ? 1 : 0, 4).map(cat => (
                <button key={cat} onClick={() => navigate('/grammar', { state: { category: cat } })}
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors hover:opacity-80"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)', color: '#D97706' }}>
                  {CAT_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rank / XP Bar */}
      <div className="rounded-xl border p-4 flex items-center gap-4"
        style={{ borderColor: `${rankColor}28`, background: `${rankColor}06` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${rankColor}12`, border: `1px solid ${rankColor}28` }}>
          {rankIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: rankColor }}>{levelInfo.rank}</span>
              <span className="text-xs text-stone-400 dark:text-slate-500">Level {levelInfo.level}</span>
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Zap className="w-3 h-3" /> {profile.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 bg-stone-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progress}%`, background: `linear-gradient(90deg, ${rankColor}, ${rankColor}99)` }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-stone-400 dark:text-slate-500">
              {levelInfo.level < 9
                ? `${(levelInfo.xpForNext - profile.xp).toLocaleString()} XP to Level ${levelInfo.level + 1}`
                : 'Max Level'}
            </span>
            <span className="text-xs text-stone-400 dark:text-slate-500">{levelInfo.progress}%</span>
          </div>
        </div>
      </div>

      {/* Score Hero */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider">
            {isAssessed ? 'Estimated Score' : 'Score Level'}
          </h2>
          {isAssessed && (
            <span className="text-xs text-stone-400 dark:text-slate-500">{grammarSessions.length} sessions tracked</span>
          )}
          {!isAssessed && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.10)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
              Not assessed yet
            </span>
          )}
        </div>

        {/* Not assessed state */}
        {!isAssessed && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)' }}>
              <FlaskConical className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-stone-900 dark:text-white mb-1">Take the placement test</p>
              <p className="text-sm text-stone-400 dark:text-slate-500 max-w-xs">
                25 questions · ~8 minutes · Get your estimated TOEIC range and personalized learning plan
              </p>
            </div>
            <button onClick={() => navigate('/placement')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', cursor: 'pointer' }}>
              Start Placement Test <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Assessed state */}
        {isAssessed && (
          <div className="flex flex-wrap items-center justify-around gap-6">
            <div className="flex flex-col items-center">
              <ProgressRing value={score.total} max={990} size={110} color="#6366F1"
                label={String(score.total)} sublabel="Total" />
              <span className="text-xs text-stone-400 dark:text-slate-500 mt-2">/ 990</span>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={score.reading} max={495} size={90} color="#8B5CF6"
                label={String(score.reading)} sublabel="Reading" />
              <span className="text-xs text-stone-400 dark:text-slate-500 mt-2">/ 495</span>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={score.listening} max={495} size={90} color="#EC4899"
                label={String(score.listening)} sublabel="Listening" />
              <span className="text-xs text-stone-400 dark:text-slate-500 mt-2">/ 495</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500 dark:text-slate-400">Target: {profile.targetScore}</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{targetPct}%</span>
              </div>
              <div className="h-2 bg-stone-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${targetPct}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />
              </div>
              <p className="text-xs text-stone-400 dark:text-slate-500 mt-2">
                {profile.targetScore - score.total > 0
                  ? `${profile.targetScore - score.total} points to target`
                  : 'Target reached!'}
              </p>
              {profile.placementResults && (
                <div className="mt-3 p-3 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
                  <Target className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-stone-700 dark:text-slate-300">
                    Baseline: <strong className="text-indigo-400">{profile.placementResults.estimatedRange}</strong>
                    {' · '}{profile.placementResults.levelBand}
                  </span>
                </div>
              )}
              {proj7 !== null && (
                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span className="text-xs text-stone-700 dark:text-slate-300">
                      7-day projection: <strong className="text-indigo-600 dark:text-indigo-400">+{proj7 - score.total} pts</strong>
                    </span>
                  </div>
                </div>
              )}
              {proj7 === null && (
                <div className="mt-3 p-3 bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.07] rounded-lg">
                  <p className="text-xs text-stone-400 dark:text-slate-500">Complete grammar drills to see score projections</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Study Streak" value={`${profile.streak}d`} icon={<Flame className="w-4 h-4" />}
          color="#F59E0B" trend={profile.streak > 0 ? 'up' : 'neutral'} trendValue={profile.streak > 0 ? 'On fire!' : 'Start today'} />
        <StatCard label="Study Hours" value={`${Math.floor(profile.totalStudyMinutes / 60)}h`}
          sub={`${profile.totalStudyMinutes % 60}m total`} icon={<Clock className="w-4 h-4" />} color="#6366F1" />
        <StatCard label="Questions Done" value={totalQuestionsAnswered}
          icon={<BookOpen className="w-4 h-4" />} color="#10B981"
          trend={totalQuestionsAnswered > 0 ? 'up' : 'neutral'} trendValue={`${grammarSessions.length} sessions`} />
        <StatCard label="Vocab Mastered" value={vocabKnown}
          sub="out of 80 words" icon={<Brain className="w-4 h-4" />} color="#8B5CF6" />
        {dueFlashcardCount > 0 && (
          <button onClick={() => navigate('/myflash')}
            className="col-span-2 lg:col-span-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all hover:opacity-90"
            style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.22)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  {dueFlashcardCount} flashcard{dueFlashcardCount > 1 ? 's' : ''} due for review
                </p>
                <p className="text-xs text-stone-400 dark:text-slate-500">Spaced repetition — review now to build long-term memory</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 text-xs font-bold text-indigo-500">
              Review <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        )}
      </div>

      {/* Daily Missions + Quick Launch */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Daily Missions */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Daily Missions</h3>
            </div>
            {completedMissions.length > 0 && (
              <Badge variant="emerald">{completedMissions.length} done</Badge>
            )}
          </div>
          {missions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-stone-400 dark:text-slate-500">Start a drill to unlock today's missions</p>
              <Button size="sm" className="mt-3" onClick={() => navigate('/grammar')}>Begin</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...activeMissions, ...completedMissions].slice(0, 4).map(m => (
                <MissionCard key={m.id} mission={m} onDrill={(cat) => cat
                  ? navigate('/grammar', { state: { category: cat } })
                  : navigate('/grammar')
                } />
              ))}
            </div>
          )}
        </Card>

        {/* Quick Launch */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Quick Launch
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {([
              { Icon: BookOpen,  label: 'Grammar Drill',  desc: 'Part 5 practice',   path: '/grammar',    bg: 'bg-indigo-50 dark:bg-indigo-500/10',  border: 'border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400',   ic: '#4F46E5' },
              { Icon: Sparkles,  label: 'Flash Cards',    desc: 'Visual drills',     path: '/flash',      bg: 'bg-purple-50 dark:bg-purple-500/10',  border: 'border-purple-200 dark:border-purple-500/20 hover:border-purple-400',   ic: '#7C3AED' },
              { Icon: Library,   label: 'Vocabulary',     desc: 'Flashcards + quiz', path: '/vocabulary', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400', ic: '#059669' },
              { Icon: FileText,  label: 'Reading',        desc: 'Part 7 passages',   path: '/reading',    bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/20 hover:border-amber-400',     ic: '#D97706' },
              { Icon: Gamepad2,  label: 'Gap Fill',       desc: 'Speed / Survival',  path: '/gapfill',    bg: 'bg-violet-50 dark:bg-violet-500/10',  border: 'border-violet-200 dark:border-violet-500/20 hover:border-violet-400',   ic: '#7C3AED' },
              { Icon: Timer,     label: 'Mock Exam',      desc: 'Full simulation',   path: '/mock',       bg: 'bg-red-50 dark:bg-red-500/10',     border: 'border-red-200 dark:border-red-500/20 hover:border-red-400',         ic: '#DC2626' },
            ] as const).map(({ Icon, label, desc, path, bg, border, ic }) => (
              <button key={path} onClick={() => navigate(path)}
                className={`launch-btn p-3 rounded-xl border text-left ${bg} ${border}`}>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-stone-900 dark:text-white mb-0.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ic }} />
                  {label}
                </div>
                <div className="text-xs text-stone-400 dark:text-slate-500">{desc}</div>
              </button>
            ))}
          </div>
          {unresolvedErrors > 0 && (
            <button onClick={() => navigate('/errors')}
              className="w-full mt-2 p-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:border-red-300 dark:border-red-500/30 text-left transition-all">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div>
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300">{unresolvedErrors} Errors to Fix</div>
                  <div className="text-xs text-stone-400 dark:text-slate-500">Review Error Notebook</div>
                </div>
              </div>
            </button>
          )}
        </Card>
      </div>

      {/* Recommended Lesson */}
      {recommendedLesson && (
        <button
          className="w-full text-left bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4 card-interactive group"
          onClick={() => navigate(`/courses/${recommendedLesson.id}`, { state: { returnTo: '/' } })}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                {recommendedLesson.icon ?? '📐'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Recommended Lesson</span>
                  <span className="text-xs text-amber-600 font-medium">+{recommendedLesson.xpReward} XP</span>
                </div>
                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{recommendedLesson.title}</p>
                <p className="text-xs text-stone-500 dark:text-slate-400 truncate">{recommendedLesson.subtitle}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 dark:text-slate-500 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors shrink-0" />
          </div>
        </button>
      )}

      {/* Teacher Assignments */}
      {pendingAssignments.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">From Your Teacher</h3>
            </div>
            <Badge variant="indigo">{pendingAssignments.length} pending</Badge>
          </div>
          <div className="space-y-2">
            {pendingAssignments.slice(0, 5).map(a => {
              const overdue = a.dueDate && a.dueDate < Date.now()
              const handleGo = () => {
                if (a.type === 'drill' && a.category) {
                  navigate('/grammar', { state: { category: a.category } })
                } else if (a.type === 'lesson' && a.lessonId) {
                  navigate(`/courses/${a.lessonId}`, { state: { returnTo: '/' } })
                } else if (a.type === 'vocab' && a.category) {
                  navigate('/vocabulary')
                } else if (a.type === 'part6') {
                  navigate('/part6')
                } else if (a.type === 'custom' && a.topicId) {
                  navigate(`/topics/${a.topicId}`)
                } else {
                  const typeNav: Record<string, string> = { drill: '/grammar', lesson: '/courses', part6: '/part6', vocab: '/vocabulary', reading: '/reading', custom: '/' }
                  navigate(typeNav[a.type] ?? '/')
                }
              }
              const TYPE_COLORS: Record<string, string> = { drill: '#6366F1', lesson: '#10B981', part6: '#0EA5E9', vocab: '#F59E0B', reading: '#8B5CF6', custom: '#F43F5E' }
              const accent = TYPE_COLORS[a.type] ?? '#6366F1'
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 dark:border-white/[0.07] bg-stone-50 dark:bg-white/[0.03]" style={{ borderLeft: `3px solid ${accent}50` }}>
                  <button
                    onClick={() => store.completeAssignment(a.id)}
                    className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-white/[0.10] flex-shrink-0 hover:border-emerald-500 transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-stone-800 dark:text-slate-100 truncate">{a.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: accent, background: `${accent}12`, border: `1px solid ${accent}22`, borderRadius: 3, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>{a.type}</span>
                    </div>
                    {a.targetCount && a.type === 'drill' && (
                      <div className="text-xs text-stone-400 dark:text-slate-500">Complete {a.targetCount} questions in this category</div>
                    )}
                    {a.lessonId && a.type === 'lesson' && (
                      <div className="text-xs text-stone-500 dark:text-slate-400">Open lesson → complete to mark done</div>
                    )}
                    {a.topicId && a.type === 'custom' && (
                      <div className="text-xs text-stone-500 dark:text-slate-400">Study this topic then practice</div>
                    )}
                    {!a.targetCount && !a.lessonId && !a.topicId && a.description && (
                      <div className="text-xs text-stone-400 dark:text-slate-500 truncate">{a.description}</div>
                    )}
                    {a.dueDate && (
                      <div className={`text-xs mt-0.5 ${overdue ? 'text-red-600 dark:text-red-400' : 'text-stone-400 dark:text-slate-500'}`}>
                        Due {new Date(a.dueDate).toLocaleDateString()}{overdue ? ' · overdue' : ''}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleGo}>
                    Start →
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Priority Topics */}
      {priorityTopics.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Priority Topics</h3>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/topics')}>All Topics</Button>
          </div>
          <div className="space-y-2">
            {priorityTopics.map(({ topic, mastery, reason }) => {
              const accent = CATEGORY_ACCENT[topic.category] ?? '#6366F1'
              const masteryColor = MASTERY_COLORS[mastery.level]
              const cta = getTopicCTA(mastery.level)
              return (
                <button
                  key={topic.id}
                  onClick={() => navigate(`/topics/${topic.id}`)}
                  className="w-full flex items-center gap-3 text-left p-3 rounded-xl border border-stone-200 dark:border-white/[0.07] bg-white card-interactive group"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-stone-900 dark:text-white truncate">{topic.title}</span>
                      {mastery.recentErrorCount > 0 && (
                        <span className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded px-1.5 flex-shrink-0">
                          {mastery.recentErrorCount} err
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 dark:text-slate-500 truncate">{reason}</div>
                    <div className="mt-1.5 h-1 bg-stone-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${mastery.accuracy > 0 ? mastery.accuracy : 5}%`, backgroundColor: masteryColor }} />
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[10px] font-semibold" style={{ color: masteryColor }}>
                      {MASTERY_LABELS[mastery.level]}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{ color: accent, background: `${accent}10`, border: `1px solid ${accent}20` }}>
                      {cta}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {/* Mastery + Today's Bootcamp Task */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Category Mastery */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Category Mastery</h3>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/analytics')}>All Stats</Button>
          </div>
          {Object.keys(catAcc).length === 0 ? (
            <div className="text-center py-6">
              <p className="text-stone-400 dark:text-slate-500 text-sm">Complete grammar drills to track mastery</p>
              <Button size="sm" className="mt-3" onClick={() => navigate('/grammar')}>Start Drilling</Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(catAcc)
                .filter(([, v]) => v.total >= 3)
                .sort((a, b) => a[1].pct - b[1].pct)
                .slice(0, 5)
                .map(([cat, data]) => {
                  const mastery = data.pct >= 85 ? 'mastered' : data.pct >= 75 ? 'proficient' : data.pct >= 60 ? 'developing' : 'weak'
                  const color = mastery === 'mastered' ? '#10B981' : mastery === 'proficient' ? '#6366F1' : mastery === 'developing' ? '#F59E0B' : '#EF4444'
                  const masteryLabel = mastery === 'mastered' ? '✓' : mastery === 'proficient' ? '↑' : mastery === 'developing' ? '~' : '!'
                  return (
                    <button key={cat} className="w-full flex items-center gap-3 group text-left"
                      onClick={() => navigate('/grammar', { state: { category: cat } })}>
                      <span className="text-xs w-4 flex-shrink-0 font-bold" style={{ color }}>{masteryLabel}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-stone-700 dark:text-slate-300 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                            {CAT_LABELS[cat] || cat}
                          </span>
                          <span className="text-xs font-bold" style={{ color }}>{data.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${data.pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-stone-300 dark:text-slate-600 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors" />
                    </button>
                  )
                })}
              <p className="text-xs text-stone-400 dark:text-slate-500 mt-1">Click to drill a category</p>
            </div>
          )}
        </Card>

        {/* Score trend */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Accuracy Trend</h3>
            <Badge variant="slate">{grammarSessions.length} sessions</Badge>
          </div>
          {hasData ? (
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pctGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: chartTickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartTickColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ background: chartTooltipBg, border: `1px solid ${chartTooltipBorder}`, borderRadius: '10px', fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  formatter={(v: number) => [`${v}%`, 'Accuracy']}
                  labelStyle={{ color: chartLabelColor }} itemStyle={{ color: '#818CF8' }} />
                <Area type="monotone" dataKey="pct" stroke="#6366F1" fill="url(#pctGrad)" strokeWidth={2}
                  dot={{ fill: '#6366F1', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-center">
              <Target className="w-8 h-8 text-stone-300 dark:text-slate-600 mb-2" />
              <p className="text-stone-400 dark:text-slate-500 text-sm">Start drilling to see your progress</p>
              <Button size="sm" className="mt-3" onClick={() => navigate('/grammar')}>Begin</Button>
            </div>
          )}
        </Card>
      </div>

      {/* Today's Bootcamp Mission */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Today's Bootcamp</h3>
          </div>
          <Badge variant="amber">Day {currentDay.day}</Badge>
        </div>
        <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">{currentDay.theme}</h4>
        <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">{currentDay.mission}</p>
        <div className="space-y-2 mb-4">
          {currentDay.tasks.slice(0, 3).map(task => {
            const done = profile.completedBootcampTasks.includes(task.id)
            return (
              <button key={task.id} onClick={() => completeBootcampTask(task.id)}
                className={`w-full flex items-center gap-2 text-xs text-left rounded-lg px-2 py-1.5 transition-colors ${
                  done ? 'text-stone-400 dark:text-slate-500' : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:text-white'
                }`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? 'bg-emerald-50 dark:bg-emerald-500/100 border-emerald-500' : 'border-stone-300 dark:border-white/[0.10] hover:border-stone-500'
                }`}>
                  {done && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className={done ? 'line-through' : ''}>{task.label}</span>
                <span className="text-stone-400 dark:text-slate-500 ml-auto">{task.minutes}m</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400 dark:text-slate-500">{completedTodayTasks}/{currentDay.tasks.length} done</span>
          <Button size="sm" onClick={() => navigate('/bootcamp')}>
            Full Plan <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Recent Sessions
            </h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/analytics')}>View All</Button>
          </div>
          <div className="space-y-2">
            {recentSessions.map(sess => {
              const acc = Math.round(sess.correct / sess.count * 100)
              const date = new Date(sess.timestamp)
              return (
                <div key={sess.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-white/[0.05] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${acc >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/100' : acc >= 60 ? 'bg-amber-50 dark:bg-amber-500/100' : 'bg-red-50 dark:bg-red-500/100'}`} />
                    <div>
                      <span className="text-xs font-medium text-stone-700 dark:text-slate-300">{CAT_LABELS[sess.category] || sess.category}</span>
                      <span className="text-xs text-stone-400 dark:text-slate-500 ml-2">{sess.count} Q</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${acc >= 80 ? 'text-emerald-600' : acc >= 60 ? 'text-amber-600' : 'text-red-600 dark:text-red-400'}`}>{acc}%</span>
                    <span className="text-xs text-stone-400 dark:text-slate-500">{date.toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

const MissionCard: React.FC<{ mission: Mission; onDrill: (cat?: string) => void }> = ({ mission, onDrill }) => {
  const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100))
  return (
    <div className={`flex items-start gap-3 ${mission.completed ? 'opacity-60' : ''}`}>
      <span className="text-xl leading-none mt-0.5 flex-shrink-0">{mission.icon || '📋'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-xs font-semibold ${mission.completed ? 'text-emerald-600' : 'text-stone-700 dark:text-slate-300'}`}>
            {mission.title}
          </span>
          <span className="text-xs text-amber-600 font-bold ml-2 flex-shrink-0">
            +{mission.xpReward} XP{mission.completed ? ' ✓' : ''}
          </span>
        </div>
        <p className="text-xs text-stone-400 dark:text-slate-500 mb-1 truncate">{mission.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-stone-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${mission.completed ? 'bg-emerald-50 dark:bg-emerald-500/100' : 'bg-indigo-50 dark:bg-indigo-500/100'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-stone-400 dark:text-slate-500 flex-shrink-0">{mission.progress}/{mission.target}</span>
          {!mission.completed && (
            <button onClick={() => onDrill(mission.category)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:text-indigo-300 transition-colors flex-shrink-0">
              Go →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
