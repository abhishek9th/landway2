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

  for (const jsx of ['U', 'm']) {
    // Footer branding: K only (project name already removed)
    const kOnlyOld = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white\`,children:\`K\`})]})`
    const kOnlyNew = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`img\`,{src:\`/logo.png\`,alt:\`Landway Innovation\`,className:\`h-11 w-auto object-contain\`})]})`

    // Footer branding: K + F.project (if still present somewhere)
    const kWithNameOld = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white\`,children:\`K\`}),(0,${jsx}.jsx)(\`span\`,{className:\`font-display text-xl font-extrabold\`,children:F.project})]})`
    const kWithNameNew = `(0,${jsx}.jsxs)(\`div\`,{className:\`flex items-center gap-2.5\`,children:[(0,${jsx}.jsx)(\`img\`,{src:\`/logo.png\`,alt:\`Landway Innovation\`,className:\`h-11 w-auto object-contain\`})]})`

    // Alternate class order used on some pages
    const kAltOld = `(0,${jsx}.jsx)(\`span\`,{className:\`grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-extrabold text-white\`,children:\`K\`})`
    const kAltNew = `(0,${jsx}.jsx)(\`img\`,{src:\`/logo.png\`,alt:\`Landway Innovation\`,className:\`h-11 w-auto object-contain\`})`

    if (content.includes(kWithNameOld)) {
      content = content.replaceAll(kWithNameOld, kWithNameNew)
      changed = true
    }
    if (content.includes(kOnlyOld)) {
      content = content.replaceAll(kOnlyOld, kOnlyNew)
      changed = true
    }
    // Fallback: any remaining footer-style K badge
    if (content.includes(kAltOld)) {
      content = content.replaceAll(kAltOld, kAltNew)
      changed = true
    }
  }

  if (!changed) {
    console.log('SKIP:', slug)
    continue
  }

  fs.writeFileSync(filePath, content)
  execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
  console.log('OK:', slug)
}
