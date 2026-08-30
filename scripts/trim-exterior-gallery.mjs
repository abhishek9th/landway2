import { readFileSync, writeFileSync, existsSync } from 'node:fs'
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

const NEXT = `export const EXTERIOR_GALLERY = [
  { label: 'Drone View', image: img('photo-1580587771525-78b9dba3b914', 1400) },
  { label: 'Elevation', image: '/section1.png' },
  { label: 'Entrance', image: img('photo-1600596542815-ffad4c1539a9', 1400) },
  { label: 'Roads', image: '/roads.png' },
]`

const re = /export const EXTERIOR_GALLERY = \[[\s\S]*?\]/

let ok = 0
for (const slug of PROJECTS) {
  const file = join(AMUL, slug, 'src/data/kalp.ts')
  if (!existsSync(file)) {
    console.warn(`! skip ${slug}`)
    continue
  }
  const src = readFileSync(file, 'utf8')
  if (!re.test(src)) {
    console.warn(`! no EXTERIOR_GALLERY in ${slug}`)
    continue
  }
  writeFileSync(file, src.replace(re, NEXT), 'utf8')
  console.log(`✓ ${slug}`)
  ok++
}
console.log(`\nTrimmed EXTERIOR_GALLERY to 4 cards in ${ok} project(s).`)
