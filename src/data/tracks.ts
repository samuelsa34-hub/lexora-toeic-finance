import type { Track } from '../types'

// ── §20 item 1: Track seed data — all 5 v3 tracks ────────────────────────────
//
// Gated behind flags.tracks in the UI. This file is data-only; no component
// imports it directly yet. The flag check lives at the render layer.
//
// Existing English content is tagged trackId: 'english' in learningPaths.ts
// and learningPathsV2.ts. Other tracks are empty until §20 items 8–13 ship.

export const TRACKS: Track[] = [
  {
    id: 'english',
    portalId: 'english' as const,
    title: 'English & TOEIC',
    titleFr: 'Anglais & TOEIC',
    description: 'From A1 foundations to TOEIC 900+. Grammar, vocabulary, TOEIC strategy, and business English — the complete English-learning journey.',
    descriptionFr: 'Des bases A1 au TOEIC 900+. Grammaire, vocabulaire, stratégie TOEIC et anglais professionnel.',
    icon: '🇬🇧',
    order: 1,
    flagKey: 'learningPaths',  // gates the sub-content (paths A–F already behind this flag)
    color: 'indigo',
    studentPersonas: ['general', 'st_intern', 'ib_analyst', 'asset_mgmt', 'amf_prep', 'cfa_prep'],
  },

  {
    id: 'market_finance',
    portalId: 'finance' as const,
    title: 'Market Finance',
    titleFr: 'Finance de Marché',
    description: 'Macro & monetary policy, fixed income, equity, derivatives, and FX. Theory, worked examples, practice questions, and mini-cases — from F0 curious to F4 specialist.',
    descriptionFr: 'Macro, taux, crédit, actions, dérivés et change. De la curiosité F0 à la spécialisation F4.',
    icon: '📈',
    order: 2,
    flagKey: 'financeMarket',
    color: 'emerald',
    studentPersonas: ['st_intern', 'ib_analyst', 'asset_mgmt', 'cfa_prep'],
  },

  {
    id: 'financial_english',
    portalId: 'mixed' as const,
    title: 'Financial English',
    titleFr: 'Anglais Financier',
    description: 'The bridge between English fluency and market finance. 1500+ finance terms (FR ↔ EN), FT article reading, earnings-call listening, market commentary writing, and trade pitch speaking.',
    descriptionFr: 'Le pont entre l\'anglais et la finance. 1500+ termes (FR ↔ EN), articles FT, calls de résultats, commentaires de marché.',
    icon: '🌐',
    order: 3,
    flagKey: 'financeMarket',  // ships together with Market Finance track
    color: 'sky',
    studentPersonas: ['st_intern', 'ib_analyst', 'asset_mgmt', 'cfa_prep'],
  },

  {
    id: 'certifications',
    portalId: 'finance' as const,
    title: 'Certifications',
    titleFr: 'Certifications',
    description: 'AMF (French regulatory), CFA Level 1, and ACI Dealing Certificate. Chapter-by-chapter prep, question banks, timed mocks, and score predictors for each certification.',
    descriptionFr: 'AMF, CFA Niveau 1 et ACI Dealing. Révision chapitre par chapitre, banque de questions, mocks chronométrés et prédiction de score.',
    icon: '🏅',
    order: 4,
    flagKey: 'amfPrep',  // AMF ships first; CFA behind cfaPrep
    color: 'amber',
    studentPersonas: ['amf_prep', 'cfa_prep', 'aci_prep', 'st_intern', 'asset_mgmt'],
  },

  {
    id: 'trading',
    portalId: 'finance' as const,
    title: 'Trading & Technical Analysis',
    titleFr: 'Trading & Analyse Technique',
    description: 'Chart patterns, indicators, candlestick reading, risk management (Kelly, drawdown, position sizing), order types, and a paper-trading simulator on historical data — pedagogical only.',
    descriptionFr: 'Figures chartistes, indicateurs, chandeliers japonais, gestion du risque et simulateur de paper trading sur données historiques.',
    icon: '📊',
    order: 5,
    flagKey: 'tradingTrack',
    color: 'violet',
    studentPersonas: ['st_intern', 'asset_mgmt', 'general'],
  },
]

export const TRACK_BY_ID = Object.fromEntries(TRACKS.map(t => [t.id, t])) as Record<string, Track>

// CEFR ↔ TOEIC Reading mapping (ETS guideline-based, for display)
export const CEFR_TOEIC_MAP: Record<string, { range: string; label: string }> = {
  A1: { range: '< 60',    label: 'A1 — Beginner' },
  A2: { range: '60–115',  label: 'A2 — Elementary' },
  B1: { range: '115–275', label: 'B1 — Intermediate' },
  B2: { range: '275–385', label: 'B2 — Upper Intermediate' },
  C1: { range: '385–455', label: 'C1 — Advanced' },
  C2: { range: '455–495', label: 'C2 — Proficient' },
}

// Market Finance level labels
export const MARKET_FINANCE_LABELS: Record<string, string> = {
  F0: 'F0 — Curious (no prior exposure)',
  F1: 'F1 — Foundations (knows products by name)',
  F2: 'F2 — Practitioner (prices simple instruments)',
  F3: 'F3 — Advanced (Greeks, vol surface, structured products)',
  F4: 'F4 — Specialist (institutional-grade)',
}

// Trading level labels
export const TRADING_LEVEL_LABELS: Record<string, string> = {
  T0: 'T0 — Curious',
  T1: 'T1 — Reader (understands charts)',
  T2: 'T2 — Practitioner (applies indicators)',
  T3: 'T3 — Disciplined (systematic risk management)',
}
