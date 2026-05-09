import type { ActivityEvent, ActivityType, PresenceStatus } from '../types'

export function makeEvent(
  type: ActivityType,
  label: string,
  meta?: ActivityEvent['meta']
): Omit<ActivityEvent, 'ts'> {
  return { type, label, meta }
}

export interface PresenceInfo {
  status: PresenceStatus
  lastSeen: number | null
  currentActivity: string | null
  minutesAgo: number | null
}

// presenceTs: optional heartbeat timestamp written by App.tsx every 30 s.
// Using max of (last activityLog event, heartbeat) means a student with the
// app open shows as active/idle even when no study events have fired recently.
export function computePresence(activityLog: ActivityEvent[], presenceTs?: number | null): PresenceInfo {
  const logTs = activityLog && activityLog.length > 0 ? activityLog[activityLog.length - 1].ts : 0
  const freshestTs = Math.max(logTs, presenceTs ?? 0)

  if (freshestTs === 0) {
    return { status: 'offline', lastSeen: null, currentActivity: null, minutesAgo: null }
  }

  const diffMs = Date.now() - freshestTs
  const minutesAgo = Math.floor(diffMs / 60000)

  const status: PresenceStatus =
    diffMs < 90_000 ? 'active' :
    diffMs < 900_000 ? 'idle' :
    'offline'

  // currentActivity comes from the latest real event label (not the heartbeat)
  const latest = activityLog && activityLog.length > 0 ? activityLog[activityLog.length - 1] : null
  const activityDiffMs = latest ? Date.now() - latest.ts : Infinity
  const currentActivity = activityDiffMs < 180_000 ? (latest?.label ?? null) : null

  return { status, lastSeen: freshestTs, currentActivity, minutesAgo }
}

export const ACTIVITY_LABELS: Partial<Record<ActivityType, string>> = {
  login: 'Logged in',
  drill_start: 'Started grammar drill',
  drill_complete: 'Completed grammar drill',
  lesson_start: 'Started a lesson',
  lesson_complete: 'Completed a lesson',
  part6_start: 'Started Part 6 practice',
  part6_complete: 'Completed Part 6 practice',
  reading_start: 'Started reading exercise',
  reading_complete: 'Completed reading exercise',
  mock_start: 'Started mock exam',
  mock_complete: 'Completed mock exam',
  vocab_session: 'Studied vocabulary',
  topic_open: 'Opened a topic',
  error_made: 'Made an error',
  error_resolved: 'Resolved an error',
  assignment_complete: 'Completed an assignment',
  gapfill_complete: 'Completed gap-fill exercise',
}

export function formatTs(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return new Date(ts).toLocaleDateString()
}
