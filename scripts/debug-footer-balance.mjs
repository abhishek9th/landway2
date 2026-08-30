import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const path = join(assets, f)
const src = readFileSync(path, 'utf8')

const start = src.lastIndexOf('className:`relative border-t border-white/10 py-6`')
console.log('BEFORE:', src.slice(start - 80, start))
console.log('---')
const end = src.indexOf('function it()', start)
console.log('BLOCK:', src.slice(start - 20, end + 15))

// Proper bracket balance from start of (0,U.jsx) border-t through end
const openStart = src.lastIndexOf('(0,', start)
const block = src.slice(openStart, end)
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
    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch)
    if (ch === ')' || ch === '}' || ch === ']') {
      const open = stack.pop()
      const ok =
        (ch === ')' && open === '(') ||
        (ch === '}' && open === '{') ||
        (ch === ']' && open === '[')
      if (!ok) return { ok: false, at: i, stack, ch, open }
    }
  }
  return { ok: stack.length === 0, stack }
}
console.log('balance block alone', balance(block))

// Try endings
const head = src.slice(0, openStart)
const tail = src.slice(end)
const disclaimer =
  'All the images are computer generated and are for illustrative purposes only. Actual product, property, specifications, finishes, colors, dimensions, and features may vary.'
const u = 'U'
const brand = 'F'
const label = 'Kalp Residency · Near Shaheed Path, Lucknow'
const base =
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
  '`)'

const ends = [
  '})]})]})}', // shell] shell) border) footer] footer) fn}
  '})]})]})]',
  '})]})]})]})}',
  '})]})]',
  '})]})]})}',
  '})]})]})]})}',
  '})]})]})}',
]

for (const e of [...new Set(ends)]) {
  const candidate = base + e
  const b = balance(candidate)
  const next = head + candidate + tail
  writeFileSync(path + '.trial.js', next)
  let syntax = false
  try {
    execSync(`node --check "${path}.trial.js"`, { stdio: 'pipe' })
    syntax = true
  } catch {}
  console.log(JSON.stringify(e), 'bal', b.ok, 'stack', b.stack, 'syntax', syntax)
}
