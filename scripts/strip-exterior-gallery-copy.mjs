/**
 * Strip Exterior Gallery marketing/overlay copy from all project apps.
 * Keeps the section eyebrow + image slider only.
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

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
        <SectionHeading eyebrow="Exterior Gallery" />
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
                alt={\`\${BRAND.project} exterior — \${g.label}\`}
                sizes="(max-width: 768px) 90vw, 45vw"
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

let ok = 0
for (const slug of PROJECTS) {
  const out = join(AMUL, slug, 'src/components/ExteriorGallery.tsx')
  if (!existsSync(out)) {
    console.warn(`! skip ${slug}`)
    continue
  }
  writeFileSync(out, COMPONENT, 'utf8')
  console.log(`✓ ${slug}`)
  ok++
}
console.log(`\nUpdated ${ok} ExteriorGallery component(s).`)
