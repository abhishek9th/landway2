/**
 * Sets VITE_API_URL (the Google Apps Script CTA webhook) in every project app's
 * .env file, so a future `npm run build:projects --force` bakes the right URL
 * into the rebuilt bundles.
 *
 * The already-deployed bundles in home/public/<slug>/ were updated separately —
 * this only keeps the sources in sync.
 *
 * Usage (from the home project root):
 *   node scripts/set-cta-webhook.mjs                 # show what would change
 *   node scripts/set-cta-webhook.mjs --write         # apply
 *   node scripts/set-cta-webhook.mjs --write --url=https://...  # a different URL
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOME = resolve(__dirname, '..')
const LANDWAY_ROOT = resolve(HOME, '..')
const AMUL_ROOT = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)
const ROOT = existsSync(join(AMUL_ROOT, 'atal-vilas')) ? AMUL_ROOT : LANDWAY_ROOT

const DEFAULT_URL =
  'https://script.google.com/macros/s/AKfycbyP0I4FiBqfs1tKNmCgz7pSdgGcQBRRT3ygQtLC-01yIsSuh2CxRGI7MpVWq0LSNggm/exec'

const SLUGS = [
  'atal-vilas',
  'bhagwanti-enclave',
  'indraprastha-residency',
  'kalp-residency',
  'kishkindha-enclave',
  'lakshya-avenue',
  'landway-14',
  'manipal-avenue',
  'manipal-delight',
  'neelkanth-enclave',
  'sankalp-plaza',
  'saraswati-enclave',
  'sharda-enclave',
  'swastik-enclave',
]

const args = process.argv.slice(2)
const write = args.includes('--write')
const urlArg = args.find((a) => a.startsWith('--url='))
const URL_VALUE = urlArg ? urlArg.slice('--url='.length) : DEFAULT_URL

if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(URL_VALUE)) {
  console.error(`! refusing to write a URL that does not look like an Apps Script /exec URL:\n  ${URL_VALUE}`)
  process.exit(1)
}

const HEADER = '# Google Apps Script web-app URL for the CTA lead form.'
const LINE = /^VITE_API_URL=.*$/m

let changed = 0
let already = 0

for (const slug of SLUGS) {
  const envPath = join(ROOT, slug, '.env')
  if (!existsSync(envPath)) {
    console.warn(`! ${slug}: no .env found — skipping`)
    continue
  }

  const src = readFileSync(envPath, 'utf8')
  const current = (src.match(/^VITE_API_URL=(.*)$/m) || [])[1]

  if (current === URL_VALUE) {
    already++
    continue
  }

  const out = LINE.test(src)
    ? src.replace(LINE, `VITE_API_URL=${URL_VALUE}`)
    : `${src.trimEnd()}\n${HEADER}\nVITE_API_URL=${URL_VALUE}\n`

  console.log(`${write ? '>' : '='} ${slug}`)
  console.log(`    from: ${current ?? '(none)'}`)
  console.log(`      to: ${URL_VALUE}`)

  if (write) writeFileSync(envPath, out)
  changed++
}

if (already) console.log(`= ${already} project(s) already on this URL`)

if (!write && changed) {
  console.log(`\n${changed} file(s) would change. Re-run with --write to apply.`)
} else if (write) {
  console.log(`\nDone. ${changed} .env file(s) updated under ${ROOT}`)
} else {
  console.log('\nNothing to change.')
}
