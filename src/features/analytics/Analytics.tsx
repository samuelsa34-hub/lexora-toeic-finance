import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts'
import { useAppStore, estimateScore, getCategoryAccuracy } from '../../store/useAppStore'
import { projectedScoreIn7Days, projectedScoreIn14Days, getReadinessLevel } from '../../utils/scoreEngine'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { CAT_LABELS } from '../../utils/constants'
import { Dumbbell, TrendingUp } from 'lucide-react'

const DEMO_CAT_DATA = [
  { name: 'Conjunctions', pct: 48 },
  { name: 'Verb Tense', pct: 55 },
  { name: 'Articles', pct: 62 },
  { name: 'Prepositions', pct: 70 },
  { name: 'Pronouns', pct: 75 },
  { name: 'Vocabulary', pct: 78 },
  { name: 'Word Form', pct: 85 },
]

export const Analytics: React.FC = () => {
  const navigate = useNavigate()
  const store = useAppStore()
  const { grammarSessions, readingSessions, vocabRatings, profile } = store
  const score = estimateScore(store)
  const catAcc = getCategoryAccuracy(store)

  const hasGrammarData = grammarSessions.length >= 2
  const hasVocabData = Object.keys(vocabRatings).length > 0

  const recentAccuracy = grammarSessions.length > 0
    ? grammarSessions.slice(-5).reduce((s, sess) => s + sess.correct / sess.count, 0) / Math.min(5, grammarSessions.length)
    : null

  const proj7 = recentAccuracy !== null ? projectedScoreIn7Days(score.total, recentAccuracy) : null
  const proj14 = recentAccuracy !== null ? projectedScoreIn14Days(score.total, recentAccuracy) : null
  const readiness = getReadinessLevel(score.total, profile.targetScore)

  const catChartData = useMemo(() => {
    const entries = Object.entries(catAcc)
    if (entries.length < 2) return DEMO_CAT_DATA
    return entries
      .filter(([, v]) => v.total >= 2)
      .sort((a, b) => a[1].pct - b[1].pct)
      .map(([k, v]) => ({ name: CAT_LABELS[k] || k, pct: v.pct, cat: k }))
  }, [catAcc])
  const isDemo = Object.keys(catAcc).length < 2

  const vocabKnown = Object.values(vocabRatings).filter(r => r === 'known').length
  const vocabLearning = Object.values(vocabRatings).filter(r => r === 'learning').length
  const vocabUnknown = Object.values(vocabRatings).filter(r => r === 'unknown').length
  const vocabPieData = hasVocabData
    ? [
        { name: 'Known', value: vocabKnown, color: '#10B981' },
        { name: 'Learning', value: vocabLearning, color: '#F59E0B' },
        { name: 'Unknown', value: vocabUnknown, color: '#EF4444' },
      ].filter(d => d.value > 0)
    : [
        { name: 'Known', value: 18, color: '#10B981' },
        { name: 'Learning', value: 25, color: '#F59E0B' },
        { name: 'Unknown', value: 37, color: '#EF4444' },
      ]

  const weakZones = useMemo(() =>
    Object.entries(catAcc)
      .filter(([, v]) => v.pct < 70 && v.total >= 3)
      .sort((a, b) => a[1].pct - b[1].pct)
      .slice(0, 3),
    [catAcc]
  )

  const accuracyTrend = useMemo(() =>
    grammarSessions.slice(-10).map((sess, i) => ({
      name: `S${i + 1}`,
      pct: Math.round(sess.correct / sess.count * 100),
      cat: CAT_LABELS[sess.category] || sess.category,
    })),
    [grammarSessions]
  )

  const part6Sessions = store.part6Sessions ?? []
  const part6Accuracy = part6Sessions.length > 0
    ? Math.round(part6Sessions.reduce((s, sess) => s + sess.correct / sess.total, 0) / part6Sessions.length * 100)
    : null
  const part6Recent = [...part6Sessions].reverse().slice(0, 5)

  const recentSessions = [...grammarSessions].reverse().slice(0, 10)
  const totalQuestions = grammarSessions.reduce((s, sess) => s + sess.count, 0)
  const totalCorrect = grammarSessions.reduce((s, sess) => s + sess.correct, 0)
  const overallAcc = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : null

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-4xl mx-auto space-y-6 pb-24 sm:pb-6">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics <span className="text-gradient">Center</span></h1>
        <p className="text-slate-400 text-sm">Track your path to {profile.targetScore}</p>
      </div>

      {/* Score Projection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Current Score" value={score.total} sub="Estimated from sessions" color="#6366F1" />
        <StatCard
          label="7-Day Projection"
          value={proj7 !== null ? proj7 : '—'}
          sub={proj7 !== null ? `+${proj7 - score.total} pts gain` : 'Start drilling to project'}
          color="#8B5CF6"
          trend={proj7 !== null ? 'up' : 'neutral'}
          trendValue={recentAccuracy !== null ? `at ${Math.round(recentAccuracy * 100)}% accuracy` : undefined}
        />
        <StatCard
          label="14-Day Projection"
          value={proj14 !== null ? proj14 : '—'}
          sub={proj14 !== null ? `+${proj14 - score.total} pts gain` : 'Need more data'}
          color="#EC4899"
          trend={proj14 !== null ? 'up' : 'neutral'}
        />
      </div>

      {/* Readiness Gauge */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Readiness to {profile.targetScore}
          </h3>
          <Badge variant={readiness.pct >= 80 ? 'emerald' : readiness.pct >= 60 ? 'indigo' : 'amber'}>
            {readiness.label}
          </Badge>
        </div>
        <div className="h-3 bg-stone-50 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${readiness.pct}%`, backgroundColor: readiness.color }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Current: {score.total}</span>
          <span>{readiness.pct}% of target</span>
          <span>Target: {profile.targetScore}</span>
        </div>
        {overallAcc !== null && (
          <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <div className="font-bold text-white">{totalQuestions}</div>
              <div className="text-slate-500">Questions Done</div>
            </div>
            <div>
              <div className={`font-bold ${overallAcc >= 80 ? 'text-emerald-400' : overallAcc >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {overallAcc}%
              </div>
              <div className="text-slate-500">Overall Accuracy</div>
            </div>
            <div>
              <div className="font-bold text-white">{grammarSessions.length}</div>
              <div className="text-slate-500">Sessions</div>
            </div>
          </div>
        )}
      </Card>

      {/* Accuracy Trend */}
      {accuracyTrend.length >= 2 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={accuracyTrend}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(28,24,20,0.09)', borderRadius: '10px', fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                formatter={(v: number) => [`${v}%`, 'Accuracy']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.cat || ''}
                labelStyle={{ color: '#94A3B8' }} itemStyle={{ color: '#818CF8' }} />
              <Area type="monotone" dataKey="pct" stroke="#6366F1" fill="url(#accGrad)" strokeWidth={2} dot={{ fill: '#6366F1', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category Accuracy Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Accuracy by Category</h3>
          {isDemo && <Badge variant="slate">Demo Data — Start drilling</Badge>}
        </div>
        <ResponsiveContainer width="100%" height={Math.max(180, catChartData.length * 30)}>
          <BarChart data={catChartData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} width={85} />
            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(28,24,20,0.09)', borderRadius: '10px', fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              formatter={(v: number) => [`${v}%`, 'Accuracy']} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
              {catChartData.map((entry, i) => (
                <Cell key={i} fill={entry.pct < 60 ? '#EF4444' : entry.pct < 75 ? '#F59E0B' : '#10B981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Vocabulary Mastery */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Vocabulary Mastery</h3>
            {!hasVocabData && <Badge variant="slate">Demo</Badge>}
          </div>
          {hasVocabData ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Known', value: vocabKnown, color: '#10B981' },
                  { label: 'Learning', value: vocabLearning, color: '#F59E0B' },
                  { label: 'Unknown', value: vocabUnknown, color: '#EF4444' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-2 bg-stone-50 rounded-lg">
                    <div className="text-lg font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-stone-50 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${vocabKnown / 80 * 100}%` }} />
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${vocabLearning / 80 * 100}%` }} />
              </div>
              <p className="text-xs text-slate-500">{vocabKnown} / 80 words mastered ({Math.round(vocabKnown / 80 * 100)}%)</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={vocabPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {vocabPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: '#94A3B8', fontSize: 10 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <Button size="sm" variant="ghost" className="w-full mt-3" onClick={() => navigate('/vocabulary')}>
            Study Vocabulary →
          </Button>
        </Card>

        {/* Weak Zones */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Priority Drill Zones</h3>
          {weakZones.length === 0 ? (
            <div className="text-center py-6">
              {grammarSessions.length < 3 ? (
                <>
                  <p className="text-slate-500 text-sm">Complete 5+ sessions to see weak zones</p>
                  <Button size="sm" className="mt-3" onClick={() => navigate('/grammar')}>Start Drilling</Button>
                </>
              ) : (
                <p className="text-slate-400 text-sm">No categories below 70% — you&apos;re doing great!</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {weakZones.map(([cat, data]) => (
                <div key={cat} className="p-3 bg-red-500/5 border border-red-500/15 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-300">{CAT_LABELS[cat] || cat}</span>
                    <span className="text-sm font-bold text-red-400">{data.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-50 rounded-full mb-3">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${data.pct}%` }} />
                  </div>
                  <Button size="sm" variant="ghost" className="w-full text-xs"
                    onClick={() => navigate('/grammar', { state: { category: cat } })}>
                    <Dumbbell className="w-3 h-3" /> Drill {CAT_LABELS[cat] || cat} →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Part 6 Performance */}
      {part6Sessions.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Part 6 — Text Completion</h3>
            <Badge variant={part6Accuracy !== null && part6Accuracy >= 75 ? 'emerald' : part6Accuracy !== null && part6Accuracy >= 50 ? 'amber' : 'red'}>
              {part6Accuracy !== null ? `${part6Accuracy}% avg` : '—'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-lg font-bold text-indigo-400">{part6Sessions.length}</div>
              <div className="text-xs text-slate-500">Sessions</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className={`text-lg font-bold ${part6Accuracy !== null && part6Accuracy >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {part6Accuracy !== null ? `${part6Accuracy}%` : '—'}
              </div>
              <div className="text-xs text-slate-500">Avg Accuracy</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-lg font-bold text-white">
                {part6Sessions.reduce((s, sess) => s + sess.correct, 0)}/{part6Sessions.reduce((s, sess) => s + sess.total, 0)}
              </div>
              <div className="text-xs text-slate-500">Total Correct</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {part6Recent.map((sess) => {
              const pct = Math.round(sess.correct / sess.total * 100)
              return (
                <div key={sess.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs text-slate-600 w-16 shrink-0">{new Date(sess.timestamp).toLocaleDateString()}</span>
                  <div className="flex-1 h-1.5 bg-stone-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right shrink-0 ${pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {sess.correct}/{sess.total}
                  </span>
                </div>
              )
            })}
          </div>
          <Button size="sm" variant="ghost" className="w-full mt-3" onClick={() => navigate('/part6')}>
            Practice Part 6 →
          </Button>
        </Card>
      )}

      {/* Session History */}
      {recentSessions.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Session History</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr className="text-slate-500 border-b border-stone-200">
                  <th className="text-left py-2 px-1">Date</th>
                  <th className="text-left py-2 px-1">Category</th>
                  <th className="text-right py-2 px-1">Q</th>
                  <th className="text-right py-2 px-1">Accuracy</th>
                  <th className="text-right py-2 px-1">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map(sess => {
                  const acc = Math.round(sess.correct / sess.count * 100)
                  return (
                    <tr key={sess.id} className="border-b border-stone-200 last:border-0 hover:bg-white/2">
                      <td className="py-2 px-1 text-slate-600">{new Date(sess.timestamp).toLocaleDateString()}</td>
                      <td className="py-2 px-1 text-slate-400 max-w-[120px] truncate">{CAT_LABELS[sess.category] || sess.category}</td>
                      <td className="py-2 px-1 text-right text-slate-400">{sess.count}</td>
                      <td className={`py-2 px-1 text-right font-bold ${acc >= 80 ? 'text-emerald-400' : acc >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{acc}%</td>
                      <td className="py-2 px-1 text-right text-slate-600">{Math.floor(sess.totalTime / 60)}m{sess.totalTime % 60}s</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
