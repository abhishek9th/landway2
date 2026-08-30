import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const pub = 'public'
const js = (slug) => {
  const a = join(pub, slug, 'assets')
  const f = readdirSync(a).find((x) => x.startsWith('index-') && x.endsWith('.js'))
  return readFileSync(join(a, f), 'utf8')
}
const html = (slug) => readFileSync(join(pub, slug, 'index.html'), 'utf8')

const LOGO = 'src:`/logo.png`'
const slugs = readdirSync(pub, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let bad = 0
for (const slug of slugs) {
  const c = js(slug)
  const h = html(slug)
  const checks = {
    logo: c.includes(LOGO),
    disclaimer: c.includes('illustrative purposes only'),
    whyBrand: c.includes('Why Choose Landway Innovations'),
    parallaxBrand: c.includes('Landway Innovations'),
    favicon: h.includes('href="/logo.png"'),
    noOldName: slug === 'kalp-residency' || slug === 'landway-14' ? true : !c.includes('Kalp Residency'),
  }
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1]
  const ok = Object.values(checks).every(Boolean)
  if (!ok) bad++
  console.log(ok ? 'OK ' : 'BAD', slug, JSON.stringify(checks), '| title:', title)
}
console.log('\nlandway-14 Colonel Enclave in JS:', js('landway-14').includes('Colonel Enclave'))
console.log('bad:', bad)
