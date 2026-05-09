import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
  GraduationCap, ArrowLeft, TrendingUp, AlertTriangle, Zap, Settings,
  X, Eye, ClipboardList, Calendar, Plus, Trash2, CheckCircle2,
  XCircle, Target, MessageSquare, Activity, RefreshCw, TrendingDown,
  Minus, ArrowRight, Bell,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { useRegistryStore } from '../../store/useRegistryStore'
import { loadStudentSnapshot, getAllStudentSnapshots, readPresence } from '../../utils/studentStorage'
import { subscribeToClass, subscribeToLocalClass, type CloudClassData, type LocalBroadcastMessage } from '../../utils/cloudSync'
import { FIREBASE_ENABLED } from '../../config/firebase'
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar'
import { GOOGLE_CLIENT_ID } from '../../config/google'
import { CAT_LABELS } from '../../utils/constants'
import { generatePreMeetingSummary } from '../../utils/preMeetingSummary'
import { computePresence } from '../../utils/activityLog'
import { generateTeacherStudentAlerts, generateClassAlerts } from '../../utils/alertEngine'
import type { StudentMeta, AssignmentType } from '../../types'
import { FirebaseStatusBadge } from '../../components/ui/FirebaseStatusBadge'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG = '#060B14'
const SURFACE = '#0D1626'
const SURFACE2 = '#111827'
const BORDER = '#1E293B'
const TEXT_PRIMARY = '#F8FAFC'
const TEXT_MUTED = '#64748B'
const TEXT_DIM = '#94A3B8'

const PRESENCE_COLOR = { active: '#10B981', idle: '#F59E0B', offline: '#475569' } as const
const PRESENCE_LABEL = { active: 'Active now', idle: 'Idle', offline: 'Offline' } as const

// ── Helpers ───────────────────────────────────────────────────────────────────
type Snap = ReturnType<typeof loadStudentSnapshot>

function computeStats(snap: Snap, student: StudentMeta) {
  if (!snap) return {
    score: null, accuracy: null, sessions: 0, streak: 0, errors: 0,
    weakCats: [] as string[], part6Acc: null, xp: 0, completedLessons: 0,
    trend: 'flat' as 'up' | 'down' | 'flat', presence: computePresence([], readPresence(student.id)),
  }
  const sessions = snap.grammarSessions ?? []
  const recent = sessions.slice(-10)
  const avgAcc = recent.length > 0 ? recent.reduce((s, sess) => s + sess.correct / sess.count, 0) / recent.length : null
  const score = avgAcc !== null ? Math.min(990, 150 + Math.round(avgAcc * 345) + Math.round(student.targetScore / 4)) : null

  // Score trend: compare last 3 vs previous 3
  let trend: 'up' | 'down' | 'flat' = 'flat'
  if (sessions.length >= 6) {
    const prev = sessions.slice(-6, -3).reduce((s, x) => s + x.correct / x.count, 0) / 3
    const cur = sessions.slice(-3).reduce((s, x) => s + x.correct / x.count, 0) / 3
    trend = cur > prev + 0.05 ? 'up' : cur < prev - 0.05 ? 'down' : 'flat'
  }

  const catAcc: Record<string, { c: number; t: number }> = {}
  for (const sess of sessions) for (const a of sess.attempts ?? []) {
    if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
    catAcc[a.cat].t++; if (a.correct) catAcc[a.cat].c++
  }
  const weakCats = Object.entries(catAcc).filter(([, v]) => v.t >= 3 && v.c / v.t < 0.7)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t).slice(0, 3).map(([k]) => k)
  const p6 = snap.part6Sessions ?? []
  const part6Acc = p6.length > 0 ? Math.round(p6.reduce((s, sess) => s + sess.correct / sess.total, 0) / p6.length * 100) : null
  const presence = computePresence(snap.activityLog ?? [], readPresence(student.id))
  return {
    score, accuracy: avgAcc !== null ? Math.round(avgAcc * 100) : null,
    sessions: sessions.length, streak: snap.profile?.streak ?? 0,
    errors: (snap.errorNotebook ?? []).filter(e => !e.resolved).length,
    weakCats, part6Acc, xp: snap.profile?.xp ?? 0,
    completedLessons: (snap.completedLessons ?? []).length,
    trend, presence,
  }
}

function formatRelative(ts: number | null) {
  if (!ts) return 'Never'
  const d = Math.floor((Date.now() - ts) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

// ── Presence dot ──────────────────────────────────────────────────────────────
function PresenceDot({ status, label = true }: { status: 'active' | 'idle' | 'offline'; label?: boolean }) {
  const color = PRESENCE_COLOR[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
        boxShadow: status === 'active' ? `0 0 0 2px ${color}30` : undefined,
      }} />
      {label && <span style={{ fontSize: 10, color, fontWeight: 600 }}>{PRESENCE_LABEL[status]}</span>}
    </span>
  )
}

// ── Trend icon ────────────────────────────────────────────────────────────────
function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp size={12} style={{ color: '#10B981' }} />
  if (trend === 'down') return <TrendingDown size={12} style={{ color: '#F43F5E' }} />
  return <Minus size={12} style={{ color: '#64748B' }} />
}

// ── Error → Exercise Remediation mapping ──────────────────────────────────────
interface RemInfo {
  lessonId?: string; lessonTitle?: string
  topicId?: string;  topicTitle?: string
  vocab?: boolean; part6?: boolean; gapfill?: boolean
  mistakeType: 'Grammar' | 'Vocabulary' | 'Trap' | 'Reading'
}
const REMEDIATION: Record<string, RemInfo> = {
  word_form:         { lessonId: 'word_form',         lessonTitle: 'Word Form',            topicId: 'word_form',          topicTitle: 'Word Form',          mistakeType: 'Grammar' },
  preposition:       { lessonId: 'preposition',       lessonTitle: 'Prepositions',          topicId: 'preposition',        topicTitle: 'Prepositions',       mistakeType: 'Grammar' },
  conjunction:       { lessonId: 'conjunction',       lessonTitle: 'Conjunctions',          topicId: 'conjunction',        topicTitle: 'Conjunctions',       gapfill: true, part6: true, mistakeType: 'Grammar' },
  verb:              { lessonId: 'verb',              lessonTitle: 'Verb Tenses',            topicId: 'verb_tense',         topicTitle: 'Verb Tense',         mistakeType: 'Grammar' },
  passive:           { lessonId: 'passive',           lessonTitle: 'Passive Voice',          topicId: 'passive_voice',      topicTitle: 'Passive Voice',      mistakeType: 'Grammar' },
  gerund_infinitive: { lessonId: 'gerund_infinitive', lessonTitle: 'Gerund vs Infinitive',   topicId: 'gerund_infinitive',  topicTitle: 'Gerund/Infinitive',  mistakeType: 'Grammar' },
  relative_clause:   { lessonId: 'relative_clause',   lessonTitle: 'Relative Clauses',      topicId: 'relative_clause',    topicTitle: 'Relative Clauses',   mistakeType: 'Grammar' },
  article:           { lessonId: 'article',           lessonTitle: 'Articles (A/An/The)',    topicId: 'article',            topicTitle: 'Articles',           mistakeType: 'Grammar' },
  pronoun:           { topicId: 'pronoun',             topicTitle: 'Pronouns',               mistakeType: 'Grammar' },
  vocab:             { lessonId: 'vocab_finance',     lessonTitle: 'Finance Vocabulary',     topicId: 'vocab_finance',      topicTitle: 'Finance Vocab',      vocab: true, mistakeType: 'Vocabulary' },
  collocation:       { topicId: 'vocab_collocations', topicTitle: 'Collocations',            vocab: true,                   mistakeType: 'Vocabulary' },
  tense_perfect:     { mistakeType: 'Grammar' }, tense_continuous: { mistakeType: 'Grammar' },
  conditionals:      { mistakeType: 'Grammar' }, modal_verbs:      { mistakeType: 'Grammar' },
  reported_speech:   { mistakeType: 'Grammar' }, comparative:      { mistakeType: 'Grammar' },
  quantifiers:       { mistakeType: 'Grammar' }, question_form:    { mistakeType: 'Grammar' },
  time_clauses:      { mistakeType: 'Grammar' }, agreement:        { mistakeType: 'Grammar' },
}

const LEVEL_CFG = {
  critical: { color: '#F87171', bg: '#F43F5E12', border: '#F43F5E30' },
  high:     { color: '#FCD34D', bg: '#F59E0B10', border: '#F59E0B30' },
  medium:   { color: '#818CF8', bg: '#6366F110', border: '#6366F130' },
  low:      { color: '#6EE7B7', bg: '#10B98110', border: '#10B98130' },
} as const

// ── Student Detail Modal ───────────────────────────────────────────────────────
function StudentDetailModal({
  student,
  onClose,
  onSchedule,
}: {
  student: StudentMeta
  onClose: () => void
  onSchedule?: (studentName: string) => void
}) {
  const snap = loadStudentSnapshot(student.id)
  const stats = computeStats(snap, student)
  const { teacherNotes, setTeacherNote, assignments, addAssignment, removeAssignment, addReviewTogether } = useRegistryStore()
  const [tab, setTab] = useState<'performance' | 'mistakes' | 'goals' | 'premeeting'>('performance')
  const [note, setNote] = useState(teacherNotes[student.id] ?? '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [newAssign, setNewAssign] = useState<{ title: string; type: AssignmentType; description: string; dueDate: string }>({
    title: '', type: 'drill', description: '', dueDate: '',
  })
  const [rtAdded, setRtAdded] = useState<string | null>(null)
  const [expandedError, setExpandedError] = useState<string | null>(null)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const [assignFeedback, setAssignFeedback] = useState<Record<string, string>>({})
  const [filterPart, setFilterPart] = useState<'all' | 'part5' | 'part6' | 'part7'>('all')
  const [filterType, setFilterType] = useState<'all' | 'Grammar' | 'Vocabulary' | 'Trap' | 'Reading'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [sortMode, setSortMode] = useState<'occurrences' | 'recent' | 'severity'>('occurrences')
  const [groupMode, setGroupMode] = useState<'category' | 'part' | 'severity'>('category')

  const studentAssignments = assignments.filter(a => a.studentId === student.id)
  const completedIds = snap?.completedAssignments ?? []
  const studentAlerts = useMemo(() => generateTeacherStudentAlerts(snap, student), [snap, student])

  const scoreTrend = useMemo(() => {
    const sessions = snap?.grammarSessions ?? []
    return sessions.slice(-12).map((s, i) => ({
      n: `S${i + 1}`,
      score: Math.min(990, 150 + Math.round(s.correct / s.count * 345) + Math.round(student.targetScore / 4)),
      acc: Math.round(s.correct / s.count * 100),
    }))
  }, [snap, student.targetScore])

  const catBreakdown = useMemo(() => {
    const catAcc: Record<string, { c: number; t: number }> = {}
    for (const sess of snap?.grammarSessions ?? []) for (const a of sess.attempts ?? []) {
      if (!catAcc[a.cat]) catAcc[a.cat] = { c: 0, t: 0 }
      catAcc[a.cat].t++; if (a.correct) catAcc[a.cat].c++
    }
    return Object.entries(catAcc).filter(([, v]) => v.t >= 2)
      .map(([k, v]) => ({ cat: k, pct: Math.round(v.c / v.t * 100), total: v.t }))
      .sort((a, b) => a.pct - b.pct)
  }, [snap])

  const allErrors = useMemo(() => (snap?.errorNotebook ?? []).filter(e => !e.resolved)
    .sort((a, b) => b.occurrences - a.occurrences), [snap])

  const saveNote = () => {
    setTeacherNote(student.id, note)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 1500)
  }

  const handleAddAssignment = () => {
    if (!newAssign.title.trim()) return
    addAssignment({
      studentId: student.id,
      title: newAssign.title.trim(),
      type: newAssign.type,
      description: newAssign.description,
      dueDate: newAssign.dueDate ? new Date(newAssign.dueDate).getTime() : undefined,
    })
    setNewAssign({ title: '', type: 'drill', description: '', dueDate: '' })
  }

  const prefillAssignment = (title: string, type: AssignmentType, description: string) => {
    setNewAssign(p => ({ ...p, title, type, description }))
    setTab('goals')
  }

  const handleAddReviewTogether = (errorId: string, topic: string, example: string) => {
    addReviewTogether({ studentId: student.id, errorId, topic, note: example, priority: 'normal' })
    setRtAdded(errorId)
    setTimeout(() => setRtAdded(null), 1500)
  }

  const fb = (key: string, msg: string) => {
    setAssignFeedback(p => ({ ...p, [key]: msg }))
    setTimeout(() => setAssignFeedback(p => { const n = { ...p }; delete n[key]; return n }), 2000)
  }

  const handleSendDrill = (cat: string, label: string) => {
    addAssignment({ studentId: student.id, title: `${label} — Targeted Drill`, type: 'drill', category: cat, targetCount: 20, description: `Fix repeated mistakes in ${label}. Complete 20 focused questions.` })
    fb(`drill:${cat}`, '✓ Drill sent')
  }
  const handleAssignLesson = (lessonId: string, lessonTitle: string, cat: string) => {
    addAssignment({ studentId: student.id, title: `Lesson: ${lessonTitle}`, type: 'lesson', lessonId, category: cat, description: `Complete this lesson to repair your weak spot in ${CAT_LABELS[cat] || cat}.` })
    fb(`lesson:${cat}`, '✓ Lesson assigned')
  }
  const handleAssignTopic = (topicId: string, topicTitle: string, cat: string) => {
    addAssignment({ studentId: student.id, title: `Topic Repair: ${topicTitle}`, type: 'custom', topicId, category: cat, description: `Study and practice the ${topicTitle} topic to fix your recurring mistake.` })
    fb(`topic:${cat}`, '✓ Topic assigned')
  }
  const handleAssignVocab = (cat: string, label: string) => {
    addAssignment({ studentId: student.id, title: `Vocab Drill: ${label}`, type: 'vocab', category: cat, description: `Vocabulary practice targeted at your weak area: ${label}.` })
    fb(`vocab:${cat}`, '✓ Vocab assigned')
  }
  const handleAssignPart6 = (label: string, cat: string) => {
    addAssignment({ studentId: student.id, title: `Part 6 Pack: ${label}`, type: 'part6', category: cat, description: `Practice Part 6 text completion with focus on ${label}.` })
    fb(`part6:${cat}`, '✓ Part 6 assigned')
  }
  const handleAssignGapfill = (label: string, cat: string) => {
    addAssignment({ studentId: student.id, title: `Gap Fill Pack: ${label}`, type: 'custom', category: cat, description: `Gap fill exercises targeting ${label} patterns.` })
    fb(`gapfill:${cat}`, '✓ Gap Fill assigned')
  }

  const filteredErrors = useMemo(() => allErrors.filter(err => {
    if (filterPart !== 'all' && err.part !== filterPart) return false
    if (filterType !== 'all' && (REMEDIATION[err.category]?.mistakeType ?? 'Grammar') !== filterType) return false
    if (filterSeverity !== 'all' && err.dangerLevel !== filterSeverity) return false
    return true
  }), [allErrors, filterPart, filterType, filterSeverity])

  const groupedErrors = useMemo(() => {
    const lvl: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }
    const sorted = [...filteredErrors].sort((a, b) => {
      if (sortMode === 'recent') return b.lastSeen - a.lastSeen
      if (sortMode === 'severity') return (lvl[b.dangerLevel] ?? 0) - (lvl[a.dangerLevel] ?? 0)
      return b.occurrences - a.occurrences
    })
    const grouped: Record<string, typeof sorted> = {}
    for (const err of sorted) {
      const key = groupMode === 'part' ? (err.part ?? 'unknown') : groupMode === 'severity' ? err.dangerLevel : err.category
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(err)
    }
    const entries = Object.entries(grouped)
    if (groupMode === 'severity') {
      const order = ['critical', 'high', 'medium', 'low']
      return entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    }
    return entries.sort((a, b) => b[1].reduce((s, e) => s + e.occurrences, 0) - a[1].reduce((s, e) => s + e.occurrences, 0))
  }, [filteredErrors, sortMode, groupMode])

  const tabStyle = (active: boolean) => ({
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: active ? `${student.color}20` : 'none',
    border: active ? `1px solid ${student.color}40` : '1px solid transparent',
    color: active ? student.color : TEXT_MUTED,
    transition: 'all 0.15s',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflowY: 'auto' }}>
      <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 16, width: '100%', maxWidth: 720, marginTop: 10 }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: SURFACE2, zIndex: 1, borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {student.photoUrl
              ? <img src={student.photoUrl} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
              : <div style={{ width: 40, height: 40, borderRadius: 10, fontSize: 20, background: `${student.color}18`, border: `1.5px solid ${student.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{student.avatar}</div>
            }
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>{student.name}</span>
                <PresenceDot status={stats.presence.status} />
              </div>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                {student.email ?? `Target: ${student.targetScore}`}
                {stats.presence.currentActivity && (
                  <span style={{ marginLeft: 8, color: '#10B981' }}>· {stats.presence.currentActivity}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {onSchedule && (
              <button onClick={() => { onSchedule(student.name); onClose() }}
                style={{ padding: '7px 12px', borderRadius: 7, background: '#4285F415', border: '1px solid #4285F430', color: '#4285F4', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} /> Schedule
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}><X size={18} /></button>
          </div>
        </div>

        {/* Intervention alerts */}
        {studentAlerts.length > 0 && (
          <div style={{ padding: '10px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {studentAlerts.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: a.severity === 'critical' ? '#F43F5E0A' : '#F59E0B0A', border: `1px solid ${a.severity === 'critical' ? '#F43F5E30' : '#F59E0B30'}`, borderRadius: 8 }}>
                <Bell size={12} style={{ color: a.severity === 'critical' ? '#F43F5E' : '#F59E0B', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: a.severity === 'critical' ? '#F87171' : '#FCD34D', fontWeight: 600 }}>{a.title}</span>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{a.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick stats */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {[
            { label: 'Score', value: stats.score ?? '—', color: student.color, suffix: <TrendIcon trend={stats.trend} /> },
            { label: 'Target', value: student.targetScore, color: TEXT_DIM, suffix: null },
            { label: 'Accuracy', value: stats.accuracy !== null ? `${stats.accuracy}%` : '—', color: stats.accuracy !== null ? (stats.accuracy >= 75 ? '#10B981' : '#F59E0B') : TEXT_DIM, suffix: null },
            { label: 'Sessions', value: stats.sessions, color: TEXT_DIM, suffix: null },
            { label: 'Errors', value: stats.errors, color: stats.errors > 5 ? '#F43F5E' : '#10B981', suffix: null },
            { label: 'XP', value: stats.xp, color: '#F59E0B', suffix: null },
          ].map(({ label, value, color, suffix }) => (
            <div key={label} style={{ background: SURFACE, borderRadius: 8, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color }}>{value}</span>
                {suffix}
              </div>
              <div style={{ fontSize: 9, color: TEXT_MUTED, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button style={tabStyle(tab === 'performance')} onClick={() => setTab('performance')}>📈 Performance</button>
          <button style={tabStyle(tab === 'mistakes')} onClick={() => setTab('mistakes')}>⚠️ Mistakes ({allErrors.length})</button>
          <button style={tabStyle(tab === 'goals')} onClick={() => setTab('goals')}>📋 Goals & Notes</button>
          <button style={tabStyle(tab === 'premeeting')} onClick={() => setTab('premeeting')}>🗓 Pre-Meeting</button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* PERFORMANCE TAB */}
          {tab === 'performance' && (
            <div>
              {scoreTrend.length >= 3 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Score Progression <TrendIcon trend={stats.trend} />
                    <span style={{ fontSize: 10, fontWeight: 400, color: stats.trend === 'up' ? '#10B981' : stats.trend === 'down' ? '#F43F5E' : TEXT_MUTED }}>
                      {stats.trend === 'up' ? 'Improving' : stats.trend === 'down' ? 'Declining — review needed' : 'Stable'}
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={scoreTrend}>
                      <defs>
                        <linearGradient id={`grad-${student.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={student.color} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={student.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="n" tick={{ fill: TEXT_MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[300, 990]} tick={{ fill: TEXT_MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v, 'Est. Score']} />
                      <Area type="monotone" dataKey="score" stroke={student.color} fill={`url(#grad-${student.id})`} strokeWidth={2} dot={{ fill: student.color, r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {catBreakdown.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accuracy by Category</div>
                  <ResponsiveContainer width="100%" height={Math.max(120, catBreakdown.length * 28)}>
                    <BarChart data={catBreakdown} layout="vertical" margin={{ left: 0, right: 24 }}>
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: TEXT_MUTED, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="cat" tickFormatter={k => CAT_LABELS[k] || k} tick={{ fill: TEXT_DIM, fontSize: 10 }} width={90} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`, 'Accuracy']} />
                      <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                        {catBreakdown.map((e, i) => (
                          <Cell key={i} fill={e.pct < 60 ? '#F43F5E' : e.pct < 75 ? '#F59E0B' : '#10B981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {snap === null && (
                <div style={{ textAlign: 'center', padding: '30px', color: TEXT_MUTED, fontSize: 13 }}>
                  No study data yet — the student hasn't logged any sessions.
                </div>
              )}
            </div>
          )}

          {/* MISTAKES TAB */}
          {tab === 'mistakes' && (
            <div>
              {allErrors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ color: '#10B981', fontWeight: 700, fontSize: 14 }}>No unresolved errors</div>
                  <div style={{ color: TEXT_MUTED, fontSize: 12, marginTop: 4 }}>Great performance across all categories!</div>
                </div>
              ) : (
                <div>

                  {/* ── Quick Remediation Strip ────────────────────────── */}
                  {groupedErrors.length > 0 && groupMode === 'category' && (
                    <div style={{ marginBottom: 16, padding: '12px 14px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                        ⚡ Quick Actions — Top Problem Areas
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {groupedErrors.slice(0, 3).map(([groupKey, groupErrors]) => {
                          const qlabel = CAT_LABELS[groupKey] || groupKey
                          const qrem = REMEDIATION[groupKey]
                          const qTotalOcc = groupErrors.reduce((s, e) => s + e.occurrences, 0)
                          const qWorstLevel = (['critical', 'high', 'medium', 'low'] as const).find(l => groupErrors.some(e => e.dangerLevel === l)) ?? 'low'
                          const qlc = LEVEL_CFG[qWorstLevel]
                          const qCatAcc = catBreakdown.find(c => c.cat === groupKey)
                          return (
                            <div key={groupKey} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <div style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: qlc.color, background: qlc.bg, border: `1px solid ${qlc.border}`, borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{qWorstLevel}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>{qlabel}</span>
                                {qCatAcc && <span style={{ fontSize: 11, fontWeight: 600, color: qCatAcc.pct < 60 ? '#F87171' : '#FCD34D' }}>{qCatAcc.pct}%</span>}
                                <span style={{ fontSize: 11, color: TEXT_MUTED }}>×{qTotalOcc}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                <button onClick={() => handleSendDrill(groupKey, qlabel)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`drill:${groupKey}`] ? '#10B98115' : '#0EA5E910', border: `1px solid ${assignFeedback[`drill:${groupKey}`] ? '#10B98130' : '#0EA5E930'}`, color: assignFeedback[`drill:${groupKey}`] ? '#10B981' : '#38BDF8', transition: 'all 0.15s' }}>
                                  {assignFeedback[`drill:${groupKey}`] ?? '⚡ Drill'}
                                </button>
                                {qrem?.lessonId && qrem.lessonTitle && (
                                  <button onClick={() => handleAssignLesson(qrem.lessonId!, qrem.lessonTitle!, groupKey)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`lesson:${groupKey}`] ? '#10B98115' : '#6366F110', border: `1px solid ${assignFeedback[`lesson:${groupKey}`] ? '#10B98130' : '#6366F130'}`, color: assignFeedback[`lesson:${groupKey}`] ? '#10B981' : '#818CF8', transition: 'all 0.15s' }}>
                                    {assignFeedback[`lesson:${groupKey}`] ?? '📖 Lesson'}
                                  </button>
                                )}
                                {qrem?.topicId && qrem.topicTitle && !qrem.lessonId && (
                                  <button onClick={() => handleAssignTopic(qrem.topicId!, qrem.topicTitle!, groupKey)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`topic:${groupKey}`] ? '#10B98115' : '#8B5CF610', border: `1px solid ${assignFeedback[`topic:${groupKey}`] ? '#10B98130' : '#8B5CF625'}`, color: assignFeedback[`topic:${groupKey}`] ? '#10B981' : '#A78BFA', transition: 'all 0.15s' }}>
                                    {assignFeedback[`topic:${groupKey}`] ?? '🎯 Topic'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Controls ──────────────────────────────────────── */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Group mode */}
                    <div style={{ display: 'flex', background: SURFACE, borderRadius: 7, border: `1px solid ${BORDER}`, overflow: 'hidden', flexShrink: 0 }}>
                      {(['category', 'part', 'severity'] as const).map((m, i) => (
                        <button key={m} onClick={() => setGroupMode(m)} style={{ padding: '5px 10px', fontSize: 11, fontWeight: 600, border: 'none', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer', background: groupMode === m ? '#6366F118' : 'transparent', color: groupMode === m ? '#818CF8' : TEXT_MUTED, transition: 'all 0.12s' }}>
                          {m === 'category' ? 'By Topic' : m === 'part' ? 'By Part' : 'By Severity'}
                        </button>
                      ))}
                    </div>
                    {/* Sort */}
                    <select value={sortMode} onChange={e => setSortMode(e.target.value as 'occurrences' | 'recent' | 'severity')} style={{ padding: '5px 8px', fontSize: 11, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_MUTED, outline: 'none', cursor: 'pointer' }}>
                      <option value="occurrences">Most Repeated</option>
                      <option value="recent">Most Recent</option>
                      <option value="severity">Most Severe</option>
                    </select>
                    {/* Part filter */}
                    {(['all', 'part5', 'part6', 'part7'] as const).map(p => (
                      <button key={p} onClick={() => setFilterPart(p)} style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, borderRadius: 5, border: `1px solid ${filterPart === p ? '#6366F145' : BORDER}`, background: filterPart === p ? '#6366F115' : 'transparent', color: filterPart === p ? '#818CF8' : TEXT_MUTED, cursor: 'pointer' }}>
                        {p === 'all' ? 'All Parts' : p.toUpperCase()}
                      </button>
                    ))}
                    {/* Type filter */}
                    {(['all', 'Grammar', 'Vocabulary', 'Trap'] as const).map(t => (
                      <button key={t} onClick={() => setFilterType(t)} style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, borderRadius: 5, border: `1px solid ${filterType === t ? '#6366F145' : BORDER}`, background: filterType === t ? '#6366F115' : 'transparent', color: filterType === t ? '#818CF8' : TEXT_MUTED, cursor: 'pointer' }}>
                        {t === 'all' ? 'All Types' : t}
                      </button>
                    ))}
                    {/* Severity filter */}
                    <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as 'all' | 'critical' | 'high' | 'medium' | 'low')} style={{ padding: '5px 8px', fontSize: 11, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_MUTED, outline: 'none', cursor: 'pointer' }}>
                      <option value="all">All Severity</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    {(filterPart !== 'all' || filterType !== 'all' || filterSeverity !== 'all') && (
                      <button onClick={() => { setFilterPart('all'); setFilterType('all'); setFilterSeverity('all') }} style={{ fontSize: 10, color: TEXT_MUTED, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 7px', background: 'transparent', cursor: 'pointer' }}>Clear ✕</button>
                    )}
                  </div>

                  {/* ── Summary strip ─────────────────────────────────── */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                    {(['critical', 'high', 'medium', 'low'] as const).map(level => {
                      const count = allErrors.filter(e => e.dangerLevel === level).length
                      if (count === 0) return null
                      const c = LEVEL_CFG[level]
                      return (
                        <button key={level} onClick={() => setFilterSeverity(filterSeverity === level ? 'all' : level)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: filterSeverity === level ? c.bg : 'transparent', border: `1px solid ${filterSeverity === level ? c.border : BORDER}`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: c.color, cursor: 'pointer', transition: 'all 0.12s' }}>
                          <span>{count}</span>
                          <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>{level}</span>
                        </button>
                      )
                    })}
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: TEXT_MUTED }}>
                      {filteredErrors.length < allErrors.length && <span style={{ color: '#818CF8' }}>{filteredErrors.length} shown · </span>}
                      {groupedErrors.length} group{groupedErrors.length !== 1 ? 's' : ''} · {allErrors.length} total
                    </div>
                  </div>

                  {/* ── Grouped error list ────────────────────────────── */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {groupedErrors.map(([groupKey, groupErrors]) => {
                      const isCatMode = groupMode === 'category'
                      const label = isCatMode ? (CAT_LABELS[groupKey] || groupKey) : groupMode === 'part' ? groupKey.toUpperCase() : groupKey.charAt(0).toUpperCase() + groupKey.slice(1)
                      const rem = isCatMode ? REMEDIATION[groupKey] : undefined
                      const totalOcc = groupErrors.reduce((s, e) => s + e.occurrences, 0)
                      const worstLevel = (['critical', 'high', 'medium', 'low'] as const).find(l => groupErrors.some(e => e.dangerLevel === l)) ?? 'low'
                      const lc = LEVEL_CFG[worstLevel]
                      const catAcc = isCatMode ? catBreakdown.find(c => c.cat === groupKey) : null
                      const isExpanded = expandedCat === groupKey
                      const repeatCount = groupErrors.filter(e => e.occurrences >= 3).length
                      const mistakeType = rem?.mistakeType ?? (REMEDIATION[groupErrors[0]?.category]?.mistakeType ?? 'Grammar')

                      return (
                        <div key={groupKey} style={{ background: SURFACE, border: `1px solid ${isExpanded ? lc.border : BORDER}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}>

                          {/* Group header */}
                          <div onClick={() => setExpandedCat(isExpanded ? null : groupKey)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer', userSelect: 'none', background: isExpanded ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: lc.color, background: lc.bg, border: `1px solid ${lc.border}`, borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>{worstLevel}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>{label}</span>
                              {catAcc && <span style={{ fontSize: 11, fontWeight: 600, color: catAcc.pct < 60 ? '#F87171' : catAcc.pct < 75 ? '#FCD34D' : '#6EE7B7' }}>{catAcc.pct}% acc</span>}
                              <span style={{ fontSize: 10, color: TEXT_MUTED, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 3, padding: '1px 5px', fontWeight: 600 }}>{mistakeType}</span>
                              {repeatCount > 0 && <span style={{ fontSize: 10, color: '#F87171', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.20)', borderRadius: 3, padding: '1px 5px', fontWeight: 700 }}>🔁 {repeatCount} repeated</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <span style={{ fontSize: 10, color: TEXT_MUTED }}>{groupErrors.length} err · ×{totalOcc}</span>
                              <span style={{ fontSize: 13, color: TEXT_MUTED, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', lineHeight: 1 }}>▾</span>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div style={{ borderTop: `1px solid ${BORDER}` }}>

                              {/* ── Remediation panel ── */}
                              {rem && (
                                <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.04)', borderBottom: `1px solid ${BORDER}` }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Suggested Remediation</div>
                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {rem.lessonId && rem.lessonTitle && (
                                      <button onClick={() => handleAssignLesson(rem.lessonId!, rem.lessonTitle!, groupKey)}
                                        style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`lesson:${groupKey}`] ? '#10B98115' : '#6366F115', border: `1px solid ${assignFeedback[`lesson:${groupKey}`] ? '#10B98135' : '#6366F135'}`, color: assignFeedback[`lesson:${groupKey}`] ? '#10B981' : '#818CF8', transition: 'all 0.15s' }}>
                                        {assignFeedback[`lesson:${groupKey}`] ?? `📖 Assign Lesson: ${rem.lessonTitle}`}
                                      </button>
                                    )}
                                    {rem.topicId && rem.topicTitle && (
                                      <button onClick={() => handleAssignTopic(rem.topicId!, rem.topicTitle!, groupKey)}
                                        style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`topic:${groupKey}`] ? '#10B98115' : '#8B5CF615', border: `1px solid ${assignFeedback[`topic:${groupKey}`] ? '#10B98135' : '#8B5CF635'}`, color: assignFeedback[`topic:${groupKey}`] ? '#10B981' : '#A78BFA', transition: 'all 0.15s' }}>
                                        {assignFeedback[`topic:${groupKey}`] ?? `🎯 Topic Repair: ${rem.topicTitle}`}
                                      </button>
                                    )}
                                    <button onClick={() => handleSendDrill(groupKey, label)}
                                      style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`drill:${groupKey}`] ? '#10B98115' : '#0EA5E915', border: `1px solid ${assignFeedback[`drill:${groupKey}`] ? '#10B98135' : '#0EA5E935'}`, color: assignFeedback[`drill:${groupKey}`] ? '#10B981' : '#38BDF8', transition: 'all 0.15s' }}>
                                      {assignFeedback[`drill:${groupKey}`] ?? '⚡ Drill (20 questions)'}
                                    </button>
                                    {rem.vocab && (
                                      <button onClick={() => handleAssignVocab(groupKey, label)}
                                        style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`vocab:${groupKey}`] ? '#10B98115' : '#F59E0B10', border: `1px solid ${assignFeedback[`vocab:${groupKey}`] ? '#10B98135' : '#F59E0B30'}`, color: assignFeedback[`vocab:${groupKey}`] ? '#10B981' : '#FCD34D', transition: 'all 0.15s' }}>
                                        {assignFeedback[`vocab:${groupKey}`] ?? '📚 Vocab Drill'}
                                      </button>
                                    )}
                                    {rem.part6 && (
                                      <button onClick={() => handleAssignPart6(label, groupKey)}
                                        style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`part6:${groupKey}`] ? '#10B98115' : '#10B98110', border: `1px solid ${assignFeedback[`part6:${groupKey}`] ? '#10B98135' : '#10B98130'}`, color: assignFeedback[`part6:${groupKey}`] ? '#10B981' : '#6EE7B7', transition: 'all 0.15s' }}>
                                        {assignFeedback[`part6:${groupKey}`] ?? '📄 Part 6 Pack'}
                                      </button>
                                    )}
                                    {rem.gapfill && (
                                      <button onClick={() => handleAssignGapfill(label, groupKey)}
                                        style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: assignFeedback[`gapfill:${groupKey}`] ? '#10B98115' : '#EC489910', border: `1px solid ${assignFeedback[`gapfill:${groupKey}`] ? '#10B98135' : '#EC489930'}`, color: assignFeedback[`gapfill:${groupKey}`] ? '#10B981' : '#F9A8D4', transition: 'all 0.15s' }}>
                                        {assignFeedback[`gapfill:${groupKey}`] ?? '🎮 Gap Fill Pack'}
                                      </button>
                                    )}
                                    <button onClick={() => handleAddReviewTogether(groupKey, label, groupErrors[0]?.question?.slice(0, 80) ?? '')}
                                      style={{ fontSize: 11, padding: '5px 11px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: rtAdded === groupKey ? '#10B98115' : 'rgba(255,255,255,0.04)', border: `1px solid ${rtAdded === groupKey ? '#10B98135' : BORDER}`, color: rtAdded === groupKey ? '#10B981' : TEXT_MUTED, transition: 'all 0.15s' }}>
                                      {rtAdded === groupKey ? '✓ In review list' : '+ Review Together'}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* ── Individual errors ── */}
                              {groupErrors.map((err, i) => {
                                const isErrExpanded = expandedError === err.id
                                const dc = LEVEL_CFG[err.dangerLevel]?.color ?? TEXT_MUTED
                                const isRepeated = err.occurrences >= 3
                                const daysSinceFirst = Math.floor((Date.now() - err.timestamp) / 86400000)
                                const errRem = REMEDIATION[err.category]
                                const errMistakeType = errRem?.mistakeType ?? 'Grammar'

                                return (
                                  <div key={err.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                                    {/* Error summary row */}
                                    <div onClick={() => setExpandedError(isErrExpanded ? null : err.id)}
                                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', cursor: 'pointer', background: isErrExpanded ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.1s' }}>
                                      <div style={{ flexShrink: 0, marginTop: 3, width: 8, height: 8, borderRadius: '50%', background: dc, boxShadow: `0 0 0 2px ${dc}25` }} />
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.55, marginBottom: 5 }}>{err.question}</div>
                                        <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
                                          <span style={{ color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 3 }}><XCircle size={10} />{err.opts[err.userAnswer]}</span>
                                          <span style={{ color: TEXT_MUTED }}>→</span>
                                          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle2 size={10} />{err.opts[err.correctAnswer]}</span>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: isRepeated ? '#F87171' : TEXT_MUTED }}>×{err.occurrences}{isRepeated ? ' 🔁' : ''}</span>
                                        <span style={{ fontSize: 9, color: TEXT_MUTED }}>{new Date(err.lastSeen).toLocaleDateString()}</span>
                                        <span style={{ fontSize: 10, transform: isErrExpanded ? 'rotate(180deg)' : 'none', color: TEXT_MUTED, transition: 'transform 0.15s', lineHeight: 1 }}>▾</span>
                                      </div>
                                    </div>

                                    {/* Expanded error detail */}
                                    {isErrExpanded && (
                                      <div style={{ padding: '4px 14px 14px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                          <span style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase' }}>{err.part}</span>
                                          <span style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 4, padding: '2px 7px' }}>{errMistakeType}</span>
                                          {!isCatMode && <span style={{ fontSize: 10, fontWeight: 600, color: TEXT_MUTED, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 4, padding: '2px 7px' }}>{CAT_LABELS[err.category] || err.category}</span>}
                                          <span style={{ fontSize: 10, color: TEXT_MUTED }}>First seen: {daysSinceFirst === 0 ? 'today' : daysSinceFirst === 1 ? 'yesterday' : `${daysSinceFirst}d ago`}</span>
                                          <span style={{ fontSize: 10, color: TEXT_MUTED }}>Last: {new Date(err.lastSeen).toLocaleDateString()}</span>
                                          {isRepeated && <span style={{ fontSize: 10, fontWeight: 700, color: '#F87171', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.20)', borderRadius: 4, padding: '2px 7px' }}>RECURRING PATTERN</span>}
                                        </div>

                                        {/* All 4 options */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          {err.opts.map((opt, idx) => {
                                            const isCorrect = idx === err.correctAnswer
                                            const isWrong = idx === err.userAnswer && !isCorrect
                                            return (
                                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', borderRadius: 7, fontSize: 12, background: isCorrect ? 'rgba(16,185,129,0.07)' : isWrong ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : isWrong ? 'rgba(244,63,94,0.20)' : 'rgba(255,255,255,0.05)'}`, color: isCorrect ? '#6EE7B7' : isWrong ? '#F87171' : TEXT_MUTED }}>
                                                <span style={{ fontSize: 10, fontWeight: 800, width: 14, flexShrink: 0, marginTop: 1, color: isCorrect ? '#10B981' : isWrong ? '#F43F5E' : TEXT_MUTED }}>{isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + idx)}</span>
                                                <span style={{ flex: 1 }}>{opt}</span>
                                                {isWrong && <span style={{ fontSize: 9, color: '#F87171', fontWeight: 700, flexShrink: 0 }}>STUDENT PICKED</span>}
                                                {isCorrect && <span style={{ fontSize: 9, color: '#10B981', fontWeight: 700, flexShrink: 0 }}>CORRECT</span>}
                                              </div>
                                            )
                                          })}
                                        </div>

                                        {/* Explanation */}
                                        {err.explanation && (
                                          <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.7, padding: '9px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 7, borderLeft: `3px solid ${dc}` }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Why this is wrong</div>
                                            {err.explanation}
                                          </div>
                                        )}

                                        {/* Trap warning */}
                                        {err.trap && (
                                          <div style={{ fontSize: 12, color: '#FCD34D', lineHeight: 1.65, padding: '9px 12px', background: 'rgba(245,158,11,0.06)', borderRadius: 7, border: '1px solid rgba(245,158,11,0.22)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                            <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 2, color: '#F59E0B' }} />
                                            <div>
                                              <div style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Why the wrong answer was tempting</div>
                                              {err.trap}
                                            </div>
                                          </div>
                                        )}

                                        {/* Per-error actions */}
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                          <button onClick={() => handleAddReviewTogether(err.id, CAT_LABELS[err.category] || err.category, err.question.slice(0, 80))}
                                            style={{ fontSize: 11, padding: '4px 9px', borderRadius: 5, background: rtAdded === err.id ? '#10B98115' : '#6366F110', border: `1px solid ${rtAdded === err.id ? '#10B98130' : '#6366F125'}`, color: rtAdded === err.id ? '#10B981' : '#818CF8', cursor: 'pointer', fontWeight: 600 }}>
                                            {rtAdded === err.id ? '✓ Added to review' : '+ Review Together'}
                                          </button>
                                          {!isCatMode && errRem?.lessonId && (
                                            <button onClick={() => handleAssignLesson(errRem.lessonId!, errRem.lessonTitle!, err.category)}
                                              style={{ fontSize: 11, padding: '4px 9px', borderRadius: 5, background: '#6366F110', border: '1px solid #6366F125', color: '#818CF8', cursor: 'pointer', fontWeight: 600 }}>
                                              📖 Assign Lesson
                                            </button>
                                          )}
                                          {!isCatMode && (
                                            <button onClick={() => handleSendDrill(err.category, CAT_LABELS[err.category] || err.category)}
                                              style={{ fontSize: 11, padding: '4px 9px', borderRadius: 5, background: '#0EA5E910', border: '1px solid #0EA5E930', color: '#38BDF8', cursor: 'pointer', fontWeight: 600 }}>
                                              ⚡ Send Drill
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GOALS & NOTES TAB */}
          {tab === 'goals' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={12} /> Teacher Note
                </div>
                <textarea
                  value={note}
                  onChange={e => { setNote(e.target.value); setNoteSaved(false) }}
                  placeholder="Private note about this student's progress, focus areas, observations..."
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT_PRIMARY, fontSize: 13, lineHeight: 1.6, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
                <button onClick={saveNote} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: noteSaved ? '#10B981' : '#6366F1', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}>
                  {noteSaved ? '✓ Saved' : 'Save Note'}
                </button>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClipboardList size={12} /> Assignments ({studentAssignments.length})
                </div>

                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, marginBottom: 10 }}>New Assignment</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 8, marginBottom: 8 }}>
                    <input
                      value={newAssign.title}
                      onChange={e => setNewAssign(p => ({ ...p, title: e.target.value }))}
                      placeholder="Assignment title..."
                      style={{ padding: '8px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }}
                    />
                    <select
                      value={newAssign.type}
                      onChange={e => setNewAssign(p => ({ ...p, type: e.target.value as AssignmentType }))}
                      style={{ padding: '8px 10px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 12, outline: 'none' }}
                    >
                      <option value="drill">Grammar Drill</option>
                      <option value="lesson">Lesson</option>
                      <option value="part6">Part 6</option>
                      <option value="vocab">Vocabulary</option>
                      <option value="reading">Reading</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8, marginBottom: 10 }}>
                    <input
                      value={newAssign.description}
                      onChange={e => setNewAssign(p => ({ ...p, description: e.target.value }))}
                      placeholder="Optional instructions..."
                      style={{ padding: '8px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }}
                    />
                    <input
                      type="date"
                      value={newAssign.dueDate}
                      onChange={e => setNewAssign(p => ({ ...p, dueDate: e.target.value }))}
                      style={{ padding: '8px 10px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_DIM, fontSize: 12, outline: 'none' }}
                    />
                  </div>
                  <button onClick={handleAddAssignment} disabled={!newAssign.title.trim()}
                    style={{ padding: '9px 18px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: newAssign.title.trim() ? student.color : SURFACE2, border: 'none', color: '#fff', cursor: newAssign.title.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={13} /> Add Assignment
                  </button>
                </div>

                {studentAssignments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: TEXT_MUTED, fontSize: 13 }}>No assignments yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {studentAssignments.map(a => {
                      const done = completedIds.includes(a.id)
                      const overdue = a.dueDate && a.dueDate < Date.now() && !done
                      const typeColors: Record<AssignmentType, string> = {
                        drill: '#6366F1', lesson: '#10B981', part6: '#0EA5E9',
                        vocab: '#F59E0B', reading: '#8B5CF6', custom: '#F43F5E'
                      }
                      return (
                        <div key={a.id} style={{ background: done ? '#10B98108' : overdue ? '#F43F5E08' : SURFACE2, border: `1px solid ${done ? '#10B98130' : overdue ? '#F43F5E30' : BORDER}`, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ marginTop: 1 }}>
                            {done ? <CheckCircle2 size={15} style={{ color: '#10B981' }} /> : <div style={{ width: 15, height: 15, borderRadius: '50%', border: `1.5px solid ${BORDER}` }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: done ? TEXT_MUTED : TEXT_PRIMARY, textDecoration: done ? 'line-through' : 'none' }}>{a.title}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, color: typeColors[a.type], background: `${typeColors[a.type]}15`, border: `1px solid ${typeColors[a.type]}25`, borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{a.type}</span>
                            </div>
                            {a.description && <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5 }}>{a.description}</div>}
                            <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: TEXT_MUTED }}>
                              <span>Assigned {new Date(a.createdAt).toLocaleDateString()}</span>
                              {a.dueDate && <span style={{ color: overdue ? '#F43F5E' : TEXT_MUTED }}>Due {new Date(a.dueDate).toLocaleDateString()}{overdue ? ' · OVERDUE' : ''}</span>}
                              {done && <span style={{ color: '#10B981' }}>✓ Completed</span>}
                            </div>
                          </div>
                          <button onClick={() => removeAssignment(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, padding: 4 }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRE-MEETING TAB */}
          {tab === 'premeeting' && (() => {
            const summary = generatePreMeetingSummary(snap, student, teacherNotes[student.id])
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '14px 16px', background: '#6366F110', border: '1px solid #6366F125', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Meeting Brief — {student.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Est. Score', value: summary.estimatedScore ?? '—', sub: `Target: ${summary.targetScore}` },
                      { label: 'Gap', value: summary.gap !== null ? `${summary.gap > 0 ? '+' : ''}${summary.gap} pts` : '—', sub: summary.gap !== null && summary.gap > 0 ? 'to target' : summary.gap !== null ? 'above target' : '' },
                      { label: 'Accuracy', value: summary.overallAccuracy !== null ? `${summary.overallAccuracy}%` : '—', sub: `${summary.studyDays} study days` },
                    ].map(({ label, value, sub }) => (
                      <div key={label} style={{ background: SURFACE, borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY }}>{value}</div>
                        <div style={{ fontSize: 9, color: TEXT_MUTED }}>{label}</div>
                        {sub && <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 2 }}>{sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {summary.weakCategories.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Weak Areas</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {summary.weakCategories.map(c => (
                        <span key={c.cat} style={{ fontSize: 12, color: '#F87171', background: '#F43F5E0A', border: '1px solid #F43F5E20', borderRadius: 6, padding: '4px 10px', fontWeight: 600 }}>⚠ {c.cat} — {c.pct}%</span>
                      ))}
                    </div>
                  </div>
                )}

                {summary.repeatedMistakes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Repeated Mistakes</div>
                    {summary.repeatedMistakes.map(m => (
                      <div key={m.topic} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B' }}>{m.topic} <span style={{ color: TEXT_MUTED, fontWeight: 400, fontSize: 12 }}>× {m.count}</span></div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, fontStyle: 'italic' }}>"{m.example}"</div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Suggested Agenda</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {summary.suggestedAgenda.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: SURFACE, borderRadius: 8, fontSize: 13, color: TEXT_DIM }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED, minWidth: 18 }}>{i + 1}.</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {summary.interventionNotes.length > 0 && (
                  <div style={{ padding: '12px 14px', background: '#F59E0B08', border: '1px solid #F59E0B20', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Intervention Notes</div>
                    {summary.interventionNotes.map((n, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#FCD34D', marginBottom: i < summary.interventionNotes.length - 1 ? 6 : 0 }}>• {n}</div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

// ── Google Calendar Panel ──────────────────────────────────────────────────────
function CalendarPanel({ prefillStudent }: { prefillStudent?: string }) {
  const { connected, events, loading, error, connect, createEvent } = useGoogleCalendar()
  const [form, setForm] = useState({
    title: prefillStudent ? `TOEIC Session — ${prefillStudent}` : 'TOEIC Study Session',
    date: '', time: '09:00', duration: 60, description: '',
  })
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (prefillStudent) setForm(p => ({ ...p, title: `TOEIC Session — ${prefillStudent}` }))
  }, [prefillStudent])

  const handleCreate = async () => {
    if (!form.date) return
    setCreating(true)
    const start = new Date(`${form.date}T${form.time}`)
    const result = await createEvent({ title: form.title, start, durationMinutes: form.duration, description: form.description })
    setCreating(false)
    if (result) setCreated(true)
    setTimeout(() => setCreated(false), 2000)
  }

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 460, margin: '0 auto' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 8 }}>Google Calendar Not Configured</div>
        <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7 }}>
          Create a Google Cloud project, enable the Calendar API, and add your Client ID to{' '}
          <code style={{ background: SURFACE, padding: '2px 6px', borderRadius: 4 }}>.env</code> as{' '}
          <code style={{ background: SURFACE, padding: '2px 6px', borderRadius: 4 }}>VITE_GOOGLE_CLIENT_ID=...</code>.
          Then restart the dev server.
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      {!connected ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 8 }}>Connect Google Calendar</div>
          <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 20 }}>Schedule study sessions and set reminders for your students.</div>
          <button onClick={connect} style={{ padding: '12px 24px', borderRadius: 10, background: '#4285F4', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} /> Connect Google Calendar
          </button>
          {error && <div style={{ color: '#F43F5E', fontSize: 12, marginTop: 10 }}>{error}</div>}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 14px', background: '#10B98110', border: '1px solid #10B98130', borderRadius: 10 }}>
            <CheckCircle2 size={14} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>Connected to Google Calendar</span>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px', marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DIM, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Schedule Study Session</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Session title..." style={{ padding: '9px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 8 }}>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ padding: '9px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_DIM, fontSize: 13, outline: 'none' }} />
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ padding: '9px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_DIM, fontSize: 13, outline: 'none' }} />
                <select value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} style={{ padding: '9px 10px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_DIM, fontSize: 12, outline: 'none' }}>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 h</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional notes..." style={{ padding: '9px 12px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 13, outline: 'none' }} />
              <button onClick={handleCreate} disabled={!form.date || creating} style={{ padding: '11px', borderRadius: 8, background: created ? '#10B981' : '#4285F4', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {created ? '✓ Added to Calendar' : creating ? 'Creating...' : <><Plus size={14} /> Add to Google Calendar</>}
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Upcoming TOEIC Sessions</div>
            {loading ? (
              <div style={{ color: TEXT_MUTED, fontSize: 13, textAlign: 'center', padding: 20 }}>Loading...</div>
            ) : events.length === 0 ? (
              <div style={{ color: TEXT_MUTED, fontSize: 13, textAlign: 'center', padding: 20 }}>No upcoming sessions</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {events.map(ev => (
                  <a key={ev.id} href={ev.htmlLink} target="_blank" rel="noopener noreferrer" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#4285F415', border: '1px solid #4285F430', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#4285F4', lineHeight: 1 }}>{new Date(ev.start.dateTime).getDate()}</div>
                      <div style={{ fontSize: 9, color: '#4285F4' }}>{new Date(ev.start.dateTime).toLocaleString('en', { month: 'short' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{ev.summary}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{new Date(ev.start.dateTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Teacher Settings ───────────────────────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: () => void }) {
  const { teacherPin, setTeacherPin, teacherClassCode, setTeacherClassCode } = useRegistryStore()
  const [pin, setPin] = useState(teacherPin)
  const [code, setCode] = useState(teacherClassCode)
  const [saved, setSaved] = useState(false)
  const [codeSaved, setCodeSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(teacherClassCode).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Teacher Settings</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}><X size={18} /></button>
        </div>

        {/* Class code — share with students */}
        <div style={{ marginBottom: 24, padding: '16px', background: '#6366F108', border: '1px solid #6366F125', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Class Code — share with your students
          </div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10, lineHeight: 1.5 }}>
            Students enter this code in <strong style={{ color: TEXT_DIM }}>Settings → Join a Class</strong>.
            Once joined, they appear in your dashboard from any device worldwide.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="CLASS-XXXXXX"
              style={{ flex: 1, padding: '9px 12px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_PRIMARY, fontSize: 15, fontFamily: 'monospace', fontWeight: 700, outline: 'none', letterSpacing: '0.1em' }}
            />
            <button onClick={() => { if (code.trim()) { setTeacherClassCode(code); setCodeSaved(true); setTimeout(() => setCodeSaved(false), 1500) } }}
              style={{ padding: '9px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: codeSaved ? '#10B981' : '#6366F1', border: 'none', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              {codeSaved ? '✓' : 'Save'}
            </button>
            <button onClick={copyCode}
              style={{ padding: '9px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: copied ? '#10B981' : SURFACE, border: `1px solid ${BORDER}`, color: copied ? '#fff' : TEXT_DIM, cursor: 'pointer', flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 8 }}>
            Current code: <code style={{ color: '#818CF8', fontWeight: 700 }}>{teacherClassCode}</code>
          </div>
        </div>

        {/* PIN */}
        <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Change PIN</div>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={8} placeholder="New PIN (min 4 chars)"
          style={{ width: '100%', padding: '10px 14px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT_PRIMARY, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
        <button onClick={() => { if (pin.length >= 4) { setTeacherPin(pin); setSaved(true); setTimeout(() => setSaved(false), 1500) } }}
          style={{ width: '100%', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: saved ? '#10B981' : '#6366F1', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}>
          {saved ? '✓ Saved' : 'Save PIN'}
        </button>
      </div>
    </div>
  )
}

// ── Firebase setup guide card ─────────────────────────────────────────────────
function FirebaseSetupCard() {
  const [open, setOpen] = useState(false)
  const steps = [
    { n: 1, text: 'Go to console.firebase.google.com → "Add project" → any name → Create project' },
    { n: 2, text: 'Left sidebar: Build → Realtime Database → "Create database" → "Start in test mode" → Enable' },
    { n: 3, text: 'Copy the database URL shown (e.g. https://your-project-default-rtdb.firebaseio.com)' },
    { n: 4, text: 'Project Settings (gear icon) → General → "Your apps" → Web (</>)→ Register app → copy firebaseConfig values' },
    { n: 5, text: 'Create .env.local in the project root with VITE_FIREBASE_DATABASE_URL=https://... and all other VITE_FIREBASE_* keys' },
    { n: 6, text: 'Restart the dev server (npm run dev). The banner disappears when Firebase connects.' },
  ]
  return (
    <div style={{ marginBottom: 16, border: '1px solid rgba(245,158,11,0.40)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header — always visible */}
      <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.10)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
           onClick={() => setOpen(v => !v)}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FCD34D', marginBottom: 2 }}>
            Firebase not configured — cross-device monitoring is OFF
          </div>
          <div style={{ fontSize: 11, color: 'rgba(253,211,77,0.65)' }}>
            Students from other devices and countries are invisible to you right now.
            Only same-browser tabs via BroadcastChannel work. Click to see the 6-step fix.
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#FCD34D', flexShrink: 0 }}>{open ? '▲ Hide' : '▼ Fix this'}</span>
      </div>

      {/* Expandable setup steps */}
      {open && (
        <div style={{ padding: '16px 18px', background: 'rgba(245,158,11,0.05)', borderTop: '1px solid rgba(245,158,11,0.20)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            How to enable global teacher monitoring (free, ~5 minutes)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(245,158,11,0.20)', border: '1px solid rgba(245,158,11,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#FCD34D', flexShrink: 0, marginTop: 1 }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(253,211,77,0.80)', lineHeight: 1.55 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, color: '#FCD34D', lineHeight: 1.8 }}>
            <div style={{ color: 'rgba(253,211,77,0.45)', marginBottom: 4 }}># .env.local (create in project root)</div>
            VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com<br/>
            VITE_FIREBASE_API_KEY=AIzaSy...<br/>
            VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com<br/>
            VITE_FIREBASE_PROJECT_ID=your-project-id<br/>
            VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com<br/>
            VITE_FIREBASE_MESSAGING_SENDER_ID=123456789<br/>
            VITE_FIREBASE_APP_ID=1:123456789:web:abc123
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(253,211,77,0.50)' }}>
            A full template is at <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4 }}>.env.local.template</code> in your project root.
          </div>
        </div>
      )}
    </div>
  )
}

// ── Class code share card ─────────────────────────────────────────────────────
function ClassCodeCard({ teacherClassCode }: { teacherClassCode: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(teacherClassCode).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <div style={{ padding: '14px 16px', background: '#6366F108', border: '1px solid #6366F128', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Your Class Code — share this with students
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_PRIMARY, fontFamily: 'monospace', letterSpacing: '0.12em' }}>
          {teacherClassCode}
        </div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 3 }}>
          Students enter this in <strong style={{ color: TEXT_DIM }}>Settings → Join a Class</strong>, then log in.
          {FIREBASE_ENABLED
            ? ' They appear here in real-time from any device worldwide.'
            : ' Configure Firebase to see students from other devices.'}
        </div>
      </div>
      <button onClick={copy} style={{
        padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
        background: copied ? '#10B981' : '#6366F1', border: 'none', color: '#fff',
        cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {copied ? '✓ Copied!' : 'Copy Code'}
      </button>
    </div>
  )
}

// ── Cross-tab student list helper ─────────────────────────────────────────────
function getStudentsFromStorage(): StudentMeta[] {
  try {
    const raw = localStorage.getItem('toeic-warroom-registry')
    if (!raw) return []
    const { state } = JSON.parse(raw) as { state?: { students?: StudentMeta[] } }
    return state?.students ?? []
  } catch { return [] }
}

// ── Unified roster entry (cloud + local merged) ───────────────────────────────
export interface RosterEntry {
  id: string
  name: string
  avatar: string
  color: string
  email?: string
  photoUrl?: string
  targetScore: number
  lastStudied: number | null
  // presence
  presenceStatus: 'active' | 'idle' | 'offline'
  presenceTs: number | null
  currentActivity: string | null
  minutesAgo: number | null
  // stats
  score: number | null
  accuracy: number | null
  sessions: number
  errors: number
  xp: number
  streak: number
  completedLessons: number
  part6Acc: number | null
  weakCats: string[]
  trend: 'up' | 'down' | 'flat'
  fromCloud: boolean
  studentMeta: StudentMeta
}

function presenceFromCloudTs(
  presence: { ts?: number; online?: boolean } | undefined,
  activity: { ts: number; label: string }[],
): Pick<RosterEntry, 'presenceStatus' | 'presenceTs' | 'currentActivity' | 'minutesAgo'> {
  const ts = presence?.ts ?? 0
  if (!ts) return { presenceStatus: 'offline', presenceTs: null, currentActivity: null, minutesAgo: null }
  const diff = Date.now() - ts
  const minutesAgo = Math.floor(diff / 60000)
  let presenceStatus: 'active' | 'idle' | 'offline' =
    presence?.online === false ? 'offline' :
    diff < 90_000 ? 'active' :
    diff < 900_000 ? 'idle' :
    'offline'
  const latest = activity.length > 0 ? activity[activity.length - 1] : null
  const actDiff = latest ? Date.now() - latest.ts : Infinity
  const currentActivity = actDiff < 180_000 ? (latest?.label ?? null) : null
  return { presenceStatus, presenceTs: ts, currentActivity, minutesAgo }
}

// ── Main TeacherDashboard ─────────────────────────────────────────────────────
type MainTab = 'overview' | 'students' | 'assignments' | 'activity' | 'calendar'

export default function TeacherDashboard() {
  const { students: storeStudents, setTeacherMode, assignments, removeAssignment, reviewTogetherItems,
          teacherClassCode, setTeacherClassCode } = useRegistryStore()

  // ── Local state ────────────────────────────────────────────────────────────
  const [students, setStudents] = useState<StudentMeta[]>(() => {
    const fromStorage = getStudentsFromStorage()
    return fromStorage.length > 0 ? fromStorage : storeStudents
  })
  const [cloudData, setCloudData] = useState<CloudClassData>({})

  const [tab, setTab] = useState<MainTab>('students')
  const [selectedStudent, setSelectedStudent] = useState<StudentMeta | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [calendarPrefill, setCalendarPrefill] = useState<string | undefined>()
  const [snapshotKey, setSnapshotKey] = useState(0)

  // ── Firebase subscription ──────────────────────────────────────────────────
  // Subscribes to all students under the teacher's class code.
  // onValue pushes updates in real-time from any device worldwide.
  useEffect(() => {
    if (!teacherClassCode) return
    const unsubscribe = subscribeToClass(teacherClassCode, (data) => {
      setCloudData(data)
    })
    return unsubscribe
  }, [teacherClassCode])

  // ── BroadcastChannel (Tier 1: same-browser, any tab) ──────────────────────
  // Receives messages instantly when a student joins or logs in within the same
  // browser — no Firebase or localStorage polling needed. On message, we inject
  // the student into cloudData so they appear in the roster immediately.
  const [broadcastData, setBroadcastData] = useState<CloudClassData>({})

  useEffect(() => {
    if (!teacherClassCode) return
    const unsubscribe = subscribeToLocalClass(teacherClassCode, (msg: LocalBroadcastMessage) => {
      setBroadcastData(prev => ({
        ...prev,
        [msg.studentId]: {
          ...(prev[msg.studentId] ?? {}),
          profile: { ...msg.profile, updatedAt: Date.now() },
          presence: msg.presence ?? { ts: Date.now(), online: true },
          ...(msg.stats ? { stats: msg.stats } : {}),
          ...(msg.recentActivity ? { recentActivity: msg.recentActivity } : {}),
        },
      }))
    })
    return unsubscribe
  }, [teacherClassCode])

  // ── Local refresh (same-device fallback via localStorage polling) ──────────
  const doRefresh = useCallback(() => {
    setStudents(prev => {
      const fresh = getStudentsFromStorage()
      return fresh.length > 0 ? fresh : prev
    })
    setSnapshotKey(k => k + 1)
  }, [])

  useEffect(() => {
    const interval = setInterval(doRefresh, 15000)
    return () => clearInterval(interval)
  }, [doRefresh])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (
        e.key === 'toeic-warroom-registry' ||
        e.key?.startsWith('toeic-warroom-student-') ||
        e.key?.startsWith('toeic-warroom-presence-')
      ) {
        doRefresh()
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [doRefresh])

  const allSnapshots = useMemo(() => getAllStudentSnapshots(), [snapshotKey])

  // ── Merged roster ──────────────────────────────────────────────────────────
  // Three sources merged in priority order:
  //   1. Firebase (cloudData)  — global, any device
  //   2. BroadcastChannel (broadcastData) — same browser, instant, no Firebase needed
  //   3. localStorage (students)  — same device fallback
  const roster = useMemo((): RosterEntry[] => {
    const entries: RosterEntry[] = []
    // Merge Firebase + BroadcastChannel data; Firebase wins on conflict
    const mergedCloud: CloudClassData = { ...broadcastData, ...cloudData }
    const cloudIds = new Set(Object.keys(mergedCloud))

    // 1. Cloud/broadcast students — Firebase (global) or BroadcastChannel (same browser)
    for (const [id, cd] of Object.entries(mergedCloud)) {
      const localMeta = students.find(s => s.id === id)
      const profile = cd.profile ?? {}
      const activity = (cd.recentActivity ?? [])
      const pres = presenceFromCloudTs(cd.presence, activity)
      const stats = cd.stats ?? {}
      const meta: StudentMeta = localMeta ?? {
        id,
        name: profile.name ?? 'Unknown',
        avatar: profile.avatar ?? '🎯',
        color: profile.color ?? '#6366F1',
        email: profile.email,
        photoUrl: profile.photoUrl,
        targetScore: profile.targetScore ?? 900,
        createdAt: Date.now(),
        lastStudied: null,
      }
      entries.push({
        id,
        name: profile.name ?? meta.name,
        avatar: profile.avatar ?? meta.avatar,
        color: profile.color ?? meta.color,
        email: profile.email ?? meta.email,
        photoUrl: profile.photoUrl ?? meta.photoUrl,
        targetScore: profile.targetScore ?? meta.targetScore,
        lastStudied: localMeta?.lastStudied ?? null,
        ...pres,
        score: stats.score ?? null,
        accuracy: stats.accuracy ?? null,
        sessions: stats.sessions ?? 0,
        errors: stats.errors ?? 0,
        xp: stats.xp ?? 0,
        streak: stats.streak ?? 0,
        completedLessons: stats.completedLessons ?? 0,
        part6Acc: stats.part6Acc ?? null,
        weakCats: stats.weakCats ?? [],
        trend: stats.trend ?? 'flat',
        fromCloud: true,
        studentMeta: meta,
      })
    }

    // 2. Local-only students — same device, haven't joined the class via code
    for (const student of students) {
      if (cloudIds.has(student.id)) continue
      const snap = allSnapshots[student.id] ?? null
      const localStats = computeStats(snap, student)
      entries.push({
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        color: student.color,
        email: student.email,
        photoUrl: student.photoUrl,
        targetScore: student.targetScore,
        lastStudied: student.lastStudied,
        presenceStatus: localStats.presence.status,
        presenceTs: localStats.presence.lastSeen,
        currentActivity: localStats.presence.currentActivity,
        minutesAgo: localStats.presence.minutesAgo,
        score: localStats.score,
        accuracy: localStats.accuracy,
        sessions: localStats.sessions,
        errors: localStats.errors,
        xp: localStats.xp,
        streak: localStats.streak,
        completedLessons: localStats.completedLessons,
        part6Acc: localStats.part6Acc,
        weakCats: localStats.weakCats,
        trend: localStats.trend,
        fromCloud: false,
        studentMeta: student,
      })
    }

    return entries
  }, [cloudData, broadcastData, students, allSnapshots])

  // Keep allStats for backward compat with overview/activity tabs
  const allStats = useMemo(() =>
    students.map(s => ({ student: s, stats: computeStats(allSnapshots[s.id] ?? null, s) })),
    [students, allSnapshots]
  )

  const classStats = useMemo(() => {
    // Use roster (includes cloud students) for accurate global counts
    const withScore = roster.filter(x => x.score !== null)
    const avgScore = withScore.length ? Math.round(withScore.reduce((s, x) => s + x.score!, 0) / withScore.length) : null
    const withAcc = roster.filter(x => x.accuracy !== null)
    const avgAcc = withAcc.length ? Math.round(withAcc.reduce((s, x) => s + x.accuracy!, 0) / withAcc.length) : null
    const activeNow = roster.filter(x => x.presenceStatus === 'active').length
    const totalErrors = roster.reduce((s, x) => s + x.errors, 0)
    const overdueAssigns = assignments.filter(a => {
      const snap = allSnapshots[a.studentId]
      return a.dueDate && a.dueDate < Date.now() && !(snap?.completedAssignments ?? []).includes(a.id)
    }).length
    return { avgScore, avgAcc, activeNow, totalErrors, overdueAssigns }
  }, [roster, assignments, allSnapshots])

  const classAlerts = useMemo(() => generateClassAlerts(allSnapshots, students), [allSnapshots, students])

  const handleSchedule = useCallback((studentName: string) => {
    setCalendarPrefill(studentName)
    setTab('calendar')
  }, [])

  const tabStyle = (t: MainTab) => ({
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: tab === t ? '#6366F120' : 'none',
    border: `1px solid ${tab === t ? '#6366F140' : 'transparent'}`,
    color: tab === t ? '#818CF8' : TEXT_MUTED, transition: 'all 0.15s', whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSchedule={handleSchedule}
        />
      )}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Header */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={() => setTeacherMode(false)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: 13 }}>
            <ArrowLeft size={14} /> Profiles
          </button>
          <div style={{ width: 1, height: 16, background: BORDER }} />
          <GraduationCap size={15} style={{ color: '#6366F1' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>Teacher View</span>
          {classStats.activeNow > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: '#10B98115', border: '1px solid #10B98125', borderRadius: 12, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              {classStats.activeNow} active
            </span>
          )}
          <FirebaseStatusBadge size="compact" />
        </div>
        <div style={{ display: 'flex', gap: 6, overflow: 'auto', flexShrink: 1 }}>
          {(['overview', 'students', 'assignments', 'activity', 'calendar'] as MainTab[]).map((t, i) => {
            const labels = ['Overview', `Students (${students.length})`, 'Assignments', 'Activity', 'Calendar']
            return <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{labels[i]}</button>
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={doRefresh} title="Refresh data"
            style={{ padding: '8px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT_DIM, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={13} />
          </button>
          <button onClick={() => setShowSettings(true)}
            style={{ padding: '8px', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT_DIM, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Settings size={13} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Class Overview</h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0 }}>{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
            </div>

            {/* Class alerts */}
            {classAlerts.length > 0 && (
              <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {classAlerts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: a.severity === 'critical' ? '#F43F5E08' : a.severity === 'warning' ? '#F59E0B08' : '#6366F108', border: `1px solid ${a.severity === 'critical' ? '#F43F5E25' : a.severity === 'warning' ? '#F59E0B25' : '#6366F125'}`, borderRadius: 10 }}>
                    <Bell size={13} style={{ color: a.severity === 'critical' ? '#F43F5E' : a.severity === 'warning' ? '#F59E0B' : '#818CF8', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: a.severity === 'critical' ? '#F87171' : a.severity === 'warning' ? '#FCD34D' : '#818CF8' }}>{a.title}</span>
                      <span style={{ fontSize: 12, color: TEXT_MUTED, marginLeft: 8 }}>{a.message}</span>
                    </div>
                    {a.category && (
                      <button onClick={() => setTab('students')} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: '#6366F115', border: '1px solid #6366F125', color: '#818CF8', cursor: 'pointer', fontWeight: 600 }}>
                        View students →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 20 }}>
              {[
                { label: 'Class Avg Score', value: classStats.avgScore ?? '—', color: '#6366F1', icon: <TrendingUp size={12} /> },
                { label: 'Avg Accuracy', value: classStats.avgAcc !== null ? `${classStats.avgAcc}%` : '—', color: '#10B981', icon: <Target size={12} /> },
                { label: 'Active Now', value: classStats.activeNow, color: '#10B981', icon: <Zap size={12} /> },
                { label: 'Unresolved Errors', value: classStats.totalErrors, color: classStats.totalErrors > 10 ? '#F43F5E' : TEXT_DIM, icon: <AlertTriangle size={12} /> },
                { label: 'Overdue Tasks', value: classStats.overdueAssigns, color: classStats.overdueAssigns > 0 ? '#F43F5E' : TEXT_DIM, icon: <ClipboardList size={12} /> },
                { label: 'Review Together', value: reviewTogetherItems.length, color: '#8B5CF6', icon: <Activity size={12} /> },
              ].map(({ label, value, color, icon }) => (
                <div key={label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, color }}>{icon}<span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span></div>
                  <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Student quick-cards */}
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: TEXT_MUTED }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DIM, marginBottom: 6 }}>No students yet</div>
                <div style={{ fontSize: 13 }}>Students appear here once they log in and create a profile.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10 }}>
                {allStats
                  .sort((a, b) => {
                    // Sort: active first, then idle, then offline
                    const order = { active: 0, idle: 1, offline: 2 }
                    return order[a.stats.presence.status] - order[b.stats.presence.status]
                  })
                  .map(({ student, stats }) => {
                    const studentAlerts = generateTeacherStudentAlerts(allSnapshots[student.id] ?? null, student)
                    const hasAlert = studentAlerts.some(a => a.severity === 'critical')
                    return (
                      <div key={student.id} style={{ background: SURFACE, border: `1px solid ${hasAlert ? '#F43F5E30' : BORDER}`, borderRadius: 12, padding: '14px', position: 'relative', overflow: 'hidden' }}>
                        {hasAlert && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F43F5E' }} />}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          {student.photoUrl
                            ? <img src={student.photoUrl} style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
                            : <div style={{ width: 34, height: 34, borderRadius: 8, fontSize: 17, background: `${student.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{student.avatar}</div>
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {student.name}
                              <PresenceDot status={stats.presence.status} label={false} />
                            </div>
                            <div style={{ fontSize: 10, color: TEXT_MUTED }}>
                              {stats.presence.status === 'active' && stats.presence.currentActivity
                                ? <span style={{ color: '#10B981' }}>{stats.presence.currentActivity}</span>
                                : stats.presence.status === 'idle'
                                ? `Idle ${stats.presence.minutesAgo}m ago`
                                : formatRelative(student.lastStudied)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <TrendIcon trend={stats.trend} />
                            <span style={{ fontSize: 18, fontWeight: 800, color: student.color }}>{stats.score ?? '—'}</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 8 }}>
                          {[
                            { l: 'Accuracy', v: stats.accuracy !== null ? `${stats.accuracy}%` : '—', c: stats.accuracy !== null ? (stats.accuracy >= 75 ? '#10B981' : '#F59E0B') : TEXT_MUTED },
                            { l: 'Sessions', v: stats.sessions, c: TEXT_DIM },
                            { l: 'Errors', v: stats.errors, c: stats.errors > 5 ? '#F43F5E' : '#10B981' },
                          ].map(({ l, v, c }) => (
                            <div key={l} style={{ background: SURFACE2, borderRadius: 5, padding: '5px', textAlign: 'center' }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</div>
                              <div style={{ fontSize: 9, color: TEXT_MUTED }}>{l}</div>
                            </div>
                          ))}
                        </div>

                        {stats.weakCats.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                            {stats.weakCats.map(cat => (
                              <span key={cat} style={{ fontSize: 9, color: '#F87171', background: '#F43F5E0A', border: '1px solid #F43F5E20', borderRadius: 4, padding: '2px 5px', fontWeight: 600 }}>⚠ {CAT_LABELS[cat] || cat}</span>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setSelectedStudent(student)}
                            style={{ flex: 1, padding: '7px', borderRadius: 7, background: `${student.color}15`, border: `1px solid ${student.color}25`, color: student.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <Eye size={11} /> Report
                          </button>
                          <button onClick={() => handleSchedule(student.name)}
                            style={{ padding: '7px 10px', borderRadius: 7, background: '#4285F410', border: '1px solid #4285F425', color: '#4285F4', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={11} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB — global roster (Firebase cloud + local fallback) */}
        {tab === 'students' && (() => {
          const sorted = [...roster].sort((a, b) => {
            const order = { active: 0, idle: 1, offline: 2 }
            return order[a.presenceStatus] - order[b.presenceStatus]
          })
          const activeCount = roster.filter(x => x.presenceStatus === 'active').length
          const idleCount = roster.filter(x => x.presenceStatus === 'idle').length
          const offlineCount = roster.filter(x => x.presenceStatus === 'offline').length
          return (
            <div>
              {/* Roster header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Student Roster</h2>
                  <p style={{ fontSize: 12, color: TEXT_MUTED, margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span>{roster.length} student{roster.length !== 1 ? 's' : ''}</span>
                    <FirebaseStatusBadge size="compact" />
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#10B981', background: '#10B98112', border: '1px solid #10B98128', borderRadius: 20, padding: '4px 10px' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 0 2px #10B98140' }} />
                      {activeCount} active
                    </span>
                  )}
                  {idleCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#F59E0B', background: '#F59E0B12', border: '1px solid #F59E0B28', borderRadius: 20, padding: '4px 10px' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                      {idleCount} idle
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: TEXT_MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '4px 10px' }}>
                    {offlineCount} offline
                  </span>
                </div>
              </div>

              {/* Class code share card — always visible so teacher can copy/share easily */}
              <ClassCodeCard teacherClassCode={teacherClassCode} />

              {/* Firebase not configured — prominent action card */}
              {!FIREBASE_ENABLED && <FirebaseSetupCard />}

              {sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: TEXT_MUTED }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DIM, marginBottom: 6 }}>No students yet</div>
                  <div style={{ fontSize: 13 }}>
                    {FIREBASE_ENABLED
                      ? 'Share your class code above with students. They enter it in their app under Settings → "Join a Class", then log in.'
                      : 'Students appear here once they log in on this device. For global monitoring, configure Firebase first.'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sorted.map(entry => {
                    const sAlerts = generateTeacherStudentAlerts(allSnapshots[entry.id] ?? null, entry.studentMeta)
                    const isActive = entry.presenceStatus === 'active'
                    const isIdle = entry.presenceStatus === 'idle'
                    const borderColor = sAlerts.some(a => a.severity === 'critical') ? '#F43F5E30'
                      : isActive ? '#10B98128'
                      : BORDER
                    return (
                      <div key={entry.id} style={{ background: SURFACE, border: `1px solid ${borderColor}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
                        {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#10B981', borderRadius: '12px 0 0 12px' }} />}

                        {entry.photoUrl
                          ? <img src={entry.photoUrl} style={{ width: 46, height: 46, borderRadius: 11, objectFit: 'cover', flexShrink: 0 }} />
                          : <div style={{ width: 46, height: 46, borderRadius: 11, fontSize: 22, background: `${entry.color}18`, border: `1.5px solid ${entry.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{entry.avatar}</div>
                        }

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{entry.name}</span>
                            <PresenceDot status={entry.presenceStatus} />
                            {entry.fromCloud && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', background: '#6366F110', border: '1px solid #6366F125', borderRadius: 4, padding: '1px 5px' }}>LIVE</span>
                            )}
                            {entry.email && <span style={{ fontSize: 11, color: TEXT_MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.email}</span>}
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: isActive ? '#10B981' : isIdle ? '#F59E0B' : TEXT_MUTED, flexShrink: 0 }}>
                              {entry.minutesAgo !== null && entry.presenceStatus !== 'offline'
                                ? (entry.minutesAgo === 0 ? 'just now' : `${entry.minutesAgo}m ago`)
                                : formatRelative(entry.lastStudied)}
                            </span>
                          </div>

                          {(isActive || isIdle) && (
                            <div style={{ fontSize: 11, color: isActive ? '#10B981' : '#F59E0B', marginBottom: 4, fontStyle: 'italic' }}>
                              {entry.currentActivity ?? (isActive ? 'App open' : 'Away')}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: TEXT_DIM }}>
                            <span>Score: <strong style={{ color: entry.color }}>{entry.score ?? '—'}</strong> <TrendIcon trend={entry.trend} /></span>
                            <span>Acc: <strong style={{ color: entry.accuracy !== null ? (entry.accuracy >= 75 ? '#10B981' : '#F59E0B') : TEXT_MUTED }}>{entry.accuracy !== null ? `${entry.accuracy}%` : '—'}</strong></span>
                            {entry.score !== null ? (
                              <span style={{ fontWeight: 600, color: entry.targetScore - entry.score > 150 ? '#F87171' : entry.targetScore - entry.score > 0 ? '#FCD34D' : '#10B981' }}>
                                {entry.targetScore - entry.score > 0 ? `${entry.targetScore - entry.score} pts to ${entry.targetScore}` : '✓ Target reached'}
                              </span>
                            ) : (
                              <span style={{ color: TEXT_MUTED }}>Target {entry.targetScore}</span>
                            )}
                            <span style={{ color: TEXT_MUTED }}>{entry.sessions} sess · {entry.errors} err</span>
                          </div>

                          {sAlerts.length > 0 && (
                            <div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {sAlerts.map(a => (
                                <span key={a.id} style={{ fontSize: 10, color: a.severity === 'critical' ? '#F87171' : '#FCD34D', background: a.severity === 'critical' ? '#F43F5E0A' : '#F59E0B0A', border: `1px solid ${a.severity === 'critical' ? '#F43F5E20' : '#F59E0B20'}`, borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>⚠ {a.title}</span>
                              ))}
                            </div>
                          )}
                          {entry.weakCats.length > 0 && sAlerts.length === 0 && (
                            <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                              {entry.weakCats.map(cat => (
                                <span key={cat} style={{ fontSize: 10, color: '#F87171', background: '#F43F5E0A', border: '1px solid #F43F5E20', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>⚠ {CAT_LABELS[cat] || cat}</span>
                              ))}
                            </div>
                          )}
                          {(() => {
                            const lastAct = entry.presenceTs ?? entry.lastStudied ?? null
                            const daysSince = lastAct ? Math.floor((Date.now() - lastAct) / 86400000) : null
                            return daysSince !== null && daysSince >= 7 && entry.sessions > 0 && entry.presenceStatus === 'offline' ? (
                              <div style={{ marginTop: 5 }}>
                                <span style={{ fontSize: 10, color: '#F87171', background: '#F43F5E0A', border: '1px solid #F43F5E20', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>
                                  🕐 Inactive {daysSince}d — check in
                                </span>
                              </div>
                            ) : null
                          })()}
                        </div>

                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button onClick={() => handleSchedule(entry.name)}
                            style={{ padding: '8px 10px', borderRadius: 7, background: '#4285F410', border: '1px solid #4285F425', color: '#4285F4', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={12} />
                          </button>
                          <button onClick={() => setSelectedStudent(entry.studentMeta)}
                            style={{ padding: '8px 14px', borderRadius: 8, background: `${entry.color}15`, border: `1px solid ${entry.color}25`, color: entry.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Eye size={12} /> View
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

        {/* ASSIGNMENTS TAB */}
        {tab === 'assignments' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 6px', letterSpacing: '-0.02em' }}>All Assignments</h2>
            <p style={{ fontSize: 13, color: TEXT_MUTED, margin: '0 0 20px' }}>Open a student's report → Goals & Notes to create assignments. Here you can track and remove them.</p>
            {assignments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: TEXT_MUTED }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DIM, marginBottom: 6 }}>No assignments yet</div>
                <div style={{ fontSize: 13 }}>Go to a student's report to create assignments.</div>
              </div>
            ) : (
              <div>
                {students.map(student => {
                  const studentAssigns = assignments.filter(a => a.studentId === student.id)
                  if (studentAssigns.length === 0) return null
                  const snap = allSnapshots[student.id]
                  const completedIds = snap?.completedAssignments ?? []
                  return (
                    <div key={student.id} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 18 }}>{student.avatar}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{student.name}</span>
                        <span style={{ fontSize: 11, color: TEXT_MUTED }}>{studentAssigns.filter(a => completedIds.includes(a.id)).length}/{studentAssigns.length} done</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {studentAssigns.map(a => {
                          const done = completedIds.includes(a.id)
                          const overdue = a.dueDate && a.dueDate < Date.now() && !done
                          return (
                            <div key={a.id} style={{ background: done ? '#10B98108' : SURFACE, border: `1px solid ${done ? '#10B98125' : overdue ? '#F43F5E30' : BORDER}`, borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                              {done ? <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${BORDER}`, flexShrink: 0 }} />}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: done ? TEXT_MUTED : TEXT_PRIMARY }}>{a.title}</div>
                                {a.description && <div style={{ fontSize: 12, color: TEXT_MUTED }}>{a.description}</div>}
                                <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                                  {a.dueDate && <span style={{ color: overdue ? '#F43F5E' : TEXT_MUTED }}>Due {new Date(a.dueDate).toLocaleDateString()} · </span>}
                                  {done ? <span style={{ color: '#10B981' }}>Completed</span> : <span>Pending</span>}
                                </div>
                              </div>
                              <button onClick={() => removeAssignment(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}><Trash2 size={14} /></button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY FEED TAB */}
        {tab === 'activity' && (() => {
          type FeedItem = { ts: number; studentName: string; studentAvatar: string; studentColor: string; label: string; type: string; presence: 'active' | 'idle' | 'offline' }
          const feedItems: FeedItem[] = []
          for (const { student, stats } of allStats) {
            const snap = allSnapshots[student.id]
            for (const ev of snap?.activityLog ?? []) {
              feedItems.push({ ts: ev.ts, studentName: student.name, studentAvatar: student.avatar, studentColor: student.color, label: ev.label, type: ev.type, presence: stats.presence.status })
            }
          }
          feedItems.sort((a, b) => b.ts - a.ts)
          const TYPE_ICON: Record<string, string> = {
            drill_start: '▶', drill_complete: '✓', lesson_start: '📖', lesson_complete: '🎓',
            part6_start: '▶', part6_complete: '✓', vocab_session: '🃏', reading_start: '▶',
            reading_complete: '✓', login: '👤', error_made: '⚠', error_resolved: '✅',
            assignment_complete: '📋', gapfill_complete: '🧩',
          }
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Activity size={17} style={{ color: '#6366F1' }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT_PRIMARY, margin: 0, letterSpacing: '-0.02em' }}>Class Activity Feed</h2>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{feedItems.length} events</span>
                <span style={{ fontSize: 11, color: TEXT_MUTED, marginLeft: 'auto' }}>Auto-refreshes every 15s</span>
                <button onClick={doRefresh} style={{ padding: '5px 10px', borderRadius: 6, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_DIM, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <RefreshCw size={11} /> Refresh
                </button>
              </div>
              {feedItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: TEXT_MUTED }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📡</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DIM, marginBottom: 6 }}>No activity yet</div>
                  <div style={{ fontSize: 13 }}>Activity will appear here as students study. Make sure students have logged at least one session.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {feedItems.slice(0, 80).map((item, i) => {
                    const diff = Date.now() - item.ts
                    const when = diff < 60000 ? 'just now' : diff < 3600000 ? `${Math.floor(diff / 60000)}m ago` : diff < 86400000 ? `${Math.floor(diff / 3600000)}h ago` : formatRelative(item.ts)
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: `${item.studentColor}18`, border: `1.5px solid ${item.studentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{item.studentAvatar}</div>
                          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 7, height: 7, borderRadius: '50%', background: PRESENCE_COLOR[item.presence], border: `1.5px solid ${SURFACE}` }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: item.studentColor }}>{item.studentName}</span>
                          <span style={{ fontSize: 13, color: TEXT_DIM }}> {TYPE_ICON[item.type] ?? '·'} {item.label}</span>
                        </div>
                        <span style={{ fontSize: 11, color: TEXT_MUTED, flexShrink: 0 }}>{when}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT_PRIMARY, margin: '0 0 20px', letterSpacing: '-0.02em' }}>Google Calendar</h2>
            {calendarPrefill && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: '#4285F410', border: '1px solid #4285F430', borderRadius: 10, fontSize: 13, color: '#4285F4', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={13} />
                Scheduling session for <strong>{calendarPrefill}</strong>
                <button onClick={() => setCalendarPrefill(undefined)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, marginLeft: 'auto' }}><X size={13} /></button>
              </div>
            )}
            <CalendarPanel prefillStudent={calendarPrefill} />
          </div>
        )}
      </div>
    </div>
  )
}
