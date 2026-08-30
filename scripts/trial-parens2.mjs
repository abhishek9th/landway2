import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const path = join(assets, f)
let src = readFileSync(path, 'utf8')

const start = src.indexOf('function rt()')
const end = src.indexOf('function it()', start)
const fn = src.slice(start, end)
console.log('rt length', fn.length)

// Balance scan
let depth = 0
let inTick = false
for (let i = 0; i < fn.length; i++) {
  const ch = fn[i]
  if (ch === '`') {
    inTick = !inTick
    continue
  }
  if (inTick) continue
  if (ch === '(' || ch === '{' || ch === '[') depth++
  if (ch === ')' || ch === '}' || ch === ']') depth--
}
console.log('final depth', depth)
console.log('tail', JSON.stringify(fn.slice(-80)))

// Try fixing by replacing the broken tail after disclaimer
const marker = 'may vary.`'
const mi = src.indexOf(marker)
const afterDisclaimer = src.indexOf('function it()', mi)
const head = src.slice(0, mi + marker.length)

// Needed close sequence after disclaimer string closes with `
// From dump structure analysis - try generating with balance

const trials = []
// Generate combinations of 5-8 closing tokens
const tokens = ['})', ']', '})', '})', ']', '})', '}']
// Also try without border-t extra
const options = [
  '})]})]})}`',
  '})]})]})}`',
  '})]})]})]})}`',
  '})]})]})]})}`',
  '})]})]})]})]})}`',
  '})]})]`',
  '})]})]})]`',
]

for (const t of options) {
  const next = head + t + 'function it()' + src.slice(afterDisclaimer + 'function it()'.length)
  writeFileSync(path + '.trial.js', next)
  try {
    execSync(`node --check "${path}.trial.js"`, { stdio: 'pipe' })
    console.log('VALID', JSON.stringify(t))
  } catch {
    console.log('no', JSON.stringify(t))
  }
}
