import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsPath = path.join(__dirname, '../public/landway-14/assets/index-mwLQVKZ_.js')

let s = fs.readFileSync(jsPath, 'utf8')
const old = 'project:`Kalp Residency`'
const neu = 'project:`Colonel Enclave`'
if (!s.includes(old)) {
  console.error('project key not found, current:', s.slice(s.indexOf('project:'), s.indexOf('project:') + 40))
  process.exit(1)
}
s = s.replace(old, neu)
fs.writeFileSync(jsPath, s)
execSync(`node --check "${jsPath}"`, { stdio: 'pipe' })
console.log('F.project -> Colonel Enclave')
console.log('sample:', s.slice(s.indexOf('project:'), s.indexOf('project:') + 45))
