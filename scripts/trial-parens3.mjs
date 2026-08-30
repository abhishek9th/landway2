import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const path = join(assets, f)
const src = readFileSync(path, 'utf8')
const marker = 'may vary.`'
const mi = src.indexOf(marker)
const after = src.indexOf('function it()', mi)
const head = src.slice(0, mi + marker.length)
const tail = src.slice(after)

const options = [
  '})]})]})}`',
  '})]})]})]`',
  '})]})]})}`',
  '})]})]`',
  '})]})]})}`',
  '})]})]})]})}`',
  '})]})]})}`',
  '})]})]})]})]`',
  '})]})]})]})}`',
  '})]})]})]})]})}`',
  '})]})]})]})}`',
  '})]})]})}`',
]

// unique
const uniq = [...new Set(options)]
for (const t of uniq) {
  const next = head + t + tail
  writeFileSync(path + '.trial.js', next)
  try {
    execSync(`node --check "${path}.trial.js"`, { stdio: 'pipe' })
    console.log('VALID', t)
  } catch (e) {
    const err = String(e.stderr || '')
    const line = err.split('\n').find((l) => l.includes('SyntaxError')) || 'fail'
    console.log('no', t, '->', line.trim())
  }
}
