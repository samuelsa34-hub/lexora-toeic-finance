import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import {
  computeAllTopicMastery,
  getRecommendedTopics,
  getRepairTopics,
  getWeakTopics,
  getHighROITopics,
  MASTERY_COLORS,
  MASTERY_LABELS,
  MASTERY_PCT,
  ROI_COLORS,
  ROI_LABELS,
  CATEGORY_ACCENT,
  CATEGORY_LABELS,
  formatLastPracticed,
  getTopicCTA,
  getTopicAnalytics,
} from '../../utils/topicEngine'
import { TOPICS, TOPICS_BY_CATEGORY } from '../../data/topics'
import type { Topic, TopicMastery, TopicCategory } from '../../types'

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = '#0A0E1A'
const SURFACE = '#111827'
const BORDER = '#1F2937'
const TEXT_PRIMARY = '#F8FAFC'
const TEXT_MUTED = '#64748B'
const TEXT_DIM = '#94A3B8'

// ── Sub-components ─────────────────────────────────────────────────────────────

function MasteryBar({ level, pct, color }: { level: string; pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: '#1F2937',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color,
        whiteSpace: 'nowrap' as const,
        minWidth: 64,
        textAlign: 'right' as const,
      }}>
        {MASTERY_LABELS[level as keyof typeof MASTERY_LABELS] ?? level}
      </span>
    </div>
  )
}

function ROIBadge({ roi }: { roi: string }) {
  const color = ROI_COLORS[roi] ?? '#52525B'
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color,
      border: `1px solid ${color}40`,
      background: `${color}12`,
      borderRadius: 4,
      padding: '2px 6px',
    }}>
      {ROI_LABELS[roi] ?? roi}
    </span>
  )
}

function DifficultyDot({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    beginner: '#10B981',
    intermediate: '#F59E0B',
    advanced: '#F43F5E',
  }
  const color = map[difficulty] ?? '#64748B'
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 10, color: TEXT_MUTED, textTransform: 'capitalize' as const }}>{difficulty}</span>
    </span>
  )
}

interface TopicCardProps {
  topic: Topic
  mastery: TopicMastery
  onNavigate: (id: string) => void
  highlight?: 'repair' | 'recommended'
}

function TopicCard({ topic, mastery, onNavigate, highlight }: TopicCardProps) {
  const [hovered, setHovered] = useState(false)
  const accent = CATEGORY_ACCENT[topic.category] ?? '#6366F1'
  const masteryColor = MASTERY_COLORS[mastery.level]
  const masteryPct = MASTERY_PCT[mastery.level]
  const cta = getTopicCTA(mastery.level)

  const borderColor = hovered
    ? accent
    : highlight === 'repair'
      ? '#F43F5E40'
      : highlight === 'recommended'
        ? `${accent}40`
        : BORDER

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(topic.id)}
      onKeyDown={e => e.key === 'Enter' && onNavigate(topic.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: SURFACE,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-1px)' : 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 12,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          {topic.icon}
        </div>

        {/* Title + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: TEXT_PRIMARY,
            lineHeight: 1.3,
            marginBottom: 2,
          }}>
            {topic.title}
          </div>
          <div style={{
            fontSize: 11,
            color: TEXT_MUTED,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
          }}>
            {topic.subtitle}
          </div>
        </div>

        {/* ROI badge */}
        <ROIBadge roi={topic.toeicROI} />
      </div>

      {/* Mastery bar */}
      <MasteryBar level={mastery.level} pct={masteryPct} color={masteryColor} />

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DifficultyDot difficulty={topic.difficulty} />
          {mastery.attemptCount > 0 && (
            <span style={{ fontSize: 10, color: TEXT_MUTED }}>
              {mastery.attemptCount} attempts
            </span>
          )}
          {mastery.recentErrorCount > 0 && (
            <span style={{
              fontSize: 10,
              color: '#F43F5E',
              background: '#F43F5E12',
              border: '1px solid #F43F5E30',
              borderRadius: 4,
              padding: '1px 5px',
            }}>
              {mastery.recentErrorCount} error{mastery.recentErrorCount > 1 ? 's' : ''}
            </span>
          )}
          {mastery.lastPracticed && (
            <span style={{ fontSize: 10, color: TEXT_MUTED }}>
              {formatLastPracticed(mastery.lastPracticed)}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); onNavigate(topic.id) }}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: mastery.level === 'mastered' ? '#10B981' : accent,
            background: mastery.level === 'mastered' ? '#10B98112' : `${accent}12`,
            border: `1px solid ${mastery.level === 'mastered' ? '#10B98130' : `${accent}30`}`,
            borderRadius: 6,
            padding: '4px 10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
            transition: 'background 0.15s',
          }}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

// ── Stat card for analytics strip ──────────────────────────────────────────────
function StatCard({ value, label, color }: { value: number | string; label: string; color: string }) {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 10,
      padding: '12px 16px',
      textAlign: 'center' as const,
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{label}</div>
    </div>
  )
}

// ── Category filter chip ────────────────────────────────────────────────────────
function CategoryChip({
  label,
  active,
  color,
  count,
  onClick,
}: {
  label: string
  active: boolean
  color: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: active ? color : TEXT_MUTED,
        background: active ? `${color}15` : 'transparent',
        border: `1px solid ${active ? color : BORDER}`,
        borderRadius: 20,
        padding: '5px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: active ? color : TEXT_DIM,
        background: active ? `${color}20` : '#1F2937',
        borderRadius: 10,
        padding: '0 5px',
        minWidth: 18,
        textAlign: 'center' as const,
      }}>
        {count}
      </span>
    </button>
  )
}

// ── Tab button ──────────────────────────────────────────────────────────────────
function Tab({ label, active, badge, onClick }: { label: string; active: boolean; badge?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        color: active ? TEXT_PRIMARY : TEXT_MUTED,
        background: 'none',
        border: 'none',
        borderBottom: `2px solid ${active ? '#6366F1' : 'transparent'}`,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 4,
        paddingRight: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap' as const,
        transition: 'color 0.15s',
      }}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: label.includes('Repair') ? '#F43F5E' : '#6366F1',
          background: label.includes('Repair') ? '#F43F5E18' : '#6366F118',
          borderRadius: 10,
          padding: '0 6px',
          minWidth: 18,
          textAlign: 'center' as const,
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      textAlign: 'center' as const,
      padding: '48px 24px',
      color: TEXT_MUTED,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
type TabKey = 'all' | 'recommended' | 'weak' | 'repair' | 'high_roi'

export default function TopicsHub() {
  const navigate = useNavigate()
  const store = useAppStore()

  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [activeCategory, setActiveCategory] = useState<TopicCategory | 'all'>('all')

  const masteryMap = useMemo(() => computeAllTopicMastery(store), [
    store.grammarSessions,
    store.errorNotebook,
    store.completedLessons,
  ])

  const analytics = useMemo(() => getTopicAnalytics(store), [masteryMap])

  const recommendedTopics = useMemo(() => getRecommendedTopics(store, 10), [masteryMap])
  const repairTopics = useMemo(() => getRepairTopics(store), [masteryMap])
  const weakTopics = useMemo(() => getWeakTopics(store), [masteryMap])
  const highROITopics = useMemo(() => getHighROITopics(), [])

  const categories: TopicCategory[] = ['grammar', 'vocabulary', 'traps', 'strategy', 'reading']

  // Category counts per tab
  const categoryCounts = useMemo(() => {
    const pool = activeTab === 'all'
      ? TOPICS
      : activeTab === 'recommended'
        ? recommendedTopics.map(r => r.topic)
        : activeTab === 'weak'
          ? weakTopics.map(r => r.topic)
          : activeTab === 'repair'
            ? repairTopics.map(r => r.topic)
            : highROITopics

    const counts: Record<string, number> = { all: pool.length }
    for (const cat of categories) {
      counts[cat] = pool.filter(t => t.category === cat).length
    }
    return counts
  }, [activeTab, recommendedTopics, weakTopics, repairTopics, highROITopics])

  // Filtered + sorted topic list for current tab + category
  const displayedTopics = useMemo(() => {
    let pool: { topic: Topic; mastery: TopicMastery; reason?: string }[] = []

    if (activeTab === 'all') {
      pool = TOPICS.map(t => ({ topic: t, mastery: masteryMap[t.id] }))
        .sort((a, b) => a.topic.frequencyRank - b.topic.frequencyRank)
    } else if (activeTab === 'recommended') {
      pool = recommendedTopics.map(r => ({ topic: r.topic, mastery: r.mastery, reason: r.reason }))
    } else if (activeTab === 'weak') {
      pool = weakTopics
    } else if (activeTab === 'repair') {
      pool = repairTopics
    } else {
      pool = highROITopics.map(t => ({ topic: t, mastery: masteryMap[t.id] }))
    }

    if (activeCategory !== 'all') {
      pool = pool.filter(r => r.topic.category === activeCategory)
    }

    return pool
  }, [activeTab, activeCategory, masteryMap, recommendedTopics, weakTopics, repairTopics, highROITopics])

  const handleNavigate = (topicId: string) => {
    navigate(`/topics/${topicId}`)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }}>
      {/* ── Hero ── */}
      <div style={{
        padding: '32px 24px 0',
        maxWidth: 860,
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: '#6366F1',
          }}>
            TOPIC MASTERY
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 30px)',
          fontWeight: 800,
          color: TEXT_PRIMARY,
          lineHeight: 1.2,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}>
          All Topics
        </h1>
        <p style={{ fontSize: 14, color: TEXT_MUTED, margin: 0, lineHeight: 1.6 }}>
          25 precision topics mapped to your TOEIC performance. Track mastery, drill weak areas, and follow the repair queue.
        </p>
      </div>

      {/* ── Analytics strip ── */}
      <div style={{ padding: '20px 24px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' as const, paddingBottom: 4 }}>
          <StatCard value={analytics.masteryPct + '%'} label="Mastered" color="#10B981" />
          <StatCard value={analytics.masteredCount + analytics.proficientCount} label="Proficient+" color="#6366F1" />
          <StatCard value={analytics.fragileCount} label="Fragile" color="#F43F5E" />
          <StatCard value={analytics.notStartedCount} label="Not started" color="#64748B" />
          {analytics.criticalRepairCount > 0 && (
            <StatCard value={analytics.criticalRepairCount} label="Critical" color="#F43F5E" />
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        padding: '0 24px',
        maxWidth: 860,
        margin: '0 auto',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto' as const,
        }}>
          <Tab label="All Topics" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <Tab
            label="Recommended"
            active={activeTab === 'recommended'}
            badge={recommendedTopics.length}
            onClick={() => setActiveTab('recommended')}
          />
          <Tab
            label="Weak"
            active={activeTab === 'weak'}
            badge={weakTopics.length}
            onClick={() => setActiveTab('weak')}
          />
          <Tab
            label="Repair Queue"
            active={activeTab === 'repair'}
            badge={repairTopics.length}
            onClick={() => setActiveTab('repair')}
          />
          <Tab label="High ROI" active={activeTab === 'high_roi'} onClick={() => setActiveTab('high_roi')} />
        </div>
      </div>

      {/* ── Category filter chips ── */}
      <div style={{ padding: '16px 24px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' as const, paddingBottom: 4 }}>
          <CategoryChip
            label="All"
            active={activeCategory === 'all'}
            color="#6366F1"
            count={categoryCounts.all ?? 0}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map(cat => (
            <CategoryChip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              active={activeCategory === cat}
              color={CATEGORY_ACCENT[cat]}
              count={categoryCounts[cat] ?? 0}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Topic list ── */}
      <div style={{ padding: '0 24px 40px', maxWidth: 860, margin: '0 auto' }}>
        {/* Repair tab banner */}
        {activeTab === 'repair' && repairTopics.length > 0 && (
          <div style={{
            background: '#F43F5E0D',
            border: '1px solid #F43F5E30',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F43F5E' }}>
                {repairTopics.length} topic{repairTopics.length > 1 ? 's' : ''} need urgent repair
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
                These topics have fragile accuracy or multiple recent errors. Drill them now to stop losing points.
              </div>
            </div>
          </div>
        )}

        {/* Recommended tab banner */}
        {activeTab === 'recommended' && recommendedTopics.length > 0 && (
          <div style={{
            background: '#6366F10D',
            border: '1px solid #6366F130',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6366F1' }}>
                Personalized recommendations
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
                Ranked by urgency × ROI. Highest-impact topics for your current level, up top.
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {displayedTopics.length === 0 ? (
          <EmptyState
            message={
              activeTab === 'repair'
                ? 'No topics need repair right now — keep it up!'
                : activeTab === 'weak'
                  ? 'No weak topics found for this filter.'
                  : 'No topics match the current filter.'
            }
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 10,
          }}>
            {displayedTopics.map(({ topic, mastery, reason }) => (
              <div key={topic.id} style={{ position: 'relative' as const }}>
                {reason && activeTab === 'recommended' && (
                  <div style={{
                    fontSize: 10,
                    color: TEXT_MUTED,
                    marginBottom: 4,
                    paddingLeft: 2,
                    letterSpacing: '0.04em',
                  }}>
                    {reason}
                  </div>
                )}
                <TopicCard
                  topic={topic}
                  mastery={mastery}
                  onNavigate={handleNavigate}
                  highlight={
                    activeTab === 'repair' ? 'repair' :
                    activeTab === 'recommended' ? 'recommended' :
                    undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
