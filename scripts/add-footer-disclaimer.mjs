import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const disclaimer =
  'All the images are computer generated and are for illustrative purposes only. Actual product, property, specifications, finishes, colors, dimensions, and features may vary.'

const publicDir = join(process.cwd(), 'public')

const rx =
  /className:`shell flex flex-col items-center justify-between gap-3 text-xs text-white\/40 sm:flex-row`,children:\[\(0,([Um])\.jsxs\)\(`span`,\{children:\[`© `,new Date\(\)\.getFullYear\(\),` `,([FI])\.developer,`\. All rights reserved\.`\]\}\),\(0,\1\.jsx\)\(`span`,\{children:`([^`]*)`\}\)\]\}/

// Note: source may use `c ` (latin c) or `© ` depending on encoding in the bundle.
const rx2 =
  /className:`shell flex flex-col items-center justify-between gap-3 text-xs text-white\/40 sm:flex-row`,children:\[\(0,([Um])\.jsxs\)\(`span`,\{children:\[`c `,new Date\(\)\.getFullYear\(\),` `,([FI])\.developer,`\. All rights reserved\.`\]\}\),\(0,\1\.jsx\)\(`span`,\{children:`([^`]*)`\}\)\]\}/

for (const slug of readdirSync(publicDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)) {
  const assets = join(publicDir, slug, 'assets')
  let jsFile
  try {
    jsFile = readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  } catch {
    console.log(`SKIP ${slug}`)
    continue
  }
  if (!jsFile) {
    console.log(`NO JS ${slug}`)
    continue
  }
  const path = join(assets, jsFile)
  let src = readFileSync(path, 'utf8')
  if (src.includes('illustrative purposes only')) {
    console.log(`ALREADY ${slug}`)
    continue
  }

  const match = src.match(rx) || src.match(rx2)
  if (!match) {
    console.log(`NO MATCH ${slug}`)
    continue
  }

  const [full, u, brand, label] = match
  const yearToken = full.includes('`© `') ? '`© `' : '`c `'
  const replacement = `className:\`shell flex flex-col gap-3 text-xs text-white/40\`,children:[(0,${u}.jsxs)(\`div\`,{className:\`flex flex-col items-center justify-between gap-3 sm:flex-row\`,children:[(0,${u}.jsxs)(\`span\`,{children:[${yearToken},new Date().getFullYear(),\` \`,${brand}.developer,\`. All rights reserved.\`]}),(0,${u}.jsx)(\`span\`,{children:\`${label}\`})]}),(0,${u}.jsx)(\`p\`,{className:\`max-w-4xl text-center leading-relaxed text-white/35 sm:text-left\`,children:\`${disclaimer}\`})]`

  src = src.replace(full, replacement)
  writeFileSync(path, src)
  try {
    execSync(`node --check "${path}"`, { stdio: 'pipe' })
    console.log(`OK ${slug}`)
  } catch (e) {
    console.log(`BAD SYNTAX ${slug}`)
  }
}
