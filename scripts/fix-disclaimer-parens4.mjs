import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const publicDir = 'public'
const broken = 'may vary.`})]})]})}`}'
const fixed = 'may vary.`})]})]})]})}`'

for (const slug of readdirSync(publicDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)) {
  const assets = join(publicDir, slug, 'assets')
  const jsFile = readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue
  const path = join(assets, jsFile)
  let src = readFileSync(path, 'utf8')
  if (!src.includes(broken)) {
    const i = src.indexOf('may vary.`')
    console.log(`MISS ${slug}`, JSON.stringify(src.slice(i, i + 40)))
    continue
  }
  src = src.replaceAll(broken, fixed)
  writeFileSync(path, src)
  try {
    execSync(`node --check "${path}"`, { stdio: 'pipe' })
    console.log(`OK ${slug}`)
  } catch {
    console.log(`BAD ${slug}`, JSON.stringify(src.slice(src.indexOf('may vary.`'), src.indexOf('may vary.`') + 45)))
  }
}
