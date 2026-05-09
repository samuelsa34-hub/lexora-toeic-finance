import type { FinanceModule } from '../types'

// ── LEXORA Finance — Academy module seed data ──────────────────────────────────
//
// Six levels (F0–F5) mirroring the MarketFinanceLevel taxonomy.
// status: 'available' = launched | 'beta' = early access | 'coming_soon' = roadmap
// route: the /finance/* path for the module (undefined = no page yet)

export const FINANCE_MODULES: FinanceModule[] = [
  // ── Level F0 — Finance Foundations ──────────────────────────────────────────
  {
    id: 'f0_markets_101',
    level: 'F0',
    title: 'Financial Markets 101',
    titleFr: 'Marchés Financiers 101',
    description: 'How financial markets work: the key players, the instruments, and the flows of capital that drive the global economy.',
    descriptionFr: 'Comment fonctionnent les marchés financiers : acteurs clés, instruments, et flux de capitaux.',
    topics: ['Primary vs secondary markets', 'Buy-side & sell-side', 'Stock exchanges', 'OTC markets', 'Market participants', 'Capital allocation'],
    status: 'available',
    icon: '🏛️',
    color: 'emerald',
    estimatedHours: 3,
    order: 1,
    route: '/finance/academy',
  },
  {
    id: 'f0_stocks_bonds',
    level: 'F0',
    title: 'Stocks & Bonds',
    titleFr: 'Actions & Obligations',
    description: 'The two foundational asset classes. Understand equity ownership, bond mechanics, risk/return profiles, and why portfolios hold both.',
    descriptionFr: 'Les deux classes d\'actifs fondamentales : actions, obligations, risque et rendement.',
    topics: ['What is a stock?', 'Equity vs debt', 'Coupon & maturity', 'Par value', 'Credit ratings', 'Dividends'],
    status: 'available',
    icon: '📊',
    color: 'emerald',
    estimatedHours: 3,
    order: 2,
    route: '/finance/academy',
  },
  {
    id: 'f0_rates_macro',
    level: 'F0',
    title: 'Interest Rates & Central Banks',
    titleFr: 'Taux d\'Intérêt & Banques Centrales',
    description: 'How central banks set policy rates, what the yield curve tells us, and why interest rates are the most important variable in finance.',
    descriptionFr: 'Comment les banques centrales fixent les taux directeurs, ce que la courbe des taux nous dit.',
    topics: ['Policy rates', 'Fed & ECB', 'Inflation targeting', 'Yield curve basics', 'Hawkish vs dovish', 'Rate cycle'],
    status: 'available',
    icon: '🏦',
    color: 'emerald',
    estimatedHours: 4,
    order: 3,
    route: '/finance/academy',
  },

  // ── Level F1 — Market Finance ────────────────────────────────────────────────
  {
    id: 'f1_fixed_income',
    level: 'F1',
    title: 'Fixed Income Fundamentals',
    titleFr: 'Obligataire — Fondamentaux',
    description: 'Bond pricing, yield, duration, convexity, DV01, and credit spreads. The quantitative language of the rates desk.',
    descriptionFr: 'Pricing obligataire, rendement, duration, convexité, DV01 et spreads de crédit.',
    topics: ['Bond pricing formula', 'Yield-to-maturity', 'Duration & modified duration', 'Convexity', 'DV01 / PVBP', 'Credit spread', 'Repo & funding'],
    status: 'beta',
    icon: '📈',
    color: 'blue',
    estimatedHours: 8,
    order: 4,
    route: '/finance/fixed-income',
  },
  {
    id: 'f1_equity',
    level: 'F1',
    title: 'Equity Markets',
    titleFr: 'Marchés Actions',
    description: 'Equity indices, valuation multiples, sector rotation, IPOs, and how equity desks think about market structure.',
    descriptionFr: 'Indices actions, multiples de valorisation, rotation sectorielle, IPOs.',
    topics: ['Equity indices', 'P/E, EV/EBITDA', 'Sector rotation', 'IPO mechanics', 'Short selling', 'Market cap'],
    status: 'coming_soon',
    icon: '📉',
    color: 'blue',
    estimatedHours: 6,
    order: 5,
  },
  {
    id: 'f1_fx_commodities',
    level: 'F1',
    title: 'FX & Commodities',
    titleFr: 'Change & Matières Premières',
    description: 'Foreign exchange mechanics, spot vs forward rates, commodity markets, and how geopolitics moves prices.',
    descriptionFr: 'Mécanismes du change, taux spot vs forward, marchés des matières premières.',
    topics: ['Spot FX', 'FX forward', 'Currency pairs', 'Oil markets', 'Gold as safe-haven', 'Commodity indices'],
    status: 'coming_soon',
    icon: '🌍',
    color: 'blue',
    estimatedHours: 5,
    order: 6,
  },

  // ── Level F2 — Derivatives ───────────────────────────────────────────────────
  {
    id: 'f2_options_greeks',
    level: 'F2',
    title: 'Options & Greeks',
    titleFr: 'Options & Grecques',
    description: 'From calls and puts to Black-Scholes, the full Greeks (delta, gamma, vega, theta, rho), volatility surfaces, and major strategies.',
    descriptionFr: 'Des calls et puts à Black-Scholes, les grecques, surfaces de volatilité et stratégies.',
    topics: ['Call & put mechanics', 'Moneyness', 'Intrinsic & time value', 'Implied volatility', 'Delta/Gamma/Vega/Theta', 'Black-Scholes intuition', 'Vol smile & skew'],
    status: 'beta',
    icon: '⚡',
    color: 'violet',
    estimatedHours: 10,
    order: 7,
    route: '/finance/derivatives',
  },
  {
    id: 'f2_futures_forwards',
    level: 'F2',
    title: 'Futures & Forwards',
    titleFr: 'Futures & Forwards',
    description: 'Linear derivatives: pricing, settlement, hedging applications, roll mechanics, and the differences between futures and OTC forwards.',
    descriptionFr: 'Dérivés linéaires : pricing, règlement, couverture, roll et différences OTC.',
    topics: ['Forward pricing', 'Cost-of-carry', 'Futures settlement', 'Hedging with futures', 'Basis risk', 'Roll'],
    status: 'coming_soon',
    icon: '📐',
    color: 'violet',
    estimatedHours: 6,
    order: 8,
  },
  {
    id: 'f2_swaps_cds',
    level: 'F2',
    title: 'Swaps & Credit Derivatives',
    titleFr: 'Swaps & Dérivés de Crédit',
    description: 'Interest rate swaps, cross-currency swaps, CDS mechanics, and how institutions use these instruments to manage interest rate and credit risk.',
    descriptionFr: 'Swaps de taux, swaps de devises, CDS et gestion du risque de crédit.',
    topics: ['IRS mechanics', 'Swap legs', 'Cross-currency swap', 'CDS protection', 'CDS spread', 'Credit events'],
    status: 'coming_soon',
    icon: '🔄',
    color: 'violet',
    estimatedHours: 7,
    order: 9,
  },

  // ── Level F3 — Trading & Sales ───────────────────────────────────────────────
  {
    id: 'f3_trade_lifecycle',
    level: 'F3',
    title: 'Trade Lifecycle',
    titleFr: 'Cycle de Vie d\'une Transaction',
    description: 'The complete journey of a trade: from client order to settlement. Front, middle, and back office roles explained with real-world examples.',
    descriptionFr: 'Le parcours complet d\'une transaction : du carnet d\'ordres au règlement-livraison.',
    topics: ['Order routing', 'Execution', 'Allocation', 'Confirmation', 'Clearing', 'Settlement', 'Fails & reconciliation', 'Front/Middle/Back office'],
    status: 'available',
    icon: '🔁',
    color: 'amber',
    estimatedHours: 4,
    order: 10,
    route: '/finance/academy',
  },
  {
    id: 'f3_market_making',
    level: 'F3',
    title: 'Market Making & Execution',
    titleFr: 'Tenue de Marché & Exécution',
    description: 'How market makers operate: bid/ask management, inventory risk, hedging, order types, and algorithmic execution.',
    descriptionFr: 'Comment les teneurs de marché opèrent : gestion bid/ask, risque d\'inventaire.',
    topics: ['Bid/ask spread', 'Inventory management', 'Market impact', 'Order types', 'VWAP/TWAP', 'Dark pools'],
    status: 'coming_soon',
    icon: '⚖️',
    color: 'amber',
    estimatedHours: 5,
    order: 11,
  },

  // ── Level F4 — Interview Prep ────────────────────────────────────────────────
  {
    id: 'f4_technical',
    level: 'F4',
    title: 'Technical Interview Questions',
    titleFr: 'Questions Techniques d\'Entretien',
    description: 'The 50 most common technical questions asked in S&T, IB, and AM interviews, with model answers and common mistakes.',
    descriptionFr: 'Les 50 questions techniques les plus posées en entretien S&T, IB et AM.',
    topics: ['Bond pricing questions', 'Options & Greeks', 'Macro questions', 'Trade ideas', 'Market structure', 'Valuation'],
    status: 'available',
    icon: '🎯',
    color: 'red',
    estimatedHours: 6,
    order: 12,
    route: '/finance/interview',
  },
  {
    id: 'f4_markets_awareness',
    level: 'F4',
    title: 'Market Awareness',
    titleFr: 'Culture Marché',
    description: 'How to follow and discuss markets professionally. Understanding macro regimes, reading financial news, and structuring market commentary.',
    descriptionFr: 'Suivre et commenter les marchés professionnellement. Macro, news financières, commentary.',
    topics: ['Reading FT/Bloomberg', 'Macro themes', 'Central bank watch', 'Earnings season', 'Market commentary', 'Trade ideas pitching'],
    status: 'coming_soon',
    icon: '📰',
    color: 'red',
    estimatedHours: 4,
    order: 13,
  },

  // ── Level F5 — Pro Tools ─────────────────────────────────────────────────────
  {
    id: 'f5_bond_pricer',
    level: 'F5',
    title: 'Bond Pricer & Duration Calculator',
    titleFr: 'Pricer Obligataire & Duration',
    description: 'Interactive bond pricing calculator covering price, YTM, modified duration, convexity, and DV01. Input real bond parameters and see the math.',
    descriptionFr: 'Calculateur obligataire interactif : prix, YTM, duration modifiée, convexité, DV01.',
    topics: ['Bond price from yield', 'YTM solver', 'Duration ladder', 'Convexity adjustment', 'DV01 calculation'],
    status: 'coming_soon',
    icon: '🔢',
    color: 'slate',
    estimatedHours: 0,
    order: 14,
    route: '/finance/tools',
  },
  {
    id: 'f5_options_payoff',
    level: 'F5',
    title: 'Options Payoff Visualizer',
    titleFr: 'Visualiseur de Payoff',
    description: 'Plot option payoffs, strategy P&L diagrams, and Greeks sensitivities. Supports single legs and multi-leg strategies.',
    descriptionFr: 'Tracé de payoffs, P&L de stratégies, sensibilités aux grecques.',
    topics: ['Single leg payoffs', 'Strategy diagrams', 'Breakeven calculator', 'Greeks at expiry', 'Vol impact'],
    status: 'coming_soon',
    icon: '📐',
    color: 'slate',
    estimatedHours: 0,
    order: 15,
    route: '/finance/tools',
  },
  {
    id: 'f5_greeks_calc',
    level: 'F5',
    title: 'Black-Scholes Greeks Calculator',
    titleFr: 'Calculateur Black-Scholes',
    description: 'Real-time Black-Scholes pricer with full Greek output. Adjust spot, strike, vol, time, and rate to see pricing sensitivities.',
    descriptionFr: 'Pricer Black-Scholes en temps réel avec toutes les grecques.',
    topics: ['BS price', 'Delta & gamma', 'Vega & theta', 'Rho', 'Sensitivity tables'],
    status: 'coming_soon',
    icon: '🧮',
    color: 'slate',
    estimatedHours: 0,
    order: 16,
    route: '/finance/tools',
  },
]

export const FINANCE_MODULE_BY_ID = Object.fromEntries(
  FINANCE_MODULES.map(m => [m.id, m])
) as Record<string, FinanceModule>

// Group modules by level for the Academy hub
export const FINANCE_MODULES_BY_LEVEL = FINANCE_MODULES.reduce<Record<string, FinanceModule[]>>(
  (acc, mod) => {
    const level = mod.level as string
    if (!acc[level]) acc[level] = []
    acc[level].push(mod)
    return acc
  },
  {}
)

// Level metadata for the Academy hub display
export const FINANCE_LEVEL_META: Record<string, {
  label: string
  labelFr: string
  description: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  accentText: string
}> = {
  F0: {
    label: 'Finance Foundations',
    labelFr: 'Fondements de la Finance',
    description: 'No prior finance knowledge required. Build the vocabulary, mental models, and intuitions that underpin all of market finance.',
    icon: '🌱',
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.08)',
    borderColor: 'rgba(16,185,129,0.20)',
    accentText: 'text-emerald-400',
  },
  F1: {
    label: 'Market Finance',
    labelFr: 'Finance de Marché',
    description: 'The core asset classes: fixed income, equity, FX, and commodities. Understand how each market works and how they interconnect.',
    icon: '📊',
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.20)',
    accentText: 'text-blue-400',
  },
  F2: {
    label: 'Derivatives',
    labelFr: 'Dérivés',
    description: 'Options, futures, forwards, swaps, and structured products. The quantitative layer of market finance, with full Greeks coverage.',
    icon: '⚡',
    color: '#8B5CF6',
    bgColor: 'rgba(139,92,246,0.08)',
    borderColor: 'rgba(139,92,246,0.20)',
    accentText: 'text-violet-400',
  },
  F3: {
    label: 'Trading & Sales',
    labelFr: 'Trading & Sales',
    description: 'How trades are executed, priced, and processed. The trade lifecycle, market making mechanics, and client-facing roles.',
    icon: '⚖️',
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.20)',
    accentText: 'text-amber-400',
  },
  F4: {
    label: 'Interview Prep',
    labelFr: 'Préparation Entretien',
    description: 'Technical questions, market awareness, trade pitches, and behavioral rounds for S&T, IB, and AM interviews.',
    icon: '🎯',
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.20)',
    accentText: 'text-red-400',
  },
  F5: {
    label: 'Pro Tools',
    labelFr: 'Outils Professionnels',
    description: 'Interactive calculators and visualizers: bond pricer, Black-Scholes, Greeks, payoff diagrams, and portfolio analytics.',
    icon: '🔢',
    color: '#64748B',
    bgColor: 'rgba(100,116,139,0.08)',
    borderColor: 'rgba(100,116,139,0.20)',
    accentText: 'text-slate-400',
  },
}
