/**
 * Point EXTERIOR_GALLERY at each project's own local photos:
 * hero-kalp, section1, section3 (About — no section2 on disk), and 2.jpeg.
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

const NEW_BLOCK = `export const EXTERIOR_GALLERY = [
  { label: 'Hero', image: '/hero-kalp.jpeg' },
  { label: 'Elevation', image: '/section1.png' },
  { label: 'View', image: '/section3.jpg' },
  { label: 'Landscape', image: '/2.jpeg' },
]`

const RX = /export const EXTERIOR_GALLERY = \[[\s\S]*?\]/

for (const slug of SLUGS) {
  const file = join(AMUL, slug, 'src/data/kalp.ts')
  if (!existsSync(file)) {
    console.log('MISSING', slug)
    continue
  }
  let src = readFileSync(file, 'utf8')
  if (!RX.test(src)) {
    console.log('NO MATCH', slug)
    continue
  }
  src = src.replace(RX, NEW_BLOCK)
  writeFileSync(file, src, 'utf8')
  console.log('OK', slug)
}
