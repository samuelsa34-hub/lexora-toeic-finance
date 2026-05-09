import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, BookMarked, Briefcase, FileQuestion,
  Wrench, Menu, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Logo } from '../ui/Logo'
import { EntitySwitch } from './EntitySwitch'

type NavItem = { to: string; icon: React.ElementType; label: string; end?: boolean }
type NavGroup = { label?: string; items: NavItem[] }

const FINANCE_NAV: NavGroup[] = [
  {
    items: [
      { to: '/finance',          icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'LEARN',
    items: [
      { to: '/finance/academy',    icon: GraduationCap, label: 'Academy'    },
      { to: '/finance/dictionary', icon: BookMarked,    label: 'Dictionary' },
      { to: '/finance/interview',  icon: FileQuestion,  label: 'Interview'  },
    ],
  },
  {
    label: 'DEEP DIVES',
    items: [
      { to: '/finance/fixed-income',  icon: Briefcase, label: 'Fixed Income'  },
      { to: '/finance/derivatives',   icon: Briefcase, label: 'Derivatives'   },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { to: '/finance/tools', icon: Wrench, label: 'Calculators' },
    ],
  },
]

function FinanceSidebarNav({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  return (
    <nav
      className="flex-1 overflow-y-auto no-scrollbar"
      style={{ padding: collapsed ? '8px 0' : '8px 12px' }}
    >
      {FINANCE_NAV.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-0.5' : ''}>
          {group.label && !collapsed && (
            <span className="nav-section-label">{group.label}</span>
          )}
          {collapsed && gi > 0 && (
            <div style={{ height: 1, margin: '6px 8px', background: 'rgba(255,255,255,0.05)' }} />
          )}
          {group.items.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                collapsed
                  ? `sidebar-icon-btn flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-0.5 transition-all duration-150 ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                    }`
                  : `flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                    }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

// ── Main Finance Layout ────────────────────────────────────────────────────────

export const FinanceLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tabletExpanded, setTabletExpanded] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const sidebarBg = 'linear-gradient(180deg, rgba(9,9,11,0.99) 0%, rgba(6,6,8,0.99) 100%)'
  const borderStyle = '1px solid rgba(255,255,255,0.06)'

  return (
    <div data-entity="finance" className="flex h-dvh-safe overflow-hidden" style={{ background: '#09090B' }}>

      {/* ── DESKTOP SIDEBAR (≥1024px) ──────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 w-60 overflow-hidden"
        style={{ background: sidebarBg, borderRight: borderStyle }}
      >
        <button
          onClick={() => navigate('/')}
          className="px-4 py-4 flex items-center w-full text-left transition-opacity hover:opacity-80"
          style={{ borderBottom: borderStyle }}
        >
          <Logo variant="full" iconSize={34} showPrefix={false} mono="white" />
          <span
            className="ml-2 text-[10px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
            style={{ color: '#60A5FA', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.20)' }}
          >
            Finance
          </span>
        </button>
        <FinanceSidebarNav collapsed={false} />
        <EntitySwitch />
      </aside>

      {/* ── TABLET SIDEBAR (640px–1024px) ──────────────────────────────────────── */}
      <aside
        className="hidden sm:flex lg:hidden flex-col flex-shrink-0 overflow-hidden transition-all duration-200"
        style={{ width: tabletExpanded ? 220 : 56, background: sidebarBg, borderRight: borderStyle }}
      >
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: tabletExpanded ? '14px 16px' : '14px 8px',
            borderBottom: borderStyle,
            minHeight: 57,
          }}
        >
          {tabletExpanded ? (
            <>
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 flex-1 min-w-0 text-left transition-opacity hover:opacity-80">
                <Logo variant="icon" iconSize={24} mono="white" />
                <span className="text-xs font-bold text-slate-200">Finance</span>
              </button>
              <button
                onClick={() => setTabletExpanded(false)}
                className="flex items-center justify-center w-6 h-6 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                title="Collapse"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setTabletExpanded(true)}
              className="mx-auto flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
              title="Expand"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <FinanceSidebarNav collapsed={!tabletExpanded} />
        {tabletExpanded && <EntitySwitch />}
      </aside>

      {/* ── MOBILE HEADER (< 640px) ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <header
          className="sm:hidden flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 56, background: 'rgba(9,9,11,0.98)', borderBottom: borderStyle }}
        >
          <div className="flex items-center gap-2">
            <Logo variant="icon" iconSize={28} mono="white" />
            <span className="text-sm font-bold text-slate-200">Finance</span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#09090B' }}>
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 sm:hidden"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 sm:hidden overflow-hidden"
            style={{ background: 'rgba(9,9,11,0.99)', borderRight: borderStyle }}
          >
            <div className="flex items-center justify-between px-4" style={{ height: 56, borderBottom: borderStyle }}>
              <button onClick={() => { navigate('/'); setDrawerOpen(false) }} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Logo variant="icon" iconSize={28} mono="white" />
                <span className="text-sm font-bold text-slate-200">Finance</span>
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FinanceSidebarNav collapsed={false} onClose={() => setDrawerOpen(false)} />
            <EntitySwitch />
          </aside>
        </>
      )}
    </div>
  )
}
