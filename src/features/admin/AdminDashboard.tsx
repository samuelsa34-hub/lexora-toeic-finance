import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield, Users, BookOpen, BarChart2, ClipboardList, LogOut,
  Search, RefreshCw, ChevronDown, AlertCircle, CheckCircle2,
  Mail, User, Clock, Activity, Database, Settings,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useRegistryStore } from '../../store/useRegistryStore'
import {
  subscribeToAllUsers, subscribeToAllClasses, subscribeToAuditLogs,
  changeUserRole, writeAuditLog,
  type AdminUserRecord, type AdminClassRecord, type AuditLogEntry,
} from '../../utils/adminSync'
import type { AuthRole } from '../../utils/userSync'
import { useAppStore } from '../../store/useAppStore'
import { FIREBASE_ENABLED } from '../../config/firebase'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG       = '#060B14'
const SURFACE  = '#0D1626'
const SURFACE2 = '#111827'
const BORDER   = '#1E293B'
const PRI      = '#6366F1'
const PRI_DIM  = '#4F46E5'
const TEXT     = '#F8FAFC'
const MUTED    = '#64748B'
const DIM      = '#94A3B8'

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'users' | 'classes' | 'content' | 'audit'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview',  icon: BarChart2    },
  { id: 'users',    label: 'Users',     icon: Users        },
  { id: 'classes',  label: 'Classes',   icon: BookOpen     },
  { id: 'content',  label: 'Content',   icon: Database     },
  { id: 'audit',    label: 'Audit Log', icon: ClipboardList },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleBadge(role: AuthRole) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    admin:   { bg: '#7C3AED22', text: '#A78BFA', label: 'Admin'   },
    teacher: { bg: '#0E7C5B22', text: '#34D399', label: 'Teacher' },
    student: { bg: '#1D4ED822', text: '#60A5FA', label: 'Student' },
  }
  const s = map[role ?? 'student'] ?? map.student
  return (
    <span style={{
      background: s.bg, color: s.text,
      border: `1px solid ${s.text}33`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
    }}>{s.label}</span>
  )
}

function fmtDate(ts: number | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ users, classes }: { users: AdminUserRecord[]; classes: AdminClassRecord[] }) {
  const admins   = users.filter(u => u.role === 'admin').length
  const teachers = users.filter(u => u.role === 'teacher').length
  const students = users.filter(u => u.role === 'student').length
  const recent7d = users.filter(u => u.lastLoginAt > Date.now() - 7 * 86_400_000).length

  const stats = [
    { label: 'Total Users',    value: users.length,   icon: Users,      color: '#60A5FA' },
    { label: 'Students',       value: students,        icon: User,       color: '#34D399' },
    { label: 'Teachers',       value: teachers,        icon: BookOpen,   color: '#FBBF24' },
    { label: 'Admins',         value: admins,          icon: Shield,     color: '#A78BFA' },
    { label: 'Active (7d)',    value: recent7d,        icon: Activity,   color: '#F472B6' },
    { label: 'Classes',        value: classes.length,  icon: ClipboardList, color: '#38BDF8' },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <s.icon size={18} color={s.color} />
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: DIM, marginBottom: 12 }}>Recent Sign-ins</div>
        {users
          .sort((a, b) => (b.lastLoginAt ?? 0) - (a.lastLoginAt ?? 0))
          .slice(0, 10)
          .map(u => (
            <div key={u.uid} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
              borderBottom: `1px solid ${BORDER}22`,
            }}>
              {u.photoURL
                ? <img src={u.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 28, height: 28, borderRadius: '50%', background: PRI_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>{(u.displayName || u.email || '?')[0].toUpperCase()}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.displayName || u.email}
                </div>
                <div style={{ fontSize: 11, color: MUTED }}>{u.email}</div>
              </div>
              {roleBadge(u.role)}
              <div style={{ fontSize: 11, color: MUTED, flexShrink: 0 }}>{fmtDate(u.lastLoginAt)}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({ users, onRoleChange }: {
  users: AdminUserRecord[]
  onRoleChange: (uid: string, email: string, name: string, newRole: AuthRole) => Promise<void>
}) {
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState<AuthRole | 'all'>('all')
  const [changingUid, setChangingUid] = useState<string | null>(null)
  const authStore = useAuthStore()

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase()
      return (
        (roleFilter === 'all' || u.role === roleFilter) &&
        (u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q) || u.uid.includes(q))
      )
    })
    .sort((a, b) => (b.lastLoginAt ?? 0) - (a.lastLoginAt ?? 0))

  const handleChange = async (u: AdminUserRecord, newRole: AuthRole) => {
    if (u.uid === authStore.user?.uid) return // can't change own role
    setChangingUid(u.uid)
    await onRoleChange(u.uid, u.email, u.displayName, newRole)
    setChangingUid(null)
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width: '100%', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: '8px 12px 8px 34px', color: TEXT, fontSize: 13, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {(['all', 'student', 'teacher', 'admin'] as const).map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: roleFilter === r ? PRI : SURFACE2,
              color: roleFilter === r ? '#fff' : DIM,
              border: `1px solid ${roleFilter === r ? PRI : BORDER}`,
            }}>
            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                {['User', 'Email', 'Role', 'Provider', 'Last Login', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.uid} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {u.photoURL
                        ? <img src={u.photoURL} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                        : <div style={{ width: 24, height: 24, borderRadius: '50%', background: PRI_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>{(u.displayName || '?')[0].toUpperCase()}</div>
                      }
                      <span style={{ color: TEXT, fontWeight: 500 }}>{u.displayName || '—'}</span>
                      {u.uid === authStore.user?.uid && (
                        <span style={{ fontSize: 10, color: PRI, fontWeight: 600 }}>(you)</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{u.email}</td>
                  <td style={{ padding: '10px 16px' }}>{roleBadge(u.role)}</td>
                  <td style={{ padding: '10px 16px', color: MUTED, fontSize: 11 }}>{u.provider ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: MUTED, fontSize: 11, whiteSpace: 'nowrap' }}>{fmtDate(u.lastLoginAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {u.uid !== authStore.user?.uid && (
                      <RoleDropdown
                        current={u.role}
                        loading={changingUid === u.uid}
                        onChange={newRole => handleChange(u, newRole)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>No users match your search.</div>
        )}
      </div>
    </div>
  )
}

function RoleDropdown({ current, loading, onChange }: {
  current: AuthRole
  loading: boolean
  onChange: (role: AuthRole) => void
}) {
  const [open, setOpen] = useState(false)
  const roles: AuthRole[] = ['student', 'teacher', 'admin']

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7,
          color: DIM, fontSize: 12, cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <>Change <ChevronDown size={12} /></>}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, zIndex: 50,
          background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
          boxShadow: '0 8px 32px #00000066', minWidth: 120, padding: 4,
        }}>
          {roles.filter(r => r !== current).map(r => (
            <button key={r} onClick={() => { onChange(r); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 12px', background: 'none', border: 'none',
                color: TEXT, fontSize: 12, cursor: 'pointer', borderRadius: 6,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ffffff0a')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {r!.charAt(0).toUpperCase() + r!.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Classes Tab ───────────────────────────────────────────────────────────────

function ClassesTab({ classes }: { classes: AdminClassRecord[] }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {classes.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>No classes created yet.</div>
      )}
      {classes.map(cls => (
        <div key={cls.code} style={{
          background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 6, background: '#6366F122',
              color: PRI, fontSize: 14, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace',
            }}>{cls.code}</div>
            {cls.teacherName && (
              <span style={{ fontSize: 12, color: MUTED }}>Teacher: <span style={{ color: DIM }}>{cls.teacherName}</span></span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTED }}>
              {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
            </span>
          </div>
          {Object.entries(cls.students).slice(0, 8).map(([uid, s]) => (
            <div key={uid} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              borderBottom: `1px solid ${BORDER}22`, fontSize: 12,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: s.online ? '#10B981' : BORDER,
              }} />
              <span style={{ color: DIM, flex: 1 }}>{s.name}</span>
              <span style={{ color: MUTED }}>
                {s.lastSeen ? fmtDate(s.lastSeen) : '—'}
              </span>
            </div>
          ))}
          {cls.studentCount > 8 && (
            <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>
              +{cls.studentCount - 8} more students
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Content Tab ───────────────────────────────────────────────────────────────

function ContentTab() {
  // Static summary — actual question data lives in the bundled TS files
  const appStore = useAppStore.getState()

  const rows = [
    { label: 'Part 5 Questions',   value: '270+',  detail: 'Grammar, vocabulary, collocations' },
    { label: 'Vocabulary Lists',   value: appStore.vocabLists?.length ?? 0, detail: 'Custom student lists' },
    { label: 'Dictionary Entries', value: '50+',   detail: 'With collocations & TOEIC context' },
    { label: 'Courses / Lessons',  value: '10+',   detail: 'Structured video-style lessons' },
    { label: 'Topic Pages',        value: '20+',   detail: 'Grammar & vocabulary deep-dives' },
    { label: 'Flash Decks',        value: appStore.wordFlashcards?.length ?? 0, detail: 'User-created flashcards' },
    { label: 'Mock Exams',         value: 'Full',  detail: 'Part 5 timed 40-question mock' },
    { label: 'Error Notebook',     value: appStore.errorNotebook?.length ?? 0, detail: 'User-saved wrong answers' },
  ]

  return (
    <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, color: MUTED, fontWeight: 600 }}>
        Platform Content Inventory
      </div>
      {rows.map((r, i) => (
        <div key={r.label} style={{
          display: 'flex', alignItems: 'center', padding: '14px 20px',
          borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}22` : 'none',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{r.label}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{r.detail}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: PRI }}>{r.value}</div>
        </div>
      ))}
    </div>
  )
}

// ── Audit Tab ─────────────────────────────────────────────────────────────────

function AuditTab({ logs }: { logs: AuditLogEntry[] }) {
  return (
    <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, color: MUTED, fontWeight: 600 }}>
        Admin Action Log (last {logs.length})
      </div>
      {logs.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>No actions logged yet.</div>
      )}
      {logs.map(log => (
        <div key={log.id} style={{
          display: 'flex', gap: 12, padding: '12px 20px',
          borderBottom: `1px solid ${BORDER}22`, alignItems: 'flex-start',
        }}>
          <Clock size={14} style={{ color: MUTED, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: TEXT }}>
              <span style={{ color: PRI, fontWeight: 600 }}>{log.adminEmail}</span>
              {' '}{log.action}
              {log.targetEmail && <> → <span style={{ color: DIM }}>{log.targetEmail}</span></>}
            </div>
            {log.detail && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{log.detail}</div>}
          </div>
          <div style={{ fontSize: 11, color: MUTED, flexShrink: 0, whiteSpace: 'nowrap' }}>{fmtDate(log.ts)}</div>
        </div>
      ))}
    </div>
  )
}

// ── AdminDashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const authStore  = useAuthStore()
  const registry   = useRegistryStore()

  const [tab, setTab]       = useState<Tab>('overview')
  const [users, setUsers]   = useState<AdminUserRecord[]>([])
  const [classes, setClasses] = useState<AdminClassRecord[]>([])
  const [logs, setLogs]     = useState<AuditLogEntry[]>([])

  // Subscribe to live data
  useEffect(() => {
    const unsubs = [
      subscribeToAllUsers(setUsers),
      subscribeToAllClasses(setClasses),
      subscribeToAuditLogs(setLogs),
    ]
    return () => unsubs.forEach(u => u())
  }, [])

  const handleSignOut = useCallback(async () => {
    registry.setCurrentStudent(null)
    registry.setTeacherMode(false)
    await authStore.signOut()
  }, [authStore, registry])

  const handleRoleChange = useCallback(async (
    uid: string, email: string, name: string, newRole: AuthRole,
  ) => {
    await changeUserRole(uid, newRole)
    await writeAuditLog({
      adminUid:    authStore.user?.uid ?? '',
      adminEmail:  authStore.user?.email ?? '',
      action:      `changed role to ${newRole}`,
      targetUid:   uid,
      targetEmail: email,
      detail:      `${name} → ${newRole}`,
    })
  }, [authStore.user])

  if (!FIREBASE_ENABLED) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Firebase is not configured. Admin dashboard requires Firebase RTDB.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, system-ui, sans-serif', color: TEXT }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header style={{
        background: SURFACE, borderBottom: `1px solid ${BORDER}`,
        padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            TOEIC <span style={{ color: PRI }}>ADMIN</span>
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                background: tab === t.id ? '#6366F122' : 'transparent',
                color: tab === t.id ? PRI : MUTED,
              }}>
              <t.icon size={13} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {authStore.user?.photoURL
            ? <img src={authStore.user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 28, height: 28, borderRadius: '50%', background: PRI_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>
                {(authStore.user?.displayName || authStore.user?.email || 'A')[0].toUpperCase()}
              </div>
          }
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{authStore.user?.displayName ?? 'Admin'}</span>
            <span style={{ fontSize: 10, color: MUTED }}>{authStore.user?.email}</span>
          </div>
          <button onClick={handleSignOut}
            title="Sign out"
            style={{
              background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: '5px 8px', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center',
            }}>
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
        {tab === 'overview' && <OverviewTab users={users} classes={classes} />}
        {tab === 'users'    && <UsersTab users={users} onRoleChange={handleRoleChange} />}
        {tab === 'classes'  && <ClassesTab classes={classes} />}
        {tab === 'content'  && <ContentTab />}
        {tab === 'audit'    && <AuditTab logs={logs} />}
      </main>
    </div>
  )
}
