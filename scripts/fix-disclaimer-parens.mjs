import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const publicDir = 'public'
const broken = 'may vary.`})])})'
const fixed = 'may vary.`})]})'

for (const slug of readdirSync(publicDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)) {
  const assets = join(publicDir, slug, 'assets')
  let jsFile
  try {
    jsFile = readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  } catch {
    continue
  }
  if (!jsFile) continue
  const path = join(assets, jsFile)
  let src = readFileSync(path, 'utf8')
  if (!src.includes(broken)) {
    // try alternate broken patterns
    if (src.includes('may vary.`})])}')) {
      console.log(`ALT? ${slug}`)
    } else {
      console.log(`NO BROKEN ${slug}`)
    }
    try {
      execSync(`node --check "${path}"`, { stdio: 'pipe' })
      console.log(`  already ok ${slug}`)
    } catch {
      // show nearby
      const i = src.indexOf('may vary.')
      console.log('  near:', JSON.stringify(src.slice(i, i + 40)))
    }
    continue
  }
  src = src.replaceAll(broken, fixed)
  writeFileSync(path, src)
  try {
    execSync(`node --check "${path}"`, { stdio: 'pipe' })
    console.log(`FIXED OK ${slug}`)
  } catch (e) {
    console.log(`FIXED BAD ${slug}`)
    const i = src.indexOf('may vary.')
    console.log('  near:', JSON.stringify(src.slice(i, i + 40)))
  }
}
