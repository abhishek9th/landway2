import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const disclaimer =
  'All the images are computer generated and are for illustrative purposes only. Actual product, property, specifications, finishes, colors, dimensions, and features may vary.'

function balance(str) {
  const stack = []
  let inTick = false
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === '`') {
      inTick = !inTick
      continue
    }
    if (inTick) continue
    if ('({['.includes(ch)) stack.push(ch)
    if (')}]'.includes(ch)) {
      const open = stack.pop()
      const pairs = { ')': '(', '}': '{', ']': '[' }
      if (open !== pairs[ch]) return { ok: false, i, ch, open, stack: [...stack, open] }
    }
  }
  return { ok: stack.length === 0, stack }
}

const u = 'U'
const brand = 'F'
const label = 'Kalp Residency · Near Shaheed Path, Lucknow'
const core =
  '(0,' +
  u +
  '.jsx)(`div`,{className:`relative border-t border-white/10 py-6`,children:(0,' +
  u +
  '.jsxs)(`div`,{className:`shell flex flex-col gap-3 text-xs text-white/40`,children:[(0,' +
  u +
  '.jsxs)(`div`,{className:`flex flex-col items-center justify-between gap-3 sm:flex-row`,children:[(0,' +
  u +
  '.jsxs)(`span`,{children:[`© `,new Date().getFullYear(),` `,' +
  brand +
  '.developer,`. All rights reserved.`]}),(0,' +
  u +
  '.jsx)(`span`,{children:`' +
  label +
  '`})]}),(0,' +
  u +
  '.jsx)(`p`,{className:`max-w-4xl text-center leading-relaxed text-white/35 sm:text-left`,children:`' +
  disclaimer +
  '`})]})})'

console.log('core balance', balance(core))

// core should be self-contained border-t element ending with })
// Then footer needs ]})}
const withFooter = core + ']})}'
console.log('withFooter balance', balance(withFooter))

// Test in file context
const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const path = join(assets, f)
const src = readFileSync(path, 'utf8')
const startToken = 'className:`relative border-t border-white/10 py-6`'
const start = src.lastIndexOf(startToken)
const openStart = src.lastIndexOf('(0,', start)
const end = src.indexOf('function it()', start)
const next = src.slice(0, openStart) + withFooter + src.slice(end)
writeFileSync(path, next)
try {
  execSync(`node --check "${path}"`, { stdio: 'pipe' })
  console.log('FILE OK')
} catch (e) {
  console.log('FILE BAD', String(e.stderr).split('\n').filter((l) => l.includes('SyntaxError')).join(' | '))
  console.log(JSON.stringify(next.slice(next.indexOf('may vary.'), next.indexOf('may vary.') + 50)))
}
