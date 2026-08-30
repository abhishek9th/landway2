import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const NEW_HEADING = 'Why Choose Landway Innovations'
const REPLACEMENTS = [
  'Why Choose Kalp Residency',
  'Why Choose Bhagwati Enclave',
]

for (const slug of fs.readdirSync(publicDir)) {
  const dir = path.join(publicDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue

  const assetsDir = path.join(dir, 'assets')
  if (!fs.existsSync(assetsDir)) continue

  const jsFile = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue

  const filePath = path.join(assetsDir, jsFile)
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false

  for (const old of REPLACEMENTS) {
    if (content.includes(old)) {
      content = content.replaceAll(old, NEW_HEADING)
      changed = true
    }
  }

  if (!changed) {
    const match = content.match(/Why Choose [^`]+/)
    console.log('SKIP:', slug, match ? `(has "${match[0]}")` : '(no heading)')
    continue
  }

  fs.writeFileSync(filePath, content)
  execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
  console.log('OK:', slug)
}
