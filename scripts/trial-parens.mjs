import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const path = join(assets, f)
const src = readFileSync(path, 'utf8')
const start = src.indexOf('may vary.`')
const end = src.indexOf('function it()', start)
console.log('SEGMENT', JSON.stringify(src.slice(start, end)))

const prefix = src.slice(0, start)
const suffix = src.slice(end)
const trials = [
  '})]})]})}`',
  '})]})]})]})}`',
  '})]})]`',
  '})]})]})]`',
  '})]})]})}`',
  '})]})]})]})]`',
  '})]})]})]})}`',
]

for (const t of trials) {
  const next = prefix + 'may vary.`' + t + suffix
  const trialPath = path + '.trial.js'
  writeFileSync(trialPath, next)
  try {
    execSync(`node --check "${trialPath}"`, { stdio: 'pipe' })
    console.log('VALID:', JSON.stringify('may vary.`' + t))
  } catch {
    console.log('invalid:', JSON.stringify('may vary.`' + t))
  }
}
