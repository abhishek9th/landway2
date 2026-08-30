import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(__dirname, '../public')

for (const slug of ['landway-14', 'kalp-residency', 'sharda-enclave']) {
  const js = fs.readdirSync(path.join(pub, slug, 'assets')).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  const s = fs.readFileSync(path.join(pub, slug, 'assets', js), 'utf8')
  const i = s.indexOf('/logo.png')
  console.log('---', slug, '---')
  console.log(s.slice(Math.max(0, i - 80), i + 200))
  console.log('loader K badge?', s.includes('h-9 w-9 rounded-lg bg-accent grid place-items-center'))
}
