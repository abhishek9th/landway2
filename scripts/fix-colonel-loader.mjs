import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsPath = path.join(__dirname, '../public/landway-14/assets/index-mwLQVKZ_.js')

let s = fs.readFileSync(jsPath, 'utf8')

const loaderOld =
  'className:`font-display text-2xl font-extrabold tracking-tight`,children:`Kalp Residency`'
const loaderNew =
  'className:`font-display text-2xl font-extrabold tracking-tight`,children:`Colonel Enclave`'

if (!s.includes(loaderOld)) {
  console.error('Loader pattern not found')
  const i = s.indexOf('tracking-tight`,children:')
  console.log(s.slice(i - 40, i + 80))
  process.exit(1)
}

s = s.replace(loaderOld, loaderNew)
fs.writeFileSync(jsPath, s)
execSync(`node --check "${jsPath}"`, { stdio: 'pipe' })
console.log('Loader -> Colonel Enclave')
console.log(s.includes('children:`Colonel Enclave`') ? 'verified' : 'missing')
