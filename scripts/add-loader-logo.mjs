import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const LOGO_IMG = (jsx) =>
  `(0,${jsx}.jsx)(\`img\`,{src:\`/logo.png\`,alt:\`Landway Innovation\`,className:\`mb-5 h-14 w-auto object-contain sm:h-16\`})`

for (const slug of fs.readdirSync(publicDir)) {
  const dir = path.join(publicDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue

  const assetsDir = path.join(dir, 'assets')
  if (!fs.existsSync(assetsDir)) continue

  const jsFile = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue

  const filePath = path.join(assetsDir, jsFile)
  let content = fs.readFileSync(filePath, 'utf8')
  const jsx = content.includes('(0,m.jsx)') && !content.includes('(0,U.jsx)') ? 'm' : content.includes('(0,m.jsx)(`span`,{className:`h-9 w-9') ? 'm' : 'U'
  let changed = false

  // Colonel / landway-14 style: K badge beside project name
  const kBadgePatterns = ['U', 'm'].flatMap((j) => [
    {
      old: `(0,${j}.jsxs)(\`div\`,{className:\`flex items-center gap-3\`,children:[(0,${j}.jsx)(\`span\`,{className:\`h-9 w-9 rounded-lg bg-accent grid place-items-center font-display font-extrabold text-white\`,children:\`K\`}),(0,${j}.jsx)(\`span\`,{className:\`font-display text-2xl font-extrabold tracking-tight\`,children:\`Colonel Enclave\`})]})`,
      new: `(0,${j}.jsxs)(\`div\`,{className:\`flex flex-col items-center\`,children:[${LOGO_IMG(j)},(0,${j}.jsx)(\`span\`,{className:\`font-display text-2xl font-extrabold tracking-tight\`,children:\`Colonel Enclave\`})]})`,
    },
    // generic: any project name after K badge in loader
    {
      old: `(0,${j}.jsx)(\`span\`,{className:\`h-9 w-9 rounded-lg bg-accent grid place-items-center font-display font-extrabold text-white\`,children:\`K\`}),(0,${j}.jsx)(\`span\`,{className:\`font-display text-2xl font-extrabold tracking-tight\``,
      new: `${LOGO_IMG(j)},(0,${j}.jsx)(\`span\`,{className:\`font-display text-2xl font-extrabold tracking-tight\``,
    },
  ])

  for (const { old, new: neu } of kBadgePatterns) {
    if (content.includes(old)) {
      content = content.replace(old, neu)
      changed = true
    }
  }

  // Standard loader: project name + by developer — insert logo above
  for (const j of ['U', 'm']) {
    const standardOld = `className:\`flex flex-col items-center\`,children:[(0,${j}.jsx)(\`span\`,{className:\`font-display text-3xl font-extrabold tracking-tight sm:text-4xl\`,children:F.project})`
    const standardNew = `className:\`flex flex-col items-center\`,children:[${LOGO_IMG(j)},(0,${j}.jsx)(\`span\`,{className:\`font-display text-3xl font-extrabold tracking-tight sm:text-4xl\`,children:F.project})`

    // Avoid double-inserting
    if (content.includes(standardOld) && !content.includes(`${LOGO_IMG(j)},(0,${j}.jsx)(\`span\`,{className:\`font-display text-3xl`)) {
      content = content.replace(standardOld, standardNew)
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
