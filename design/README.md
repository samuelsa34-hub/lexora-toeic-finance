# LEXORA Visual Design System — 3D Asset Pipeline

## Overview

This document describes the Blender-to-web pipeline for LEXORA's premium visual layer.
All 3D assets go through a strict optimisation pass before landing in `public/`.

## Tier Model

| Tier | What ships | When | Guard |
|------|-----------|------|-------|
| **A** | AVIF/WebP/JPEG static image | Always (CSS gradient fallback if image absent) | `flags.visual3D` |
| **B** | Looping video (WebM + MP4) | Desktop ≥ 768px, `deviceMemory ≥ 4 GB`, no `prefers-reduced-motion` | `useDeviceCapabilities().canPlayTierB` |
| **C** | Interactive `<model-viewer>` | WebGL present, `deviceMemory ≥ 4 GB` | `useDeviceCapabilities().canPlayTierC` |

Phase 1 ships CSS gradient placeholders only — no binary assets required.
Enable a tier by setting `flags.visual3D = true` in `src/config/flags.ts`.

---

## Directory Layout

```
public/assets/3d/
├── lexora/          # LEXORA brand / homepage visuals
│   ├── hero.avif
│   ├── hero.webp
│   ├── hero.jpg
│   ├── hero@2x.avif
│   ├── hero@2x.webp
│   ├── hero@2x.jpg
│   ├── poster.avif   # video still (used before video loads)
│   ├── poster.webp
│   └── poster.jpg
├── toeic/           # TOEIC portal visuals
│   └── (same structure)
└── finance/         # LEXORA Finance visuals
    └── (same structure)

src/assets/3d-source/   # Raw Blender exports — NOT committed (add to .gitignore)
├── lexora/
│   ├── hero.png        # 3840×2160 RGBA PNG from Blender
│   ├── hero@2x.png     # same, higher sample count
│   └── poster.png      # single-frame still for video poster
├── toeic/
└── finance/
```

---

## Asset Production Checklist (per entity)

1. **Blender render** — target resolution 3840×2160 minimum for hero, 1920×1080 minimum for poster
2. **Export** as PNG (lossless) to `src/assets/3d-source/<entity>/`
3. **Run pipeline** — `node scripts/optimize-assets.mjs --entity <entity>`
4. **Verify outputs** — sizes: hero AVIF < 200 KB, hero WebP < 300 KB, hero JPEG < 350 KB
5. **Update component** — pass `imageSources` prop to the matching `*Hero3D` component
6. **Test** — run through the Tier A/B/C matrix in browser devtools

---

## Optimisation Script

```bash
# Install dependency (one-time)
npm install --save-dev sharp

# Process all entities
node scripts/optimize-assets.mjs

# Process one entity only
node scripts/optimize-assets.mjs --entity toeic
```

Script source: `scripts/optimize-assets.mjs`

### Output quality targets

| Format | Hero | Hero@2x | Poster |
|--------|------|---------|--------|
| AVIF | q65 | q55 | q60 |
| WebP | q80 | q72 | q78 |
| JPEG | q82 | q75 | q80 |

---

## Component Integration

Each entity has a flag-gated hero component in `src/components/visuals/`:

```tsx
// Phase 1 — gradient only (imageSources omitted)
<LexoraHero3D variant="hero" className="absolute inset-0" />

// Phase 4 — real image over gradient
<LexoraHero3D
  variant="hero"
  className="absolute inset-0"
  imageSources={{
    avif: '/assets/3d/lexora/hero.avif',
    webp: '/assets/3d/lexora/hero.webp',
    fallback: '/assets/3d/lexora/hero.jpg',
  }}
  imageAlt="LEXORA hero — abstract indigo and violet geometry"
  imageSizes="100vw"
/>
```

### `<picture>` source ordering

The browser picks the **first** source it can decode:
1. AVIF — ~30% smaller than WebP, supported in Chrome 85+, Safari 16+, Firefox 93+
2. WebP — broad support, ~25% smaller than JPEG
3. JPEG — universal fallback

---

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Foundation: components, hooks, CSS gradient placeholders, pipeline scaffolding | ✅ Complete |
| 2 | LoginVisual3D integrated into ProfileGate `.pg-hero` slot | Awaiting approval |
| 3 | Hero3D components dropped into GlobalHomepage, ToeicDashboard, FinanceDashboard | Awaiting approval |
| 4 | Real AVIF/WebP renders replace CSS gradient placeholders | Awaiting approval |
| 5 | Looping WebM/MP4 on homepage hero (desktop, Tier B) | Awaiting approval |
| 6 | `<model-viewer>` interactive 3D on one showcase page (Tier C) | Awaiting approval |

---

## `.gitignore` additions

Add to `.gitignore` to avoid committing large raw renders:

```gitignore
# Raw 3D source exports — run optimize-assets.mjs to regenerate outputs
src/assets/3d-source/
```
