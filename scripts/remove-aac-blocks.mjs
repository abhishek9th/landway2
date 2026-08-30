import { readFileSync, writeFileSync } from 'node:fs'
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

const LINE =
  "  { title: 'AAC Blocks', desc: 'Lightweight, thermal-efficient blocks for cooler, stronger walls.' },\n"

for (const slug of SLUGS) {
  const file = join(AMUL, slug, 'src/data/kalp.ts')
  let src = readFileSync(file, 'utf8')
  if (!src.includes(LINE)) {
    console.log('NO', slug)
    continue
  }
  writeFileSync(file, src.replace(LINE, ''), 'utf8')
  console.log('OK', slug)
}
