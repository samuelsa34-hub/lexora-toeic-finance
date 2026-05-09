#!/usr/bin/env node
/**
 * optimize-assets.mjs
 *
 * Converts source images in src/assets/3d-source/ into optimised web formats.
 * Output lands in public/assets/3d/<entity>/ and is served statically.
 *
 * Usage:
 *   node scripts/optimize-assets.mjs               # process all entities
 *   node scripts/optimize-assets.mjs --entity toeic # single entity
 *
 * Prerequisites:
 *   npm install --save-dev sharp
 *
 * Inputs expected (per entity):
 *   src/assets/3d-source/<entity>/hero.png       → hero AVIF + WebP + JPEG
 *   src/assets/3d-source/<entity>/hero@2x.png    → 2× variants
 *   src/assets/3d-source/<entity>/poster.png     → video poster (AVIF + WebP + JPEG)
 *
 * Outputs written to:
 *   public/assets/3d/<entity>/hero.avif
 *   public/assets/3d/<entity>/hero.webp
 *   public/assets/3d/<entity>/hero.jpg
 *   public/assets/3d/<entity>/hero@2x.avif
 *   public/assets/3d/<entity>/hero@2x.webp
 *   public/assets/3d/<entity>/hero@2x.jpg
 *   public/assets/3d/<entity>/poster.avif
 *   public/assets/3d/<entity>/poster.webp
 *   public/assets/3d/<entity>/poster.jpg
 */

import { createRequire } from 'module'
import { existsSync, readdirSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ENTITIES = ['lexora', 'toeic', 'finance']

const SIZES = {
  hero:    { width: 1440, quality: { avif: 65, webp: 80, jpeg: 82 } },
  'hero@2x': { width: 2880, quality: { avif: 55, webp: 72, jpeg: 75 } },
  poster:  { width: 1920, quality: { avif: 60, webp: 78, jpeg: 80 } },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function processImage(sharp, inputPath, outputDir, name, config) {
  const base = join(outputDir, name)

  const img = sharp(inputPath).resize({ width: config.width, withoutEnlargement: true })

  await Promise.all([
    img.clone().avif({ quality: config.quality.avif }).toFile(`${base}.avif`),
    img.clone().webp({ quality: config.quality.webp }).toFile(`${base}.webp`),
    img.clone().jpeg({ quality: config.quality.jpeg, progressive: true }).toFile(`${base}.jpg`),
  ])

  console.log(`  ✓ ${name}.{avif,webp,jpg}`)
}

async function processEntity(sharp, entity) {
  const sourceDir = join(ROOT, 'src', 'assets', '3d-source', entity)
  const outputDir = join(ROOT, 'public', 'assets', '3d', entity)

  if (!existsSync(sourceDir)) {
    console.log(`  ⚠  No source dir at ${sourceDir} — skipping ${entity}`)
    return
  }

  console.log(`\n[${entity}]`)

  for (const [name, config] of Object.entries(SIZES)) {
    const candidates = [`${name}.png`, `${name}.jpg`, `${name}.jpeg`, `${name}.webp`]
    const inputFile = candidates.find(f => existsSync(join(sourceDir, f)))

    if (!inputFile) {
      console.log(`  –  ${name}: no source found (${candidates[0]} etc.) — skipping`)
      continue
    }

    await processImage(sharp, join(sourceDir, inputFile), outputDir, name, config)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('sharp not installed. Run: npm install --save-dev sharp')
    process.exit(1)
  }

  const entityArg = process.argv.includes('--entity')
    ? process.argv[process.argv.indexOf('--entity') + 1]
    : null

  const targets = entityArg ? [entityArg] : ENTITIES

  for (const entity of targets) {
    await processEntity(sharp, entity)
  }

  console.log('\nDone.')
}

main().catch(err => { console.error(err); process.exit(1) })
