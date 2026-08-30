/**
 * Adds ExteriorGallery to all 14 Amul project apps (below Floor Plans).
 * Run once: node scripts/add-exterior-gallery.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AMUL = resolve(
  process.env.USERPROFILE || process.env.HOME || '',
  'Desktop/Content/WORKS/Amul',
)

const PROJECTS = [
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

const COMPONENT = `import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import SectionHeading from './SectionHeading'
import Img from './Img'
import { BRAND, EXTERIOR_GALLERY } from '../data/kalp'

export default function ExteriorGallery() {
  return (
    <section id="exterior-gallery" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Exterior Gallery"
          title="Drone views, elevations & landscapes"
          subtitle="Glide through the township — from wide roads and entrances to golden-hour skylines."
        />
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        speed={800}
        autoplay={{ delay: 3800, disableOnInteraction: false }}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 120, modifier: 2, slideShadows: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: '.ext-prev', nextEl: '.ext-next' }}
        breakpoints={{
          0: { slidesPerView: 1.1, spaceBetween: 16 },
          768: { slidesPerView: 1.8, spaceBetween: 24 },
          1200: { slidesPerView: 2.2, spaceBetween: 32 },
        }}
        className="!px-6 !pb-16"
      >
        {EXTERIOR_GALLERY.map((g) => (
          <SwiperSlide key={g.label} className="!h-auto">
            <div className="group relative overflow-hidden rounded-xl3 shadow-lift">
              <Img
                src={g.image}
                alt={\`\${g.label} — \${BRAND.project}\`}
                sizes="(max-width: 768px) 90vw, 45vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="eyebrow text-white/70">{BRAND.project}</span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">{g.label}</h3>
              </div>
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

function patchApp(src, slug) {
  let out = src

  if (!out.includes("import ExteriorGallery from './components/ExteriorGallery'")) {
    out = out.replace(
      "import FloorPlans from './components/FloorPlans'\n",
      "import FloorPlans from './components/FloorPlans'\nimport ExteriorGallery from './components/ExteriorGallery'\n",
    )
  }

  // Place Exterior Gallery directly below Floor Plans
  if (!out.includes('<ExteriorGallery />')) {
    if (out.includes('{/* 6 */} <FloorPlans />')) {
      out = out.replace(
        '{/* 6 */} <FloorPlans />',
        '{/* 6 */} <FloorPlans />\n        {/* 7 */} <ExteriorGallery />',
      )
    } else if (out.includes('<FloorPlans />')) {
      out = out.replace('<FloorPlans />', '<FloorPlans />\n        <ExteriorGallery />')
    } else if (slug === 'swastik-enclave' && out.includes('<MasterPlan />')) {
      // Swastik may have floor plans removed — still add gallery after master plan
      out = out.replace(
        '<MasterPlan />',
        '<MasterPlan />\n        <ExteriorGallery />',
      )
      if (!out.includes("import ExteriorGallery")) {
        out = out.replace(
          "import MasterPlan from './components/MasterPlan'\n",
          "import MasterPlan from './components/MasterPlan'\nimport ExteriorGallery from './components/ExteriorGallery'\n",
        )
      }
    }
  }

  return out
}

function patchNav(src) {
  if (src.includes("href: '#exterior-gallery'")) return src
  return src.replace(
    "  { label: 'Master Plan', href: '#master-plan' },\n  { label: 'Amenities', href: '#amenities' },",
    "  { label: 'Master Plan', href: '#master-plan' },\n  { label: 'Gallery', href: '#exterior-gallery' },\n  { label: 'Amenities', href: '#amenities' },",
  )
}

let ok = 0
for (const slug of PROJECTS) {
  const proj = join(AMUL, slug)
  if (!existsSync(proj)) {
    console.warn(`! skip ${slug} — not found`)
    continue
  }

  writeFileSync(join(proj, 'src/components/ExteriorGallery.tsx'), COMPONENT, 'utf8')

  const appPath = join(proj, 'src/App.tsx')
  writeFileSync(appPath, patchApp(readFileSync(appPath, 'utf8'), slug), 'utf8')

  const dataPath = join(proj, 'src/data/kalp.ts')
  writeFileSync(dataPath, patchNav(readFileSync(dataPath, 'utf8')), 'utf8')

  console.log(`✓ ${slug}`)
  ok++
}

console.log(`\nDone. Updated ${ok} project(s).`)
