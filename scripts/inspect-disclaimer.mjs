import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const p = join(
  'public/kalp-residency/assets',
  readdirSync('public/kalp-residency/assets').find((f) => f.startsWith('index-')),
)
const c = readFileSync(p, 'utf8')
const i = c.indexOf('illustrative purposes only')
console.log('has disclaimer', i >= 0)
console.log(JSON.stringify(c.slice(Math.max(0, i - 300), i + 150)))
try {
  execSync(`node --check "${p}"`, { encoding: 'utf8' })
  console.log('syntax ok')
} catch (e) {
  console.log(String(e.stderr || e.message).slice(-800))
}
