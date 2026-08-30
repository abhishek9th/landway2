import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const ROOM_TITLE = 'Room To Breathe, Space To Grow'
const ROOM_SUBTITLE = 'Low-density, green and gated by design.'

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

  const jsx = content.includes('(0,m.jsx)') ? 'm' : 'U'

  // Fix prior broken patch if present
  const brokenFn =
    'function X({image:e,title:t,subtitle:n,height:r=`80vh`,tint:i=.4,eyebrow:a=`Kalp Residency`})'
  const brokenFnBhagwati =
    'function X({image:e,title:t,subtitle:n,height:r=`80vh`,tint:i=.4,eyebrow:a=`Bhagwati Enclave`})'
  const fixedFn =
    'function X({image:e,title:t,subtitle:n,height:r=`80vh`,tint:i=.4,eyebrow:l=`Kalp Residency`})'
  const fixedFnBhagwati =
    'function X({image:e,title:t,subtitle:n,height:r=`80vh`,tint:i=.4,eyebrow:l=`Bhagwati Enclave`})'

  if (content.includes(brokenFn)) {
    content = content.replace(brokenFn, fixedFn)
    changed = true
  } else if (content.includes(brokenFnBhagwati)) {
    content = content.replace(brokenFnBhagwati, fixedFnBhagwati)
    changed = true
  }

  const fnOld = 'function X({image:e,title:t,subtitle:n,height:r=`80vh`,tint:i=.4})'
  if (content.includes(fnOld)) {
    content = content.replace(
      fnOld,
      slug === 'bhagwanti-enclave' ? fixedFnBhagwati : fixedFn,
    )
    changed = true
  }

  const eyebrowPatterns = [
    {
      old: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`Kalp Residency\`}),(0,${jsx}.jsx)(\`h2\``,
      new: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[l&&(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:l}),(0,${jsx}.jsx)(\`h2\``,
    },
    {
      old: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[a&&(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:a}),(0,${jsx}.jsx)(\`h2\``,
      new: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[l&&(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:l}),(0,${jsx}.jsx)(\`h2\``,
    },
    {
      old: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:\`Bhagwati Enclave\`}),(0,${jsx}.jsx)(\`h2\``,
      new: `}),(0,${jsx}.jsxs)(\`div\`,{className:\`px-6 text-center\`,children:[l&&(0,${jsx}.jsx)(\`span\`,{className:\`eyebrow justify-center text-white/80\`,children:l}),(0,${jsx}.jsx)(\`h2\``,
    },
  ]

  for (const { old, new: replacement } of eyebrowPatterns) {
    if (content.includes(old)) {
      content = content.replace(old, replacement)
      changed = true
    }
  }

  const roomOld = `title:\`${ROOM_TITLE}\`,subtitle:\`${ROOM_SUBTITLE}\`})`
  const roomNew = `title:\`${ROOM_TITLE}\`,subtitle:\`${ROOM_SUBTITLE}\`,eyebrow:\`\`})`
  if (content.includes(roomOld) && !content.includes(roomNew)) {
    content = content.replace(roomOld, roomNew)
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
