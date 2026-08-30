import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(__dirname, '../public')

const badge = 'rounded-lg bg-accent grid place-items-center'

for (const slug of fs.readdirSync(pub).sort()) {
  const assets = path.join(pub, slug, 'assets')
  if (!fs.existsSync(assets)) continue
  const js = fs.readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!js) continue
  const s = fs.readFileSync(path.join(assets, js), 'utf8')
  let i = -1
  let n = 0
  while ((i = s.indexOf(badge, i + 1)) !== -1) {
    n++
    console.log(slug, 'badge', n, JSON.stringify(s.slice(i - 60, i + 180)))
  }
}
