import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const OLD_EYEBROW = 'Kalp Residency'
const NEW_EYEBROW = 'Landway Innovations'
const BHAGWATI = 'Bhagwati Enclave'

for (const slug of fs.readdirSync(publicDir)) {
  const dir = path.join(publicDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue

  const assetsDir = path.join(dir, 'assets')
  if (!fs.existsSync(assetsDir)) continue

  const jsFile = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue

  const filePath = path.join(assetsDir, jsFile)
  let content = fs.readFileSync(filePath, 'utf8')

  // The He() parallax section hardcodes the eyebrow next to "parallax-text"
  // Pattern: children:`Kalp Residency` or children:`Bhagwati Enclave` inside parallax-text block
  const markers = [
    `parallax-text relative z-10 px-6 text-center\`,children:[(0,U.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`${OLD_EYEBROW}\`})`,
    `parallax-text relative z-10 px-6 text-center\`,children:[(0,m.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`${OLD_EYEBROW}\`})`,
    `parallax-text relative z-10 px-6 text-center\`,children:[(0,U.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`${BHAGWATI}\`})`,
    `parallax-text relative z-10 px-6 text-center\`,children:[(0,m.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`${BHAGWATI}\`})`,
  ]

  let changed = false
  for (const old of markers) {
    if (!content.includes(old)) continue
    const jsx = old.includes('(0,m.jsx)') ? 'm' : 'U'
    const replacement = `parallax-text relative z-10 px-6 text-center\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`${NEW_EYEBROW}\`})`
    content = content.replace(old, replacement)
    changed = true
  }

  if (!changed) {
    console.log('SKIP:', slug)
    continue
  }

  fs.writeFileSync(filePath, content)
  execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
  console.log('OK:', slug)
}
