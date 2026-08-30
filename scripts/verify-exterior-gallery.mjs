import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

let ok = 0
let bad = 0
for (const d of readdirSync('public', { withFileTypes: true }).filter((x) => x.isDirectory())) {
  const html = readFileSync(join('public', d.name, 'index.html'), 'utf8')
  const m = html.match(/assets\/(index-[^"]+\.js)/)
  if (!m) continue
  const c = readFileSync(join('public', d.name, 'assets', m[1]), 'utf8')
  const hasNight = c.includes('Night View')
  const hasLand = c.includes('Landscape') && c.includes('photo-1416331108676')
  const hasGall = c.includes('Exterior Gallery')
  if (!hasGall) {
    console.log('NO GALLERY', d.name)
    continue
  }
  if (hasNight || hasLand) {
    bad++
    console.log('BAD', d.name)
  } else {
    ok++
  }
}
console.log({ ok, bad })
