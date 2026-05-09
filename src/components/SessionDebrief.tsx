import React from 'react'
import { Zap, Flame, Star, ChevronRight } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { levelFromXP, RANK_COLORS, RANK_ICONS } from '../utils/xpEngine'
import { CAT_LABELS } from '../utils/constants'
import type { Mission } from '../types'

interface Props {
  xpGained: number
  prevXP: number
  accuracy: number
  category: string
  onContinue: () => void
}

export const SessionDebrief: React.FC<Props> = ({ xpGained, prevXP, accuracy, category, onContinue }) => {
  const { profile, missions } = useAppStore()
  const currentInfo = levelFromXP(profile.xp)
  const prevInfo = levelFromXP(prevXP)
  const leveledUp = currentInfo.level > prevInfo.level
  const rankColor = RANK_COLORS[currentInfo.rank]
  const rankIcon = RANK_ICONS[currentInfo.rank]

  const completedMissions = missions.filter(m => m.completed && m.progress >= m.target)
  const activeMissions = missions.filter(m => !m.completed)

  const performanceLabel =
    accuracy >= 90 ? 'Flawless' :
    accuracy >= 80 ? 'Excellent' :
    accuracy >= 70 ? 'Good' :
    accuracy >= 60 ? 'Decent' : 'Keep drilling'

  const performanceColor =
    accuracy >= 80 ? 'text-emerald-400' :
    accuracy >= 60 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-600/10 to-transparent p-5 space-y-4">
      {/* XP Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${rankColor}20`, border: `1px solid ${rankColor}40` }}>
            {rankIcon}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {leveledUp ? '🎉 Level Up!' : `Level ${currentInfo.level}`}
            </div>
            <div className="text-sm font-bold" style={{ color: rankColor }}>
              {currentInfo.rank}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Zap className="w-4 h-4" />
            <span className="text-lg">+{xpGained} XP</span>
          </div>
          <div className={`text-xs font-semibold mt-0.5 ${performanceColor}`}>{performanceLabel}</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">{profile.xp.toLocaleString()} XP</span>
          <span className="text-xs text-slate-600">
            {currentInfo.level < 9 ? `${currentInfo.xpForNext.toLocaleString()} to Level ${currentInfo.level + 1}` : 'Max Level'}
          </span>
        </div>
        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${currentInfo.progress}%`, background: `linear-gradient(90deg, ${rankColor}, ${rankColor}99)` }}
          />
        </div>
      </div>

      {/* Performance breakdown */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">{accuracy}% accuracy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400">{profile.streak}d streak</span>
        </div>
        <span className="text-slate-600">{CAT_LABELS[category] || category}</span>
      </div>

      {/* Missions */}
      {(completedMissions.length > 0 || activeMissions.length > 0) && (
        <div className="border-t border-white/[0.07] pt-3 space-y-1.5">
          {completedMissions.slice(0, 2).map(m => (
            <MissionRow key={m.id} mission={m} />
          ))}
          {activeMissions.slice(0, 2).map(m => (
            <MissionRow key={m.id} mission={m} />
          ))}
        </div>
      )}

      <button onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-600/10 text-sm font-semibold text-indigo-300 hover:bg-indigo-600/20 transition-all">
        View Breakdown <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

const MissionRow: React.FC<{ mission: Mission }> = ({ mission }) => {
  const pct = Math.round((mission.progress / mission.target) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-base leading-none">{mission.icon || '📋'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-xs font-medium truncate ${mission.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
            {mission.title}
          </span>
          <span className="text-xs text-slate-600 flex-shrink-0 ml-2">
            {mission.completed ? `+${mission.xpReward} XP ✓` : `${mission.progress}/${mission.target}`}
          </span>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${mission.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
