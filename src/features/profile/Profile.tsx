import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Target, Flame, Clock, BookOpen, Library, Trophy, TrendingUp,
  CheckCircle, Star, Zap, BarChart2, ChevronRight
} from 'lucide-react'
import { useAppStore, estimateScore, getCategoryAccuracy } from '../../store/useAppStore'
import type { GrammarSession, ErrorEntry } from '../../types'
import { ProgressRing } from '../../components/ui/ProgressRing'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { getReadinessLevel } from '../../utils/scoreEngine'

const CAT_LABELS: Record<string, string> = {
  word_form: 'Word Form', preposition: 'Prepositions', conjunction: 'Conjunctions',
  verb: 'Verb Tense', pronoun: 'Pronouns', article: 'Articles', vocab: 'Vocabulary',
  collocation: 'Collocations',
}

interface StoreSnapshot {
  profile: { streak: number; totalStudyMinutes: number }
  grammarSessions: GrammarSession[]
  vocabRatings: Record<string, string | null>
  errorNotebook: ErrorEntry[]
}

function getAchievements(store: StoreSnapshot) {
  const { profile, grammarSessions, vocabRatings, errorNotebook } = store
  const totalQ = grammarSessions.reduce((s: number, sess: GrammarSession) => s + sess.count, 0)
  const vocabKnown = Object.values(vocabRatings).filter(r => r === 'known').length
  const recentSessions = grammarSessions.slice(-5)
  const avgAcc = recentSessions.length
    ? recentSessions.reduce((s: number, sess: GrammarSession) => s + sess.correct / sess.count, 0) / recentSessions.length
    : 0
  const resolved = errorNotebook.filter((e: ErrorEntry) => e.resolved).length

  const achievements = [
    { id: 'first_drill', label: 'First Drill', desc: 'Complete your first grammar drill', icon: BookOpen, earned: grammarSessions.length >= 1 },
    { id: 'streak_3', label: '3-Day Streak', desc: 'Study 3 days in a row', icon: Flame, earned: profile.streak >= 3 },
    { id: 'streak_7', label: 'Week Warrior', desc: 'Study 7 days in a row', icon: Zap, earned: profile.streak >= 7 },
    { id: '100_questions', label: 'Century', desc: 'Answer 100 grammar questions', icon: BookOpen, earned: totalQ >= 100 },
    { id: '500_questions', label: 'Half Thousand', desc: 'Answer 500 grammar questions', icon: Star, earned: totalQ >= 500 },
    { id: 'accuracy_80', label: 'Sharp Shooter', desc: 'Achieve 80%+ accuracy in a session', icon: Target, earned: avgAcc >= 0.8 },
    { id: 'accuracy_90', label: 'Elite', desc: 'Achieve 90%+ accuracy in a session', icon: Trophy, earned: avgAcc >= 0.9 },
    { id: 'vocab_50', label: 'Vocab Builder', desc: 'Master 50 vocabulary words', icon: Library, earned: vocabKnown >= 50 },
    { id: 'vocab_100', label: 'Word Master', desc: 'Master 100 vocabulary words', icon: Library, earned: vocabKnown >= 100 },
    { id: 'error_resolve', label: 'Error Killer', desc: 'Resolve 10 errors from your notebook', icon: CheckCircle, earned: resolved >= 10 },
    { id: 'study_hour', label: 'Dedicated', desc: 'Study for 60 total minutes', icon: Clock, earned: profile.totalStudyMinutes >= 60 },
    { id: 'study_10h', label: 'Lexora Regular', desc: 'Study for 600 total minutes', icon: Clock, earned: profile.totalStudyMinutes >= 600 },
  ]
  return achievements
}

export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const store = useAppStore()
  const { profile, grammarSessions, readingSessions, vocabRatings, errorNotebook } = store
  const score = estimateScore(store)
  const catAcc = getCategoryAccuracy(store)
  const readiness = getReadinessLevel(score.total, profile.targetScore)
  const achievements = useMemo(() => getAchievements(store), [store])

  const totalQuestionsAnswered = grammarSessions.reduce((s, sess) => s + sess.count, 0)
  const totalCorrect = grammarSessions.reduce((s, sess) => s + sess.correct, 0)
  const overallAcc = totalQuestionsAnswered > 0 ? Math.round(totalCorrect / totalQuestionsAnswered * 100) : 0
  const vocabKnown = Object.values(vocabRatings).filter(r => r === 'known').length
  const vocabLearning = Object.values(vocabRatings).filter(r => r === 'learning').length
  const vocabTotal = 80
  const studyHours = Math.floor(profile.totalStudyMinutes / 60)
  const studyMins = profile.totalStudyMinutes % 60
  const unresolvedErrors = errorNotebook.filter(e => !e.resolved).length
  const recentSessions = [...grammarSessions].reverse().slice(0, 5)
  const earnedAchievements = achievements.filter(a => a.earned)

  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-6 max-w-4xl mx-auto pb-24 sm:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Your Lexora performance summary</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          Settings
        </Button>
      </div>

      {/* Hero — Score + Readiness */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-indigo-400" />
          </div>

          {/* Name + readiness */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-start flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full border"
                style={{ color: readiness.color, borderColor: readiness.color + '40', backgroundColor: readiness.color + '15' }}
              >
                {readiness.label}
              </span>
              <Badge variant="slate">Language: {profile.language === 'fr' ? 'FR' : 'EN'}</Badge>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Streak: <span className="text-amber-400 font-bold">{profile.streak} days</span>
              {profile.examDate && (
                <> · Exam: <span className="text-indigo-400 font-bold">{new Date(profile.examDate).toLocaleDateString()}</span></>
              )}
            </p>
          </div>

          {/* Score rings */}
          <div className="flex gap-4 flex-shrink-0">
            <ProgressRing value={score.total} max={990} size={90} strokeWidth={7} color="#6366F1"
              label={String(score.total)} sublabel="Total" />
            <ProgressRing value={score.listening} max={495} size={70} strokeWidth={6} color="#10B981"
              label={String(score.listening)} sublabel="Listen" />
            <ProgressRing value={score.reading} max={495} size={70} strokeWidth={6} color="#F59E0B"
              label={String(score.reading)} sublabel="Read" />
          </div>
        </div>

        {/* Target progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Progress to target ({profile.targetScore})</span>
            <span className="font-bold" style={{ color: readiness.color }}>{readiness.pct}%</span>
          </div>
          <div className="h-2 bg-stone-50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${readiness.pct}%`, backgroundColor: readiness.color }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Current: {score.total}</span>
            <span>Gap: {Math.max(0, profile.targetScore - score.total)} pts</span>
            <span>Target: {profile.targetScore}</span>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Hours', value: `${studyHours}h ${studyMins}m`, icon: Clock, color: '#6366F1' },
          { label: 'Questions Done', value: totalQuestionsAnswered, icon: BookOpen, color: '#10B981' },
          { label: 'Overall Accuracy', value: overallAcc > 0 ? `${overallAcc}%` : '—', icon: Target, color: '#F59E0B' },
          { label: 'Vocab Mastered', value: vocabKnown, icon: Library, color: '#EC4899' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category mastery */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Category Mastery
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/grammar')}>
              Drill →
            </Button>
          </div>
          {Object.keys(CAT_LABELS).length > 0 && Object.keys(catAcc).length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">Start drilling to see your category breakdown.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(CAT_LABELS).map(([cat, label]) => {
                const data = catAcc[cat]
                const pct = data ? data.pct : null
                const color = pct === null ? '#334155' : pct < 60 ? '#EF4444' : pct < 80 ? '#F59E0B' : '#10B981'
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-medium" style={{ color }}>
                        {pct !== null ? `${pct}% (${data!.correct}/${data!.total})` : 'Not attempted'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct ?? 0}%`, backgroundColor: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Vocabulary progress */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Library className="w-4 h-4 text-emerald-400" /> Vocabulary Progress
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/vocabulary')}>
              Study →
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Known', value: vocabKnown, color: '#10B981' },
              { label: 'Learning', value: vocabLearning, color: '#F59E0B' },
              { label: 'Remaining', value: Math.max(0, vocabTotal - vocabKnown - vocabLearning), color: '#EF4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-xl font-bold" style={{ color }}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Mastery</span>
              <span>{Math.round(vocabKnown / vocabTotal * 100)}%</span>
            </div>
            <div className="h-2 bg-stone-50 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${vocabKnown / vocabTotal * 100}%` }} />
              <div className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${vocabLearning / vocabTotal * 100}%` }} />
            </div>
            <div className="text-xs text-slate-500 mt-1">{vocabKnown} / {vocabTotal} words mastered</div>
          </div>
        </Card>
      </div>

      {/* Recent sessions */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Recent Sessions
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>Analytics →</Button>
        </div>
        {recentSessions.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No sessions yet. Start your first drill!</p>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((sess) => {
              const acc = Math.round(sess.correct / sess.count * 100)
              const color = acc < 60 ? '#EF4444' : acc < 80 ? '#F59E0B' : '#10B981'
              const date = new Date(sess.timestamp)
              return (
                <div key={sess.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{sess.category}</div>
                    <div className="text-xs text-slate-500">{date.toLocaleDateString()} · {sess.count} questions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color }}>{acc}%</div>
                    <div className="text-xs text-slate-500">{sess.correct}/{sess.count}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Achievements */}
      <Card className="p-5">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-400" /> Achievements
          <Badge variant="amber">{earnedAchievements.length}/{achievements.length}</Badge>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map(({ id, label, desc, icon: Icon, earned }) => (
            <div key={id}
              className={`p-3 rounded-xl border text-center transition-all ${
                earned
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-stone-50 border-stone-200 opacity-40'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-1.5 ${earned ? 'text-amber-400' : 'text-slate-600'}`} />
              <div className={`text-xs font-bold ${earned ? 'text-amber-300' : 'text-slate-500'}`}>{label}</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-tight">{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notebook quick stats */}
      {errorNotebook.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm">Error Notebook</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {unresolvedErrors} unresolved · {errorNotebook.length - unresolvedErrors} resolved
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/errors')}>
              Review <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
