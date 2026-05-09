import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Zap, Flame, BookOpen, Library, FileText, AlertTriangle,
  Timer, XCircle, BarChart2, Map, User, Settings, Menu, X, Headphones,
  GraduationCap, Gamepad2, Layers, AlignLeft, LogOut, PenTool, Sparkles,
  Sun, Moon, BookMarked, Link2, Brain, MessageSquareQuote, Scan,
  ChevronLeft, ChevronRight, MoreHorizontal,
} from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useAppStore, estimateScore } from '../../store/useAppStore'
import { useRegistryStore } from '../../store/useRegistryStore'
import { useAuthStore } from '../../store/useAuthStore'
import { AUTH_ENABLED } from '../../config/firebase'
import { saveStudentSnapshot } from '../../utils/studentStorage'
import { FirebaseStatusBadge } from '../ui/FirebaseStatusBadge'
import { useThemeStore } from '../../store/useThemeStore'
import { EntitySwitch } from './EntitySwitch'

type NavItem = { to: string; icon: React.ElementType; label: string }
type NavGroup = { label?: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { to: '/toeic',    icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/priority', icon: Zap,             label: 'Priority'  },
    ],
  },
  {
    label: 'LEARN',
    items: [
      { to: '/courses',    icon: GraduationCap,  label: 'Courses'     },
      { to: '/topics',     icon: Layers,          label: 'Topics'      },
      { to: '/part6',      icon: AlignLeft,       label: 'Part 6'      },
      { to: '/flash',      icon: Sparkles,        label: 'Flash Cards' },
      { to: '/dictionary', icon: BookMarked,      label: 'Dictionary'  },
      { to: '/bootcamp',   icon: Flame,           label: 'Bootcamp'    },
    ],
  },
  {
    label: 'PRACTICE',
    items: [
      { to: '/grammar-detective', icon: Scan,               label: 'Detective'     },
      { to: '/english-grammar',   icon: PenTool,            label: 'Eng. Grammar'  },
      { to: '/collocations',      icon: Link2,              label: 'Collocations'  },
      { to: '/phrasal-verbs',     icon: Layers,             label: 'Phrasal Verbs' },
      { to: '/grammar',           icon: BookOpen,           label: 'Grammar'       },
      { to: '/gapfill',           icon: Gamepad2,           label: 'Gap Fill'      },
      { to: '/vocabulary',        icon: Library,            label: 'Vocabulary'    },
      { to: '/myflash',           icon: Brain,              label: 'My Flashcards' },
      { to: '/expressions',       icon: MessageSquareQuote, label: 'Expressions'   },
      { to: '/reading',           icon: FileText,           label: 'Reading'       },
      { to: '/listening',         icon: Headphones,         label: 'Listening'     },
    ],
  },
  {
    label: 'REVIEW',
    items: [
      { to: '/traps',     icon: AlertTriangle, label: 'Trap Lab'       },
      { to: '/mock',      icon: Timer,         label: 'Mock Exam'      },
      { to: '/errors',    icon: XCircle,       label: 'Error Notebook' },
      { to: '/analytics', icon: BarChart2,     label: 'Analytics'      },
    ],
  },
  {
    label: 'MORE',
    items: [
      { to: '/strategy', icon: Map,      label: 'Strategy' },
      { to: '/profile',  icon: User,     label: 'Profile'  },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

// 4 tabs shown in mobile bottom bar; 5th is "More"
const MOBILE_TAB_NAV: NavItem[] = [
  { to: '/toeic',    icon: LayoutDashboard, label: 'Home'     },
  { to: '/courses',  icon: GraduationCap,  label: 'Courses'  },
  { to: '/grammar',  icon: BookOpen,       label: 'Grammar'  },
  { to: '/priority', icon: Zap,            label: 'Priority' },
]

// ── Sidebar nav links (shared between desktop, tablet, drawer) ──────────────

function SidebarNavLinks({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: collapsed ? '8px 0' : '8px 12px' }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-0.5' : ''}>
          {group.label && !collapsed && (
            <span className="nav-section-label">{group.label}</span>
          )}
          {collapsed && gi > 0 && (
            <div style={{ height: 1, margin: '6px 8px', background: 'rgba(255,255,255,0.05)' }} />
          )}
          {group.items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/toeic'}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                collapsed
                  ? `sidebar-icon-btn flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-0.5 transition-all duration-150 ${
                      isActive
                        ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                    }`
                  : `flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 shadow-[0_1px_0_rgba(99,102,241,0.12)_inset]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                    }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && label}
              {collapsed && <span className="icon-tooltip">{label}</span>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

// ── Score widget ──────────────────────────────────────────────────────────────

function ScoreWidget({ score, profile, theme, toggleTheme, currentStudent, registry, authStore, onSwitchProfile }: {
  score: { total: number }
  profile: { targetScore: number }
  theme: string
  toggleTheme: () => void
  currentStudent: { avatar?: string; name?: string } | undefined
  registry: { isTeacherMode: boolean; currentStudentId: string | null }
  authStore: { user: { photoURL?: string | null; displayName?: string | null } | null }
  onSwitchProfile: () => void
}) {
  const scorePct = Math.min(100, (score.total / 990) * 100)
  const toTarget = profile.targetScore - score.total

  return (
    <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="rounded-xl p-3"
        style={{
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: '0 1px 0 rgba(99,102,241,0.08) inset',
        }}>
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Est. Score</div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl font-bold" style={{ color: '#818CF8' }}>{score.total}</span>
          <span className="text-xs text-slate-600">/ 990</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full progress-fill"
            style={{ width: `${scorePct}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />
        </div>
        <div className="text-[10px] text-slate-600 mt-1">
          {toTarget > 0 ? `${toTarget} pts to ${profile.targetScore}` : 'Target reached!'}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <FirebaseStatusBadge size="compact" />
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="flex items-center justify-center w-6 h-6 rounded-lg transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: theme === 'dark' ? '#94A3B8' : '#F59E0B' }}
          >
            {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {(currentStudent || registry.isTeacherMode) && (
        <button
          onClick={onSwitchProfile}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all group"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = ''
            ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
          }}
        >
          {authStore.user?.photoURL ? (
            <img src={authStore.user.photoURL} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          ) : (
            <span className="text-base leading-none flex-shrink-0">
              {registry.isTeacherMode ? '👩‍🏫' : (currentStudent?.avatar ?? '🎯')}
            </span>
          )}
          <span className="flex-1 text-left font-medium text-slate-400 group-hover:text-slate-200 truncate transition-colors">
            {registry.isTeacherMode
              ? (authStore.user?.displayName ?? 'Teacher')
              : (authStore.user?.displayName ?? currentStudent?.name ?? 'Student')}
          </span>
          <LogOut className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
        </button>
      )}
    </div>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────

export const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  // Tablet sidebar: expanded by default on ≥768px, collapsed on narrower tablets
  const [tabletExpanded, setTabletExpanded] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )

  const location = useLocation()
  const store = useAppStore()
  const score = estimateScore(store)
  const registry = useRegistryStore()
  const authStore = useAuthStore()
  const currentStudent = registry.students.find(s => s.id === registry.currentStudentId)
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  // Close mobile overlays on route change
  useEffect(() => {
    setDrawerOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  // Prevent body scroll when overlays open
  useEffect(() => {
    document.body.style.overflow = (drawerOpen || moreOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, moreOpen])

  const handleSwitchProfile = async () => {
    if (registry.currentStudentId) saveStudentSnapshot(registry.currentStudentId, store)
    if (AUTH_ENABLED && authStore.user) await authStore.signOut()
    registry.setCurrentStudent(null)
    registry.setTeacherMode(false)
    setDrawerOpen(false)
  }

  const sharedWidgetProps = {
    score,
    profile: store.profile,
    theme,
    toggleTheme,
    currentStudent,
    registry: { isTeacherMode: registry.isTeacherMode, currentStudentId: registry.currentStudentId },
    authStore: { user: authStore.user },
    onSwitchProfile: handleSwitchProfile,
  }

  return (
    <div data-entity="toeic" className="flex h-dvh-safe overflow-hidden" style={{ background: 'var(--dp-bg)' }}>

      {/* ── DESKTOP SIDEBAR (≥1024px) ────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 w-60 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(11,18,32,0.98) 0%, rgba(8,13,24,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="px-4 py-4 flex items-center w-full text-left transition-opacity hover:opacity-80"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Logo variant="full" iconSize={34} showPrefix />
        </button>
        <SidebarNavLinks collapsed={false} />
        <ScoreWidget {...sharedWidgetProps} />
        <EntitySwitch />
      </aside>

      {/* ── TABLET SIDEBAR (640px–1024px) ────────────────────────────────────── */}
      <aside
        className="hidden sm:flex lg:hidden flex-col flex-shrink-0 overflow-hidden transition-all duration-200"
        style={{
          width: tabletExpanded ? 220 : 56,
          background: 'linear-gradient(180deg, rgba(11,18,32,0.98) 0%, rgba(8,13,24,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo / collapse toggle */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: tabletExpanded ? '14px 16px' : '14px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            minHeight: 57,
          }}
        >
          {tabletExpanded ? (
            <>
              <button onClick={() => navigate('/')} className="flex-1 min-w-0 text-left transition-opacity hover:opacity-80">
                <Logo variant="full" iconSize={28} showPrefix />
              </button>
              <button
                onClick={() => setTabletExpanded(false)}
                className="ml-2 flex items-center justify-center w-6 h-6 rounded-lg text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setTabletExpanded(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl mx-auto text-slate-400 hover:text-slate-200 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <SidebarNavLinks collapsed={!tabletExpanded} />

        {/* Score widget — only when expanded */}
        {tabletExpanded && <ScoreWidget {...sharedWidgetProps} />}
        {tabletExpanded && <EntitySwitch />}

        {/* Compact theme toggle — only when collapsed */}
        {!tabletExpanded && (
          <div className="pb-3 flex flex-col items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: theme === 'dark' ? '#94A3B8' : '#F59E0B' }}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        )}
      </aside>

      {/* ── MOBILE DRAWER OVERLAY (<640px) ───────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 flex flex-col overflow-hidden slide-in-left"
            style={{
              width: 280,
              background: 'linear-gradient(180deg, rgba(11,18,32,0.99) 0%, rgba(8,13,24,0.99) 100%)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => { navigate('/'); setDrawerOpen(false) }} className="flex-1 min-w-0 text-left transition-opacity hover:opacity-80">
                <Logo variant="full" iconSize={30} showPrefix />
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarNavLinks collapsed={false} onClose={() => setDrawerOpen(false)} />
            <ScoreWidget {...sharedWidgetProps} />
            <EntitySwitch />
          </aside>
        </div>
      )}

      {/* ── MOBILE "MORE" BOTTOM SHEET (<640px) ──────────────────────────────── */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 slide-up rounded-t-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(13,22,38,0.99) 0%, rgba(8,13,24,0.99) 100%)',
              borderTop: '1px solid rgba(255,255,255,0.10)',
              maxHeight: '80vh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div className="px-4 pb-2 flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: 'var(--dp-text-1)' }}>All Features</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi} className="px-4 pb-2">
                  {group.label && (
                    <span className="nav-section-label" style={{ paddingLeft: 4 }}>{group.label}</span>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {group.items.map(({ to, icon: Icon, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={to === '/toeic'}
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          `flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-center transition-all ${
                            isActive
                              ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20'
                              : 'text-slate-400 hover:text-slate-200 bg-white/[0.03] border border-transparent hover:border-white/[0.06]'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[11px] font-medium leading-tight">{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top header (<640px) */}
        <header
          className="sm:hidden flex items-center justify-between px-4 flex-shrink-0"
          style={{
            height: 52,
            background: 'var(--dp-surface)',
            borderBottom: '1px solid var(--dp-border-sm)',
            boxShadow: 'var(--dp-shadow-xs)',
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ color: 'var(--dp-text-3)' }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo variant="compact" iconSize={26} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: '#6366F1' }}>{score.total}</span>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: theme === 'dark' ? '#94A3B8' : '#F59E0B' }}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Page content — sole scroll container; sidebar and bottom nav stay fixed */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain mobile-scroll-pad sm:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div key={location.key} className="page-enter min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav (<640px) */}
        <nav
          className="sm:hidden fixed bottom-0 left-0 right-0 z-30 flex"
          style={{
            background: 'var(--dp-surface)',
            borderTop: '1px solid var(--dp-border-sm)',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {MOBILE_TAB_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/toeic'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-all duration-150 ${
                  isActive ? 'text-indigo-500' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
          {/* More tab */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-all duration-150 ${
              moreOpen ? 'text-indigo-500' : 'text-slate-500'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
