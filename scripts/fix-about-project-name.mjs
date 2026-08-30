import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const PROJECT_NAMES = {
  'atal-vilas': 'Atal Vilas',
  'bhagwanti-enclave': 'Bhagwati Enclave',
  'indraprastha-residency': 'Indraprastha Residency',
  'kalp-residency': 'Kalp Residency',
  'kishkindha-enclave': 'Kishkindha Enclave',
  'lakshya-avenue': 'Lakshya Avenue',
  'landway-14': 'Landway 14',
  'manipal-avenue': 'Manipal Avenue',
  'manipal-delight': 'Manipal Delight',
  'neelkanth-enclave': 'Neelkanth Enclave',
  'sankalp-plaza': 'Sankalp Plaza',
  'saraswati-enclave': 'Saraswati Enclave',
  'sharda-enclave': 'Sharda Enclave',
  'swastik-enclave': 'Swastik Enclave',
}

const OLD_PREFIX = 'Kalp Residency is a thoughtfully planned'
const OLD_FULL =
  'Kalp Residency is a thoughtfully planned residential township offering premium independent homes designed for modern families. Located near Shaheed Path, Lucknow, the project combines peaceful surroundings with excellent connectivity, high-quality infrastructure, and contemporary architecture'

for (const slug of fs.readdirSync(publicDir)) {
  const dir = path.join(publicDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue

  const assetsDir = path.join(dir, 'assets')
  if (!fs.existsSync(assetsDir)) continue

  const jsFile = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue

  const filePath = path.join(assetsDir, jsFile)
  let content = fs.readFileSync(filePath, 'utf8')
  const projectName = PROJECT_NAMES[slug]

  if (!projectName) {
    console.log('SKIP (no name mapping):', slug)
    continue
  }

  if (!content.includes(OLD_PREFIX)) {
    console.log('SKIP (text not found):', slug)
    continue
  }

  if (projectName === 'Kalp Residency') {
    console.log('OK (already correct):', slug)
    continue
  }

  const newFull = OLD_FULL.replace('Kalp Residency', projectName)
  content = content.replaceAll(OLD_FULL, newFull)

  fs.writeFileSync(filePath, content)
  execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
  console.log('OK', slug, '->', projectName)
}
