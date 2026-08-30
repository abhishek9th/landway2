/**
 * Move "Room To Breathe" WindowReveal below WhyChooseUs on all project pages.
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

const OLD = `        {/* 8 */} <Amenities />
        {/* Window reveal — fixed image seen through a transparent gap */}
        <WindowReveal
          image="/2.jpeg"
          title="Room To Breathe, Space To Grow"
          subtitle="Low-density, green and gated by design."
          eyebrow=""
        />
        {/* 11 */} <WhyChooseUs />`

const NEW = `        {/* 8 */} <Amenities />
        {/* 11 */} <WhyChooseUs />
        {/* Window reveal — fixed image seen through a transparent gap */}
        <WindowReveal
          image="/2.jpeg"
          title="Room To Breathe, Space To Grow"
          subtitle="Low-density, green and gated by design."
          eyebrow=""
        />`

for (const slug of SLUGS) {
  const file = join(AMUL, slug, 'src/App.tsx')
  if (!existsSync(file)) {
    console.log('MISSING', slug)
    continue
  }
  let src = readFileSync(file, 'utf8')
  if (!src.includes(OLD)) {
    // Already moved?
    if (
      src.includes('<WhyChooseUs />') &&
      src.indexOf('<WhyChooseUs />') < src.indexOf('Room To Breathe, Space To Grow')
    ) {
      console.log('ALREADY', slug)
      continue
    }
    console.log('NO MATCH', slug)
    continue
  }
  writeFileSync(file, src.replace(OLD, NEW), 'utf8')
  console.log('OK', slug)
}
