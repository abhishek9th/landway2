/**
 * Ports the earlier post-build patches into the PROJECT SOURCE so they survive
 * every rebuild. Run once: node scripts/restore-branding.mjs
 *
 * Covers:
 *  - Footer: logo instead of K badge + project name; CTA without project name;
 *    bottom bar without project name; image disclaimer paragraph.
 *  - Preloader: brand logo above the project name.
 *  - WhyChooseUs eyebrow -> "Why Choose Landway Innovations".
 *  - ParallaxDivider eyebrow -> "Landway Innovations".
 *  - WindowReveal: optional eyebrow (defaults to project name); room-to-breathe hidden.
 *  - About: project name + alt use BRAND.project.
 *  - index.html: favicon -> /logo.png; titles/meta -> per-project name.
 *  - landway-14: BRAND.project + remaining copy -> "Colonel Enclave".
 *  - Mobile hardening: index.css rules, Lenis disabled on touch/small, magnetic off on touch.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const AMUL = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)

const PROJECTS = {
  'atal-vilas': 'Atal Vilas',
  'bhagwanti-enclave': 'Bhagwati Enclave',
  'indraprastha-residency': 'Indraprastha Residency',
  'kalp-residency': 'Kalp Residency',
  'kishkindha-enclave': 'Kishkindha Enclave',
  'lakshya-avenue': 'Lakshya Avenue',
  'landway-14': 'Colonel Enclave',
  'manipal-avenue': 'Manipal Avenue',
  'manipal-delight': 'Manipal Delight',
  'neelkanth-enclave': 'Neelkanth Enclave',
  'sankalp-plaza': 'Sankalp Plaza',
  'saraswati-enclave': 'Saraswati Enclave',
  'sharda-enclave': 'Sharda Enclave',
  'swastik-enclave': 'Swastik Enclave',
}

const NAMES = ['Kalp Residency', 'Bhagwati Enclave']

const DISCLAIMER =
  'All the images are computer generated and are for illustrative purposes only. Actual product, property, specifications, finishes, colors, dimensions, and features may vary.'

function edit(file, fn) {
  if (!existsSync(file)) return 'missing'
  const before = readFileSync(file, 'utf8')
  const after = fn(before)
  if (after === before) return 'nochange'
  writeFileSync(file, after, 'utf8')
  return 'ok'
}

function replaceAny(src, olds, next) {
  for (const o of olds) if (src.includes(o)) src = src.split(o).join(next)
  return src
}

/* ---------------- Footer ---------------- */
function patchFooter(src) {
  // 1. Branding -> logo
  const brandOld = `          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white">
              K
            </span>
            <span className="font-display text-xl font-extrabold">{BRAND.project}</span>
          </div>`
  const brandNew = `          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt={BRAND.developer} className="h-11 w-auto object-contain" />
          </div>`
  if (src.includes(brandOld)) src = src.replace(brandOld, brandNew)

  // 2. CTA heading without project name
  for (const n of NAMES) {
    src = src.replace(
      `Your new address is waiting at ${n}`,
      'Your new address is waiting',
    )
  }

  // 3. Bottom bar without project name
  for (const n of NAMES) {
    src = src.replace(
      `<span>${n} · Near Shaheed Path, Lucknow</span>`,
      '<span>Near Shaheed Path, Lucknow</span>',
    )
  }

  // 4. Disclaimer paragraph (idempotent)
  if (!src.includes('illustrative purposes only')) {
    src = src.replace(
      `        <div className="shell flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">`,
      `        <div className="shell flex flex-col gap-3 text-xs text-white/40">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">`,
    )
    src = src.replace(
      `          <span>Near Shaheed Path, Lucknow</span>
        </div>
      </div>
    </footer>`,
      `          <span>Near Shaheed Path, Lucknow</span>
          </div>
          <p className="max-w-4xl text-center leading-relaxed text-white/35 sm:text-left">
            ${DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>`,
    )
  }
  return src
}

/* ---------------- Preloader ---------------- */
function patchPreloader(src) {
  if (src.includes('/logo.png')) return src
  const old = `            className="flex flex-col items-center"
          >
            <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">`
  const neu = `            className="flex flex-col items-center"
          >
            <img
              src="/logo.png"
              alt={BRAND.developer}
              className="mb-5 h-14 w-auto object-contain sm:h-16"
            />
            <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">`
  return src.replace(old, neu)
}

/* ---------------- WhyChooseUs ---------------- */
function patchWhyChoose(src) {
  for (const n of NAMES) {
    src = src.replace(
      `eyebrow="Why Choose ${n}"`,
      'eyebrow="Why Choose Landway Innovations"',
    )
  }
  return src
}

/* ---------------- ParallaxDivider ---------------- */
function patchParallax(src) {
  for (const n of NAMES) {
    src = src.replace(
      `<span className="eyebrow justify-center text-white/80">${n}</span>`,
      '<span className="eyebrow justify-center text-white/80">Landway Innovations</span>',
    )
  }
  return src
}

/* ---------------- WindowReveal ---------------- */
function patchWindowReveal(src) {
  if (!src.includes("import { BRAND }")) {
    src = src.replace(
      "import { useInView } from '../lib/useInView'",
      "import { useInView } from '../lib/useInView'\nimport { BRAND } from '../data/kalp'",
    )
  }
  // Props: add eyebrow
  src = src.replace(
    `  title: string
  subtitle?: string
  /** Height of the transparent window as a CSS value (defaults to 80vh). */`,
    `  title: string
  subtitle?: string
  /** Small label above the title. Pass "" to hide. Defaults to the project name. */
  eyebrow?: string
  /** Height of the transparent window as a CSS value (defaults to 80vh). */`,
  )
  // Signature default
  src = src.replace(
    `  height = '80vh',
  tint = 0.4,
}: Props) {`,
    `  height = '80vh',
  tint = 0.4,
  eyebrow = BRAND.project,
}: Props) {`,
  )
  // Render conditional
  for (const n of NAMES) {
    src = src.replace(
      `          <span className="eyebrow justify-center text-white/80">${n}</span>`,
      `          {eyebrow && (
            <span className="eyebrow justify-center text-white/80">{eyebrow}</span>
          )}`,
    )
  }
  return src
}

/* ---------------- App (hide room-to-breathe eyebrow) ---------------- */
function patchApp(src) {
  const old = `        <WindowReveal
          image="/2.jpeg"
          title="Room To Breathe, Space To Grow"
          subtitle="Low-density, green and gated by design."
        />`
  const neu = `        <WindowReveal
          image="/2.jpeg"
          title="Room To Breathe, Space To Grow"
          subtitle="Low-density, green and gated by design."
          eyebrow=""
        />`
  if (src.includes(old)) src = src.replace(old, neu)
  return src
}

/* ---------------- About ---------------- */
function patchAbout(src) {
  if (!src.includes('ABOUT_STATS, BRAND')) {
    src = src.replace(
      "import { IMG, ABOUT_STATS } from '../data/kalp'",
      "import { IMG, ABOUT_STATS, BRAND } from '../data/kalp'",
    )
  }
  for (const n of NAMES) {
    src = src.replace(
      `              ${n} is a thoughtfully planned residential township offering`,
      '              {BRAND.project} is a thoughtfully planned residential township offering',
    )
    src = src.replace(
      `alt="Contemporary independent villa architecture at ${n}"`,
      'alt={`Contemporary independent villa architecture at ${BRAND.project}`}',
    )
  }
  return src
}

/* ---------------- lib/smooth.ts ---------------- */
function patchSmooth(src) {
  if (src.includes('(max-width: 1023px)')) return src
  return src.replace(
    `    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return`,
    `    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchOrSmall =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (reduce || isTouchOrSmall) return`,
  )
}

/* ---------------- MagneticButton.tsx ---------------- */
function patchMagnetic(src) {
  if (src.includes("(hover: none)")) return src
  return src.replace(
    `  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return`,
    `  const move = (e: MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return`,
  )
}

/* ---------------- index.css ---------------- */
const MOBILE_CSS = `
/* === mobile responsive hardening === */
html,
body {
  overflow-x: hidden;
  max-width: 100%;
  overscroll-behavior-x: none;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
#root,
main,
footer,
header,
section {
  max-width: 100%;
  overflow-x: clip;
}
img,
video,
iframe,
canvas,
svg {
  max-width: 100%;
}
button,
a,
[role='button'] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
@media (max-width: 767px) {
  html {
    scroll-padding-top: 72px;
  }
  input,
  textarea,
  select {
    font-size: 16px !important;
  }
  h1,
  h2,
  .h-display {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}
@media (hover: none) and (pointer: coarse) {
  .group:hover {
    transform: none;
  }
}
`
function patchCss(src) {
  if (src.includes('mobile responsive hardening')) return src
  return src + '\n' + MOBILE_CSS
}

/* ---------------- index.html ---------------- */
function patchHtml(src, displayName) {
  src = src.replace(
    /<link rel="icon"[^>]*>/i,
    '<link rel="icon" type="image/png" href="/logo.png" />',
  )
  for (const n of NAMES) src = src.split(n).join(displayName)
  return src
}

/* ---------------- run ---------------- */
const results = []
for (const [slug, displayName] of Object.entries(PROJECTS)) {
  const root = join(AMUL, slug)
  const c = (p) => join(root, 'src/components', p)
  const r = {
    slug,
    footer: edit(c('Footer.tsx'), patchFooter),
    preloader: edit(c('Preloader.tsx'), patchPreloader),
    why: edit(c('WhyChooseUs.tsx'), patchWhyChoose),
    parallax: edit(c('ParallaxDivider.tsx'), patchParallax),
    window: edit(c('WindowReveal.tsx'), patchWindowReveal),
    app: edit(join(root, 'src/App.tsx'), patchApp),
    about: edit(c('About.tsx'), patchAbout),
    smooth: edit(join(root, 'src/lib/smooth.ts'), patchSmooth),
    magnetic: edit(c('MagneticButton.tsx'), patchMagnetic),
    css: edit(join(root, 'src/index.css'), patchCss),
    html: edit(join(root, 'index.html'), (s) => patchHtml(s, displayName)),
  }

  if (slug === 'landway-14') {
    // Colonel Enclave: fix data project + any leftover copy
    r.data = edit(join(root, 'src/data/kalp.ts'), (s) =>
      s.split('Kalp Residency').join('Colonel Enclave'),
    )
    for (const f of [
      'src/components/Preloader.tsx',
      'src/components/Hero.tsx',
      'src/components/CTAModal.tsx',
    ]) {
      edit(join(root, f), (s) =>
        s.split('Kalp Residency').join('Colonel Enclave').split('Landway 14').join('Colonel Enclave'),
      )
    }
  }

  results.push(r)
}

for (const r of results) console.log(JSON.stringify(r))
console.log('\nDone porting branding into source.')
