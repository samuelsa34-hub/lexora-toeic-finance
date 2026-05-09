export const flags = {
  // ── v2 flags ──────────────────────────────────────────────────────────────
  learningPaths:    false,   // broad English learning paths A–F
  placementTestV2:  false,   // adaptive IRT-style placement test
  audioV1:          false,   // TTS dictionary audio
  // ── v3 flags ──────────────────────────────────────────────────────────────
  tracks:           false,   // multi-track architecture
  financeMarket:    false,   // Market Finance track
  cfaPrep:          false,   // CFA Level 1 certification track
  amfPrep:          false,   // AMF certification track (French regulatory)
  tradingTrack:     false,   // Trading & Technical Analysis track
  interviewPrep:    false,   // Finance interview prep module
  aiTutor:          false,   // AI explanation on demand + conversational tutor
  schoolMode:       false,   // B2B school accounts, cohorts, bulk assignments
  // ── v4 flags ──────────────────────────────────────────────────────────────
  dualPortal:       false,   // dual-portal architecture (Portal A + Portal B)
  financePortal:    false,   // Portal B (Finance Pro) visible to this user
  assets3D:         false,   // static 3D-rendered assets (badges, icons, empty states)
  interactive3D:    false,   // interactive Three.js components (vol surface, yield curve)
  // ── v5 flags ──────────────────────────────────────────────────────────────
  visual3D:         false,   // master gate for all 3D/Blender-style visuals (Tier A–C)
  starfieldHero:    false,   // animated canvas starfield on parent homepage hero (/)
  // ── v6 flags ──────────────────────────────────────────────────────────────
  parentLandingV2:  false,   // redesigned parent landing at / (9-section brand gateway)
} as const

export type FeatureFlag = keyof typeof flags
