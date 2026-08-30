/**
 * Re-enable CTA modal auto-open on mobile (was skipped during mobile hardening).
 * Uses a slightly longer delay so the preloader can finish first.
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

const OLD = `  // Open on demand (buttons); auto-open on desktop only (skip phones).
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
  }, [])`

const NEW = `  // Open on demand (buttons) and automatically after load (all devices).
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(CTA_EVENT, show)
    // Wait past the preloader (~2s) so the modal is visible on mobile too.
    const t = setTimeout(show, 3200)
    return () => {
      window.removeEventListener(CTA_EVENT, show)
      clearTimeout(t)
    }
  }, [])`

for (const slug of SLUGS) {
  const file = join(AMUL, slug, 'src/components/CTAModal.tsx')
  if (!existsSync(file)) {
    console.log('MISSING', slug)
    continue
  }
  let src = readFileSync(file, 'utf8')
  if (!src.includes(OLD)) {
    console.log('NO MATCH', slug)
    continue
  }
  writeFileSync(file, src.replace(OLD, NEW), 'utf8')
  console.log('OK', slug)
}
