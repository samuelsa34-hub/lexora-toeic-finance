import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, AlertTriangle, BookOpen, BarChart2, CheckCircle2, ChevronRight, TrendingUp, Award, Calendar, RefreshCw } from 'lucide-react'
import { useAppStore, estimateScore } from '../../store/useAppStore'
import { useRegistryStore } from '../../store/useRegistryStore'
import { generateActionPlan } from '../../utils/actionPlanEngine'
import { generateStudentAlerts } from '../../utils/alertEngine'
import { generateWeeklyReport } from '../../utils/weeklyReport'
import { computeBadges, computeNextBadge } from '../../utils/badgeEngine'
import type { ActionPlanItem, ActionPriority } from '../../types'
import { CAT_LABELS } from '../../utils/constants'

const BG = '#060B14'
const SURFACE = '#0D1626'
const SURFACE2 = '#111827'
const BORDER = '#1E293B'
const TEXT_PRIMARY = '#F8FAFC'
const TEXT_MUTED = '#64748B'
const TEXT_DIM = '#94A3B8'

const PRIORITY_COLORS: Record<ActionPriority, string> = {
  critical: '#F43F5E',
  high: '#F59E0B',
  medium: '#6366F1',
  low: '#10B981',
}
const PRIORITY_BG: Record<ActionPriority, string> = {
  critical: '#F43F5E0A',
  high: '#F59E0B0A',
  medium: '#6366F10A',
  low: '#10B9810A',
}

const TYPE_ICONS: Record<string, string> = {
  drill: '⚡', lesson: '📖', part6: '📄', reading: '📰',
  vocab: '🔤', review_errors: '🔍', mock: '📊', gapfill: '🎮',
}

function ActionCard({ item, onGo }: { item: ActionPlanItem; onGo: () => void }) {
  const [hovered, setHovered] = useState(false)
  const c = PRIORITY_COLORS[item.priority]
  return (
    <div
      style={{
        background: hovered ? `${c}0A` : SURFACE,
        border: `1px solid ${hovered ? c + '40' : BORDER}`,
        borderRadius: 12, padding: '16px',
        transition: 'all 0.15s', cursor: 'pointer',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onGo}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: PRIORITY_BG[item.priority], border: `1px solid ${c}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
      }}>
        {TYPE_ICONS[item.type] ?? '📌'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: c, background: `${c}15`, border: `1px solid ${c}25`,
            borderRadius: 4, padding: '2px 6px',
          }}>{item.priority}</span>
          <span style={{ fontSize: 11, color: TEXT_MUTED }}>{item.estimatedMinutes} min</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 3 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5 }}>{item.reason}</div>
      </div>
      <ChevronRight size={16} style={{ color: TEXT_MUTED, flexShrink: 0, marginTop: 4 }} />
    </div>
  )
}

export default function PriorityCenter() {
  const navigate = useNavigate()
  const store = useAppStore()
  const registry = useRegistryStore()
  const score = estimateScore(store)

  const plan = useMemo(() => generateActionPlan(store), [
    store.grammarSessions, store.errorNotebook, store.part6Sessions,
    store.completedLessons, store.vocabRatings, store.profile,
  ])

  const alerts = useMemo(() => {
    const all = generateStudentAlerts(store)
    return all.filter(a => !store.alertDismissals.includes(a.id))
  }, [store.grammarSessions, store.errorNotebook, store.profile, store.part6Sessions, store.alertDismissals])

  const weekReport = useMemo(() => generateWeeklyReport(store), [store.grammarSessions, store.part6Sessions])
  const badges = useMemo(() => computeBadges(store), [store])
  const nextBadge = useMemo(() => computeNextBadge(store), [store])

  const myAssignments = useMemo(() => {
    if (!registry.currentStudentId) return []
    return registry.assignments.filter(
      a => a.studentId === registry.currentStudentId && !store.completedAssignments.includes(a.id)
    ).sort((a, b) => (a.dueDate ?? Infinity) - (b.dueDate ?? Infinity))
  }, [registry.assignments, registry.currentStudentId, store.completedAssignments])

  const reviewTogetherItems = useMemo(() =>
    registry.reviewTogetherItems.filter(r => r.studentId === registry.currentStudentId),
    [registry.reviewTogetherItems, registry.currentStudentId]
  )

  const gap = score.total < store.profile.targetScore ? store.profile.targetScore - score.total : 0

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 6 }}>PRIORITY CENTER</div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '-0.02em', margin: 0 }}>
            What to do now
          </h1>
          <p style={{ fontSize: 14, color: TEXT_MUTED, margin: '6px 0 0' }}>
            Your personalised study plan, updated after every session.
          </p>
        </div>

        {/* Score gap banner */}
        {gap > 0 && (
          <div style={{
            background: '#6366F10A', border: '1px solid #6366F125',
            borderRadius: 12, padding: '16px 20px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Target size={20} style={{ color: '#6366F1', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>
                  {score.total} → {store.profile.targetScore} target
                </div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                  {gap} points remaining — focus on your top 2 weak categories for fastest gains
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#6366F1' }}>{gap}</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>pts gap</div>
            </div>
          </div>
        )}

        {/* Active alerts */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} style={{
                background: alert.severity === 'critical' ? '#F43F5E08' : alert.severity === 'warning' ? '#F59E0B08' : '#6366F108',
                border: `1px solid ${alert.severity === 'critical' ? '#F43F5E30' : alert.severity === 'warning' ? '#F59E0B30' : '#6366F130'}`,
                borderRadius: 10, padding: '12px 16px', marginBottom: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle size={14} style={{ color: alert.severity === 'critical' ? '#F43F5E' : alert.severity === 'warning' ? '#F59E0B' : '#6366F1', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{alert.title}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{alert.message}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {alert.action && (
                    <button onClick={() => navigate(alert.action!.path)} style={{ padding: '5px 12px', borderRadius: 6, background: '#6366F1', border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {alert.action.label}
                    </button>
                  )}
                  <button onClick={() => store.dismissAlert(alert.id)} style={{ padding: '5px 8px', borderRadius: 6, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED, fontSize: 11, cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          {/* Left: action plan + assignments */}
          <div>
            {/* Today's action plan */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={12} /> Today's Action Plan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.map(item => (
                  <ActionCard key={item.id} item={item} onGo={() => navigate(item.path)} />
                ))}
              </div>
            </div>

            {/* Teacher assignments */}
            {myAssignments.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={12} /> From Your Teacher
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {myAssignments.map(a => {
                    const overdue = a.dueDate && a.dueDate < Date.now()
                    const nav: Record<string, string> = { drill: '/grammar', lesson: '/courses', part6: '/part6', vocab: '/vocabulary', reading: '/reading', custom: '/' }
                    return (
                      <div key={a.id} style={{ background: SURFACE, border: `1px solid ${overdue ? '#F43F5E30' : BORDER}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{a.title}</div>
                          {a.description && <div style={{ fontSize: 12, color: TEXT_MUTED }}>{a.description}</div>}
                          {a.dueDate && <div style={{ fontSize: 11, color: overdue ? '#F43F5E' : TEXT_MUTED, marginTop: 2 }}>Due {new Date(a.dueDate).toLocaleDateString()}{overdue ? ' · OVERDUE' : ''}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button onClick={() => { store.completeAssignment(a.id) }} style={{ padding: '5px 10px', borderRadius: 6, background: '#10B98115', border: '1px solid #10B98130', color: '#10B981', fontSize: 11, cursor: 'pointer' }}>Done</button>
                          <button onClick={() => navigate(nav[a.type] ?? '/')} style={{ padding: '5px 10px', borderRadius: 6, background: '#6366F115', border: '1px solid #6366F130', color: '#818CF8', fontSize: 11, cursor: 'pointer' }}>Go →</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Review Together items */}
            {reviewTogetherItems.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={12} /> Review Together
                </div>
                {reviewTogetherItems.map(item => (
                  <div key={item.id} style={{ background: item.priority === 'urgent' ? '#F43F5E08' : '#6366F108', border: `1px solid ${item.priority === 'urgent' ? '#F43F5E25' : '#6366F125'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY }}>{item.topic}</div>
                    {item.note && <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{item.note}</div>}
                    <div style={{ fontSize: 10, color: item.priority === 'urgent' ? '#F43F5E' : '#818CF8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{item.priority === 'urgent' ? '🔴 Urgent' : '📌 Marked for review'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: weekly summary + badges + score zones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Weekly snapshot */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BarChart2 size={12} /> This Week
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Sessions', value: weekReport.sessionsThisWeek, color: '#6366F1' },
                  { label: 'Questions', value: weekReport.questionsAnswered, color: '#10B981' },
                  { label: 'Accuracy', value: weekReport.accuracy !== null ? `${weekReport.accuracy}%` : '—', color: weekReport.accuracy !== null ? (weekReport.accuracy >= 75 ? '#10B981' : '#F59E0B') : TEXT_MUTED },
                  { label: 'XP Earned', value: weekReport.weeklyXP, color: '#F59E0B' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: SURFACE2, borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              {weekReport.highlights.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {weekReport.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <CheckCircle2 size={11} /> {h}
                    </div>
                  ))}
                </div>
              )}
              {weekReport.nextWeekFocus.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: TEXT_MUTED, marginBottom: 6, fontWeight: 600 }}>NEXT WEEK:</div>
                  {weekReport.nextWeekFocus.slice(0, 2).map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_DIM, display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#F59E0B' }}>→</span> {f}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={12} /> Achievements
              </div>
              {badges.length === 0 ? (
                <div style={{ fontSize: 12, color: TEXT_MUTED, textAlign: 'center', padding: '10px 0' }}>No badges yet — start practicing!</div>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {badges.map(b => (
                    <div key={b.id} title={`${b.title}: ${b.description}`} style={{ fontSize: 20, cursor: 'default' }}>{b.icon}</div>
                  ))}
                </div>
              )}
              {nextBadge && (
                <div style={{ background: SURFACE2, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, filter: 'grayscale(1) opacity(0.4)' }}>{nextBadge.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM }}>Next: {nextBadge.title}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{nextBadge.description}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Score Zones */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DIM, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={12} /> Score Zones
              </div>
              {[
                { zone: '600–700', needs: 'Grammar basics, avoid major traps', color: '#F43F5E' },
                { zone: '700–800', needs: 'Consistent accuracy, Part 6 basics', color: '#F59E0B' },
                { zone: '800–900', needs: 'Master collocations, connector logic', color: '#6366F1' },
                { zone: '900–950', needs: 'Eliminate repeating errors, near-perfect Part 5', color: '#10B981' },
                { zone: '950+', needs: 'Speed + accuracy, zero trap failures', color: '#8B5CF6' },
              ].map(({ zone, needs, color }) => {
                const [low, high] = zone.split('–').map(Number)
                const inZone = score.total >= low && score.total < (high ?? 1000)
                return (
                  <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 10px', borderRadius: 8, background: inZone ? `${color}10` : 'transparent', border: inZone ? `1px solid ${color}30` : '1px solid transparent' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: inZone ? 700 : 500, color: inZone ? color : TEXT_DIM }}>{zone}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, lineHeight: 1.4 }}>{needs}</div>
                    </div>
                    {inZone && <div style={{ fontSize: 10, fontWeight: 700, color, background: `${color}15`, borderRadius: 4, padding: '2px 6px' }}>YOU ARE HERE</div>}
                  </div>
                )
              })}
            </div>

            {/* Quick nav */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Drill Grammar', path: '/grammar', color: '#6366F1', icon: '⚡' },
                { label: 'Review Errors', path: '/errors', color: '#F43F5E', icon: '🔍' },
                { label: 'Analytics', path: '/analytics', color: '#10B981', icon: '📊' },
                { label: 'Mock Exam', path: '/mock', color: '#F59E0B', icon: '📝' },
              ].map(({ label, path, color, icon }) => (
                <button key={path} onClick={() => navigate(path)} style={{ padding: '12px', borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`, color, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.12s' }}>
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
