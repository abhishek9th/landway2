import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')
const homeIndex = path.join(__dirname, '../index.html')

const PROJECT_NAMES = {
  'atal-vilas': 'Atal Vilas',
  'bhagwanti-enclave': 'Bhagwati Enclave',
  'indraprastha-residency': 'Indraprastha Residency',
  'kalp-residency': 'Kalp Residency',
  'kishkindha-enclave': 'Kishkindha Enclave',
  'lakshya-avenue': 'Lakshya Avenue',
  'landway-14': 'Colonel Enclave',
  'manipal-avenue': 'Manipal Avenue',
  'manipal-delight': 'Manipal Delight',
  'neelkanth-enclave': 'Neelkanth Enclave',
  'sankalp-plaza': 'Sankalp Plaza',
  'saraswati-enclave': 'Saraswati Enclave',
  'sharda-enclave': 'Sharda Enclave',
  'swastik-enclave': 'Swastik Enclave',
}

const TITLE_SUFFIX = ' — Premium Independent Villas in Lucknow | Landway Innovation'
const OG_TITLE_SUFFIX = ' — Premium Independent Villas in Lucknow'
const FAVICON = '<link rel="icon" type="image/png" href="/logo.png" />'

function updateHtml(html, name) {
  // Favicon
  if (/<link rel="icon"[^>]*>/i.test(html)) {
    html = html.replace(/<link rel="icon"[^>]*>/i, FAVICON)
  } else {
    html = html.replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n    ${FAVICON}`)
  }

  // Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${name}${TITLE_SUFFIX}</title>`)

  // Replace leftover Kalp Residency / Colonel Enclave (if wrong) branding in meta
  // First normalize any previous project-specific names in common meta slots by targeting attributes
  html = html.replace(
    /name="description"\s+content="[^"]*"/i,
    `name="description" content="${name} by Landway Innovation — premium independent villas near Shaheed Path, Lucknow. Gated community, 40 ft roads, registry available, loan assistance. Book a free site visit today."`,
  )
  // multiline description
  html = html.replace(
    /name="description"\s*\n\s*content="[^"]*"/i,
    `name="description"\n      content="${name} by Landway Innovation — premium independent villas near Shaheed Path, Lucknow. Gated community, 40 ft roads, registry available, loan assistance. Book a free site visit today."`,
  )

  html = html.replace(
    /name="keywords" content="[^"]*"/i,
    `name="keywords" content="${name}, independent villas Lucknow, Shaheed Path property, gated community Lucknow, Landway Innovation, premium villas Uttar Pradesh, registry ready plots"`,
  )

  html = html.replace(
    /property="og:site_name" content="[^"]*"/i,
    `property="og:site_name" content="${name}"`,
  )
  html = html.replace(
    /property="og:title" content="[^"]*"/i,
    `property="og:title" content="${name}${OG_TITLE_SUFFIX}"`,
  )
  html = html.replace(
    /name="twitter:title" content="[^"]*"/i,
    `name="twitter:title" content="${name}${OG_TITLE_SUFFIX}"`,
  )

  // JSON-LD RealEstateListing name
  html = html.replace(
    /("@type":\s*"RealEstateListing",\s*"name":\s*")[^"]*(")/,
    `$1${name}$2`,
  )
  // Simpler JSON-LD name if pattern differs
  html = html.replace(
    /("name":\s*")Kalp Residency(")/g,
    `$1${name}$2`,
  )
  html = html.replace(
    /("name":\s*")Colonel Enclave(")/g,
    `$1${name}$2`,
  )

  return html
}

for (const [slug, name] of Object.entries(PROJECT_NAMES)) {
  const htmlPath = path.join(publicDir, slug, 'index.html')
  if (!fs.existsSync(htmlPath)) {
    console.log('SKIP:', slug)
    continue
  }
  let html = fs.readFileSync(htmlPath, 'utf8')
  html = updateHtml(html, name)
  fs.writeFileSync(htmlPath, html)

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]
  const icon = html.match(/<link rel="icon"[^>]*>/i)?.[0]
  console.log('OK', slug)
  console.log('  title:', title)
  console.log('  icon:', icon)
}

// Home page favicon
if (fs.existsSync(homeIndex)) {
  let home = fs.readFileSync(homeIndex, 'utf8')
  if (/<link rel="icon"[^>]*>/i.test(home)) {
    home = home.replace(/<link rel="icon"[^>]*>/i, FAVICON)
  } else if (/<meta name="viewport"[^>]*>/i.test(home)) {
    home = home.replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n    ${FAVICON}`)
  }
  fs.writeFileSync(homeIndex, home)
  console.log('OK home index favicon')
}
