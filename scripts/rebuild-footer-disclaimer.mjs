import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const disclaimer =
  'All the images are computer generated and are for illustrative purposes only. Actual product, property, specifications, finishes, colors, dimensions, and features may vary.'

const publicDir = 'public'

for (const slug of readdirSync(publicDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)) {
  const assets = join(publicDir, slug, 'assets')
  const jsFile = readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue
  const path = join(assets, jsFile)
  let src = readFileSync(path, 'utf8')

  const startToken = 'className:`relative border-t border-white/10 py-6`'
  const start = src.lastIndexOf(startToken)
  if (start < 0) {
    console.log(`NO START ${slug}`)
    continue
  }

  const openStart = src.lastIndexOf('(0,', start)
  const end = src.indexOf('function it()', start)
  if (openStart < 0 || end < 0) {
    console.log(`BOUNDS FAIL ${slug}`)
    continue
  }

  const oldBlock = src.slice(openStart, end)
  const u = oldBlock.startsWith('(0,m.') ? 'm' : 'U'
  const brand = u === 'm' ? 'I' : 'F'
  const labelMatch = oldBlock.match(/children:`([^`]*Near Shaheed Path[^`]*)`/)
  const label = labelMatch
    ? labelMatch[1]
    : 'Landway Innovation · Near Shaheed Path, Lucknow'

  const good =
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
    '`})]})})]})}'

  src = src.slice(0, openStart) + good + src.slice(end)
  writeFileSync(path, src)
  try {
    execSync(`node --check "${path}"`, { stdio: 'pipe' })
    console.log(`OK ${slug}`)
  } catch {
    console.log(`BAD ${slug}`)
  }
}
