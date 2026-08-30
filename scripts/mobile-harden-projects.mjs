/**
 * Mobile-responsive hardening for all 14 project apps (source-level).
 * Run: node scripts/mobile-harden-projects.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const AMUL = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)

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

function edit(file, fn) {
  if (!existsSync(file)) return 'missing'
  const before = readFileSync(file, 'utf8')
  const after = fn(before)
  if (after === before) return 'nochange'
  writeFileSync(file, after, 'utf8')
  return 'ok'
}

/* ---------- Navbar ---------- */
function patchNavbar(src) {
  // Scroll lock when drawer open
  if (!src.includes('document.body.style.overflow = open')) {
    src = src.replace(
      `  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])`,
      `  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])`,
    )
  }

  // Larger tap targets
  src = src.replace(
    'className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${',
    'className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${',
  )
  src = src.replace(
    'className="ml-auto grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bg"',
    'className="ml-auto grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-bg"',
  )

  // Show Call Now on mobile too (compact)
  src = src.replace(
    `className={\`hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 sm:inline-flex \${`,
    `className={\`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-500 sm:px-5 sm:py-2.5 \${`,
  )
  // Hide "Call Now" text on very small, keep icon — use span
  if (src.includes('<FiPhone className="h-4 w-4" /> Call Now') && !src.includes('max-sm:sr-only')) {
    src = src.replace(
      '<FiPhone className="h-4 w-4" /> Call Now',
      '<FiPhone className="h-4 w-4" /> <span className="max-sm:hidden">Call Now</span>',
    )
  }

  // Logo slightly smaller on mobile when not solid
  src = src.replace(
    "solid ? 'h-11' : 'h-14 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]'",
    "solid ? 'h-9 sm:h-11' : 'h-11 sm:h-14 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]'",
  )

  return src
}

/* ---------- FloatingButtons ---------- */
function patchFloating(src) {
  return src.replace(
    'className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-3 sm:bottom-5 sm:right-5"',
    'className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex flex-col items-center gap-3"',
  )
}

/* ---------- CTAModal ---------- */
function patchCta(src) {
  // Skip auto-open on mobile / touch
  src = src.replace(
    `  // Open on demand (buttons) and automatically ~2.5s after every page load.
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(CTA_EVENT, show)
    const t = setTimeout(show, 2500)
    return () => {
      window.removeEventListener(CTA_EVENT, show)
      clearTimeout(t)
    }
  }, [])`,
    `  // Open on demand (buttons); auto-open on desktop only (skip phones).
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(CTA_EVENT, show)
    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const t = isMobile ? null : setTimeout(show, 2500)
    return () => {
      window.removeEventListener(CTA_EVENT, show)
      if (t) clearTimeout(t)
    }
  }, [])`,
  )

  // Top bar safe area
  src = src.replace(
    'className="relative flex items-center justify-between px-6 py-5 sm:px-10"',
    'className="relative flex items-center justify-between px-6 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-10"',
  )

  // Toast wrapping
  src = src.replace(
    `className={\`fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-3 rounded-full px-5 py-3.5 text-sm font-medium shadow-lift \${
                  toast.type === 'success'
                    ? 'bg-white text-ink'
                    : 'bg-accent text-white'
                }\`}`,
    `className={\`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[110] flex max-w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 items-start gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-lift \${
                  toast.type === 'success'
                    ? 'bg-white text-ink'
                    : 'bg-accent text-white'
                }\`}`,
  )

  return src
}

/* ---------- FloorPlans ---------- */
function patchFloorPlans(src) {
  return src.replace(
    'className="absolute inset-0 m-auto grid h-14 w-14 translate-y-3 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-lift transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"',
    'className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/95 text-ink shadow-lift transition-all duration-500 opacity-100 translate-y-0 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"',
  )
}

/* ---------- About ---------- */
function patchAbout(src) {
  return src.replace(
    'className="absolute -left-2 bottom-4 rounded-2xl bg-ink px-4 py-4 text-white shadow-lift sm:-left-8 sm:bottom-8 sm:px-6 sm:py-5"',
    'className="absolute left-3 bottom-4 rounded-2xl bg-ink px-4 py-4 text-white shadow-lift sm:-left-8 sm:bottom-8 sm:px-6 sm:py-5"',
  )
}

/* ---------- Testimonials ---------- */
function patchTestimonials(src) {
  return src.replace(
    `<figcaption className="mt-8 flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/20"
                  />
                  <div>
                    <div className="font-display font-bold text-ink">{t.name}</div>
                    <div className="text-sm text-muted">{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-accent">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                </figcaption>`,
    `<figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-accent/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold text-ink">{t.name}</div>
                    <div className="text-sm text-muted">{t.role}</div>
                  </div>
                  <div className="flex w-full gap-0.5 text-accent sm:ml-auto sm:w-auto">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                </figcaption>`,
  )
}

/* ---------- MasterPlan ---------- */
function patchMasterPlan(src) {
  // Stateful active hotspot + tap support
  if (!src.includes('const [activeHotspot')) {
    src = src.replace(
      `export default function MasterPlan() {
  const [full, setFull] = useState(false)`,
      `export default function MasterPlan() {
  const [full, setFull] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)`,
    )
  }

  src = src.replace(
    `subtitle="Hover the markers to explore roads, entry points, commercial zones and green areas."`,
    `subtitle="Tap or hover the markers to explore roads, entry points, commercial zones and green areas."`,
  )

  src = src.replace(
    `{HOTSPOTS.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 260 }}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: \`\${h.x}%\`, top: \`\${h.y}%\` }}
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-accent shadow-md" />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lift transition-all duration-300 group-hover:top-7 group-hover:opacity-100">
            {h.label}
          </span>
        </motion.div>
      ))}`,
    `{HOTSPOTS.map((h, i) => (
        <motion.button
          type="button"
          key={h.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 260 }}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: \`\${h.x}%\`, top: \`\${h.y}%\` }}
          aria-label={h.label}
          onClick={() => setActiveHotspot((cur) => (cur === h.label ? null : h.label))}
        >
          <span className="relative flex h-5 w-5 sm:h-4 sm:w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-5 w-5 rounded-full border-2 border-white bg-accent shadow-md sm:h-4 sm:w-4" />
          </span>
          <span
            className={\`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-lift transition-all duration-300 group-hover:top-7 group-hover:opacity-100 \${
              activeHotspot === h.label ? 'top-7 opacity-100' : 'opacity-0'
            }\`}
          >
            {h.label}
          </span>
        </motion.button>
      ))}`,
  )

  // Backdrop close + object-contain in fullscreen
  src = src.replace(
    `className={\`w-full object-cover \${fullscreen ? 'h-full' : 'aspect-[16/10]'}\`}`,
    `className={\`w-full \${fullscreen ? 'h-full object-contain' : 'aspect-[16/10] object-cover'}\`}`,
  )

  src = src.replace(
    `className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
          >
            <button
              onClick={() => setFull(false)}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >`,
    `className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
            onClick={() => setFull(false)}
          >
            <button
              onClick={() => setFull(false)}
              aria-label="Close"
              className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >`,
  )

  src = src.replace(
    `className="h-full max-h-[85vh] w-full max-w-6xl"
            >
              <Plan fullscreen />`,
    `className="h-full max-h-[85vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Plan fullscreen />`,
  )

  return src
}

/* ---------- ExteriorGallery ---------- */
const EXTERIOR_GALLERY_SRC = `import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import SectionHeading from './SectionHeading'
import Img from './Img'
import { BRAND, EXTERIOR_GALLERY } from '../data/kalp'

export default function ExteriorGallery() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <section id="exterior-gallery" className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="shell">
        <SectionHeading eyebrow="Exterior Gallery" />
      </div>

      <Swiper
        key={isMobile ? 'mobile' : 'desktop'}
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect={isMobile ? 'slide' : 'coverflow'}
        grabCursor
        centeredSlides
        loop
        speed={800}
        autoplay={{ delay: 3800, disableOnInteraction: false }}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 120, modifier: 2, slideShadows: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: '.ext-prev', nextEl: '.ext-next' }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          768: { slidesPerView: 1.8, spaceBetween: 24 },
          1200: { slidesPerView: 2.2, spaceBetween: 32 },
        }}
        className="!px-4 !pb-14 sm:!px-6 sm:!pb-16"
      >
        {EXTERIOR_GALLERY.map((g) => (
          <SwiperSlide key={g.label} className="!h-auto">
            <div className="group relative overflow-hidden rounded-xl2 shadow-lift sm:rounded-xl3">
              <Img
                src={g.image}
                alt={\`\${BRAND.project} exterior — \${g.label}\`}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shell flex justify-center gap-3">
        <button
          className="ext-prev grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition hover:bg-ink hover:text-white"
          aria-label="Previous"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <button
          className="ext-next grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition hover:bg-ink hover:text-white"
          aria-label="Next"
        >
          <FiArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
`

/* ---------- index.css extras ---------- */
function patchCss(src) {
  const extras = `
/* === mobile layout polish === */
.shell {
  width: 100%;
  box-sizing: border-box;
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
@media (max-width: 639px) {
  .btn,
  .btn-primary,
  .btn-dark,
  .btn-ghost,
  .btn-white {
    width: 100%;
    max-width: 100%;
    justify-content: center;
    min-height: 48px;
    box-sizing: border-box;
  }
}
`

  if (src.includes('mobile layout polish')) return src
  return src + '\n' + extras
}

/* ---------- index.html viewport ---------- */
function patchHtml(src) {
  return src.replace(
    'content="width=device-width, initial-scale=1.0"',
    'content="width=device-width, initial-scale=1.0, viewport-fit=cover"',
  )
}

/* ---------- WindowReveal ---------- */
function patchWindowReveal(src) {
  return src.replace(
    'style={{ height, minHeight: 480 }}',
    "style={{ height, minHeight: undefined }} className={`relative flex items-center justify-center overflow-hidden min-h-[56vh] sm:min-h-[480px]`}",
  ).replace(
    `className="relative flex items-center justify-center overflow-hidden"
        style={{ height, minHeight: undefined }} className={\`relative flex items-center justify-center overflow-hidden min-h-[56vh] sm:min-h-[480px]\`}`,
    `className="relative flex min-h-[56vh] items-center justify-center overflow-hidden sm:min-h-[480px]"
        style={{ height }}`,
  )
}

for (const slug of SLUGS) {
  const root = join(AMUL, slug)
  const c = (name) => join(root, 'src/components', name)
  const r = {
    navbar: edit(c('Navbar.tsx'), patchNavbar),
    floating: edit(c('FloatingButtons.tsx'), patchFloating),
    cta: edit(c('CTAModal.tsx'), patchCta),
    floor: edit(c('FloorPlans.tsx'), patchFloorPlans),
    about: edit(c('About.tsx'), patchAbout),
    testimonials: edit(c('Testimonials.tsx'), patchTestimonials),
    master: edit(c('MasterPlan.tsx'), patchMasterPlan),
    exterior: (() => {
      const f = c('ExteriorGallery.tsx')
      if (!existsSync(f)) return 'missing'
      writeFileSync(f, EXTERIOR_GALLERY_SRC, 'utf8')
      return 'ok'
    })(),
    window: edit(c('WindowReveal.tsx'), patchWindowReveal),
    css: edit(join(root, 'src/index.css'), patchCss),
    html: edit(join(root, 'index.html'), patchHtml),
  }
  console.log(slug, JSON.stringify(r))
}

console.log('Done.')
