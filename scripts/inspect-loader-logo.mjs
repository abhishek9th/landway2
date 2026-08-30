import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(__dirname, '../public')

// Find logos
function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/logo/i.test(name)) out.push(p)
  }
  return out
}
console.log('logos:', walk(pub).map((p) => path.relative(pub, p)))
console.log('public root:', fs.readdirSync(pub).filter((n) => fs.statSync(path.join(pub, n)).isFile()))

const s = fs.readFileSync(path.join(pub, 'landway-14/assets/index-mwLQVKZ_.js'), 'utf8')
const idx = s.indexOf('Colonel Enclave')
console.log('around Colonel Enclave loader:')
// find the one near font-display tracking-tight
let i = -1
while ((i = s.indexOf('tracking-tight', i + 1)) !== -1) {
  const chunk = s.slice(Math.max(0, i - 250), i + 200)
  if (chunk.includes('Colonel') || chunk.includes('F.project') || chunk.includes('Kalp')) {
    console.log('---')
    console.log(chunk)
  }
}

console.log('K children count', (s.match(/children:`K`/g) || []).length)
const kIdx = s.indexOf('children:`K`')
if (kIdx >= 0) console.log('first K:', s.slice(kIdx - 200, kIdx + 80))
