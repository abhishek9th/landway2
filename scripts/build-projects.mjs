/**
 * Builds each of the 14 standalone project apps into home/public/<slug>/ under
 * its own base path (/<slug>/), so the single home dev/preview server can serve
 * the landing page AND every project page from one origin — no per-project dev
 * server needed.
 *
 * The project pages reference public images with absolute paths (e.g.
 * "/section1.png"). Vite's base rewrites HTML/asset URLs but NOT string literals
 * in JS/CSS, so after each build we prefix those bare "/asset" references with
 * "/<slug>/asset". Source of the project apps is never modified.
 *
 * Usage:
 *   node scripts/build-projects.mjs           # build only what's missing
 *   node scripts/build-projects.mjs --force   # rebuild everything
 *   node scripts/build-projects.mjs <slug>... # build specific projects
 */
import { execSync } from 'node:child_process'
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOME = resolve(__dirname, '..') //            .../landway/home
const LANDWAY_ROOT = resolve(HOME, '..') //         .../landway
// Project apps live under WORKS/Amul (sibling layout may also exist under landway/).
const AMUL_ROOT = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)
const ROOT = existsSync(join(AMUL_ROOT, 'atal-vilas')) ? AMUL_ROOT : LANDWAY_ROOT
const OUT = join(HOME, 'public') //                 build target root

const ALL_SLUGS = [
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
const force = args.includes('--force')
const requested = args.filter((a) => !a.startsWith('--'))
const slugs = requested.length ? requested : ALL_SLUGS

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Walk a directory, returning all file paths matching the given extensions. */
function walk(dir, exts, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, exts, acc)
    else if (exts.some((e) => entry.name.endsWith(e))) acc.push(full)
  }
  return acc
}

/**
 * Prefix bare absolute public-asset references ("/foo.png") with "/<slug>/".
 * Only matches refs that directly follow a quote, backtick, paren, or `=` so we
 * never double-prefix an already-namespaced "/<slug>/foo.png".
 */
function rewriteAssets(outDir, slug, publicFiles) {
  if (!publicFiles.length) return
  // Longest first, so "10.jpg" is considered before "1.jpg" etc.
  const names = [...publicFiles].sort((a, b) => b.length - a.length).map(escapeRe)
  const re = new RegExp(`(["'\`(=])/(${names.join('|')})`, 'g')
  const files = walk(outDir, ['.js', '.css', '.html'])
  let touched = 0
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    const out = src.replace(re, `$1/${slug}/$2`)
    if (out !== src) {
      writeFileSync(f, out)
      touched++
    }
  }
  console.log(`  rewrote asset paths in ${touched} file(s)`)
}

let built = 0
for (const slug of slugs) {
  const projDir = join(ROOT, slug)
  const outDir = join(OUT, slug)
  if (!existsSync(projDir)) {
    console.warn(`! skipping ${slug} — folder not found`)
    continue
  }
  if (!force && existsSync(join(outDir, 'index.html'))) {
    console.log(`= ${slug} already built (use --force to rebuild)`)
    continue
  }
  if (!existsSync(join(projDir, 'node_modules'))) {
    console.log(`+ installing deps for ${slug}...`)
    execSync('npm install', { cwd: projDir, stdio: 'inherit' })
  }
  console.log(`> building ${slug}...`)
  execSync(`npx vite build --base=/${slug}/ --outDir "${outDir}" --emptyOutDir`, {
    cwd: projDir,
    stdio: 'inherit',
  })
  const publicDir = join(projDir, 'public')
  const publicFiles = existsSync(publicDir)
    ? readdirSync(publicDir, { withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => e.name)
    : []
  rewriteAssets(outDir, slug, publicFiles)
  built++
}

/**
 * Vite's --emptyOutDir wipes home/public/<slug>/ on every build and re-copies the
 * project's default images. Custom images are committed to git under home/public/,
 * so after building we restore those tracked image files from HEAD — the build can
 * never silently replace the client's real photos again.
 */
function restoreCommittedImages() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: HOME, stdio: 'pipe' })
  } catch {
    return // not a git repo — nothing to restore
  }
  const exts = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'avif']
  let restored = 0
  for (const ext of exts) {
    try {
      execSync(`git checkout HEAD -- "public/**/*.${ext}"`, { cwd: HOME, stdio: 'pipe' })
      restored++
    } catch {
      // pathspec matched nothing for this extension — ignore
    }
  }
  if (restored) console.log('  restored committed images in home/public/')
}

if (built) restoreCommittedImages()

console.log(`\nDone. ${built} project(s) built into home/public/.`)
