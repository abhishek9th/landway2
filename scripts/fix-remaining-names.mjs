/**
 * Replaces remaining hardcoded project-name literals in component copy/alt text
 * with the dynamic BRAND.project, so each page shows its own name.
 * Idempotent. Run: node scripts/fix-remaining-names.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const AMUL = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)
const SLUGS = [
  'atal-vilas','bhagwanti-enclave','indraprastha-residency','kalp-residency',
  'kishkindha-enclave','lakshya-avenue','landway-14','manipal-avenue',
  'manipal-delight','neelkanth-enclave','sankalp-plaza','saraswati-enclave',
  'sharda-enclave','swastik-enclave',
]
const NAMES = ['Kalp Residency', 'Bhagwati Enclave']

function ensureBrand(src) {
  if (/import\s*\{[^}]*\bBRAND\b[^}]*\}\s*from ['"]\.\.\/data\/kalp['"]/.test(src)) return src
  const m = src.match(/import\s*\{([^}]*)\}\s*from ['"]\.\.\/data\/kalp['"]/)
  if (m) {
    const names = m[1].trim().replace(/,\s*$/, '')
    return src.replace(m[0], `import { ${names}, BRAND } from '../data/kalp'`)
  }
  return src.replace(/(^import[^\n]*\n)/m, `$1import { BRAND } from '../data/kalp'\n`)
}

function edit(file, fn) {
  if (!existsSync(file)) return 'missing'
  const before = readFileSync(file, 'utf8')
  const after = fn(before)
  if (after === before) return 'nochange'
  writeFileSync(file, after, 'utf8')
  return 'ok'
}

// [component, [ {find(name)=>str, repl} ], needsBrandImport]
const jobs = [
  ['CTAModal.tsx', (n) => [`to know about ${n}.`, 'to know about {BRAND.project}.']],
  ['LocationAdvantages.tsx', (n) => [`Shaheed Path, ${n} keeps the airport`, 'Shaheed Path, {BRAND.project} keeps the airport']],
  ['LocationAdvantages.tsx', (n) => [`title="${n} location map"`, 'title={`${BRAND.project} location map`}']],
  ['Testimonials.tsx', (n) => [`subtitle="Real stories from ${n} homeowners and investors."`, 'subtitle={`Real stories from ${BRAND.project} homeowners and investors.`}']],
  ['Hero.tsx', (n) => [`alt="${n} independent villas near Shaheed Path, Lucknow"`, 'alt={`${BRAND.project} independent villas near Shaheed Path, Lucknow`}']],
  ['FloorPlans.tsx', (n) => [`plan — ${n}\``, 'plan — ${BRAND.project}`']],
  ['ConstructionQuality.tsx', (n) => [`alt="Premium construction quality at ${n}"`, 'alt={`Premium construction quality at ${BRAND.project}`}']],
  ['MasterPlan.tsx', (n) => [`alt="${n} master plan layout"`, 'alt={`${BRAND.project} master plan layout`}']],
]

for (const slug of SLUGS) {
  const compDir = join(AMUL, slug, 'src/components')
  const touched = new Set()
  const res = {}
  for (const [comp, make] of jobs) {
    const file = join(compDir, comp)
    res[comp] = edit(file, (src) => {
      let out = src
      for (const n of NAMES) {
        const [find, repl] = make(n)
        if (out.includes(find)) out = out.split(find).join(repl)
      }
      if (out !== src && !touched.has(comp)) {
        out = ensureBrand(out)
        touched.add(comp)
      }
      return out
    })
  }
  console.log(slug, JSON.stringify(res))
}
console.log('Done.')
