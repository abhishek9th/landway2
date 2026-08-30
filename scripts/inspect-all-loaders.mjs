import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(__dirname, '../public')

const K_PATTERN = 'children:`K`'

for (const slug of fs.readdirSync(pub).sort()) {
  const assets = path.join(pub, slug, 'assets')
  if (!fs.existsSync(assets)) continue
  const js = fs.readdirSync(assets).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!js) continue
  const s = fs.readFileSync(path.join(assets, js), 'utf8')
  const count = (s.match(/children:`K`/g) || []).length

  // Find loader structure
  let loaderSnippet = 'none'
  const markers = [
    'flex items-center gap-3`,children:[(0,',
    'flex flex-col items-center`,children:[(0,',
  ]
  for (const m of markers) {
    const i = s.indexOf(m)
    if (i >= 0 && s.slice(i, i + 400).includes('tracking')) {
      loaderSnippet = s.slice(i, i + 350)
      break
    }
  }
  console.log(slug, 'K=', count)
  if (count > 0 || loaderSnippet !== 'none') {
    console.log(' ', loaderSnippet.slice(0, 280))
  }
}
