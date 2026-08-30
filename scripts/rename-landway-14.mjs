import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsPath = path.join(__dirname, '../public/landway-14/assets/index-mwLQVKZ_.js')
const htmlPath = path.join(__dirname, '../public/landway-14/index.html')

let js = fs.readFileSync(jsPath, 'utf8')
const before = (js.match(/Landway 14/g) || []).length
js = js.replaceAll('Landway 14', 'Colonel Enclave')
fs.writeFileSync(jsPath, js)
execSync(`node --check "${jsPath}"`, { stdio: 'pipe' })
console.log('JS: replaced', before, 'occurrences')

let html = fs.readFileSync(htmlPath, 'utf8')
html = html.replaceAll('Kalp Residency', 'Colonel Enclave')
fs.writeFileSync(htmlPath, html)
console.log('HTML: updated titles/meta')
