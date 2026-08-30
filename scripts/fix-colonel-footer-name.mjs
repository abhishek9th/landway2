import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../public/landway-14/assets/index-mwLQVKZ_.js')

let s = fs.readFileSync(filePath, 'utf8')

const old =
  '(0,m.jsxs)(`div`,{className:`flex items-center gap-2.5`,children:[(0,m.jsx)(`img`,{src:`/logo.png`,alt:`Landway Innovation`,className:`h-11 w-auto object-contain`}),(0,m.jsx)(`span`,{className:`font-display text-xl font-extrabold`,children:I.project})]})'
const neu =
  '(0,m.jsxs)(`div`,{className:`flex items-center gap-2.5`,children:[(0,m.jsx)(`img`,{src:`/logo.png`,alt:`Landway Innovation`,className:`h-11 w-auto object-contain`})]})'

if (!s.includes(old)) {
  const i = s.indexOf('lg:col-span-1')
  console.log(s.slice(i, i + 400))
  process.exit(1)
}

s = s.replace(old, neu)
fs.writeFileSync(filePath, s)
execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
console.log('OK: removed project name from Colonel footer')
