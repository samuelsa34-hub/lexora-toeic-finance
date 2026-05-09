import type { Portal } from '../types'

// ── §24 item 1: Portal seed data — two distinct universes ─────────────────────
//
// Gated behind flags.dualPortal in the UI.
// Portal A (english) is the original Lexora, always available.
// Portal B (finance) is unlocked behind flags.financePortal.
//
// The portal switch button is always visible once flags.dualPortal is true.
// Without the flag, only Portal A is shown and no portal concept exists in the UI.

export const PORTALS: Portal[] = [
  {
    id: 'english',
    title: 'English & TOEIC',
    titleFr: 'Anglais & TOEIC',
    subtitle: 'Lexora Lingua',
    description: 'From A1 foundations to TOEIC 900+. Grammar, vocabulary, TOEIC strategy, and business English.',
    descriptionFr: 'Des bases A1 au TOEIC 900+. Grammaire, vocabulaire, stratégie TOEIC et anglais professionnel.',
    icon: '🇬🇧',
    flagKey: 'learningPaths',
    defaultTheme: 'light',
    accentColor: '#4F6EF7',
  },
  {
    id: 'finance',
    title: 'Finance Pro',
    titleFr: 'Finance Pro',
    subtitle: 'Lexora Markets',
    description: 'Market Finance, Financial English, Certifications (CFA / AMF / ACI), and Trading. The full toolkit for a finance career.',
    descriptionFr: 'Finance de marché, anglais financier, certifications (CFA / AMF / ACI) et trading.',
    icon: '📈',
    flagKey: 'financePortal',
    defaultTheme: 'dark',
    accentColor: '#F59E0B',
  },
]

export const PORTAL_BY_ID = Object.fromEntries(PORTALS.map(p => [p.id, p])) as Record<string, Portal>

// Portal-to-track routing: which tracks live in which portal
export const PORTAL_TRACKS: Record<string, string[]> = {
  english: ['english'],
  finance: ['market_finance', 'financial_english', 'certifications', 'trading'],
}

// Track-to-portal reverse lookup (derived)
export const TRACK_PORTAL: Record<string, string> = {
  english:            'english',
  market_finance:     'finance',
  financial_english:  'mixed',  // both portals per §3 v4
  certifications:     'finance',
  trading:            'finance',
}
