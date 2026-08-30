import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

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

  const jsxVariants = ['U', 'm']

  for (const jsx of jsxVariants) {
    const brandingOld = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white\`,children:\`K\`}),(0,${jsx}.jsx)(\`span\`,{className:\`font-display text-xl font-extrabold\`,children:F.project})]})`
    const brandingNew = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white\`,children:\`K\`})]})`

    if (content.includes(brandingOld)) {
      content = content.replace(brandingOld, brandingNew)
      changed = true
    }
  }

  const ctaOld = /Your new address is waiting at [^`]+/g
  if (ctaOld.test(content)) {
    content = content.replace(ctaOld, 'Your new address is waiting')
    changed = true
  }

  const bottomOld = /children:\`[^`]+ · Near Shaheed Path, Lucknow\`/g
  if (bottomOld.test(content)) {
    content = content.replace(bottomOld, 'children:`Near Shaheed Path, Lucknow`')
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
