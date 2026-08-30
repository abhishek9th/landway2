import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

const MOBILE_CSS = `
/* === mobile responsive hardening === */
html,body{overflow-x:hidden!important;max-width:100%!important;overscroll-behavior-x:none;-webkit-text-size-adjust:100%;text-size-adjust:100%}
#root,main,footer,header,section{max-width:100%;overflow-x:clip}
img,video,iframe,canvas,svg{max-width:100%;height:auto}
button,a,[role=button]{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.shell{width:100%;max-width:100%;padding-left:max(1rem,env(safe-area-inset-left));padding-right:max(1rem,env(safe-area-inset-right));box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:88px}
@media (max-width:767px){
  html{scroll-padding-top:72px}
  .btn,.btn-primary,.btn-dark,.btn-ghost{width:100%!important;max-width:100%!important;justify-content:center;min-height:48px;box-sizing:border-box}
  .hero-cta{width:100%}
  .hero-cta .btn,.hero-cta a,.hero-cta button{width:100%!important}
  section#home .flex.flex-col,section#home .sm\\:flex-row{width:100%}
  .fixed.bottom-4.right-4,.fixed.bottom-5.right-5{right:max(.75rem,env(safe-area-inset-right));bottom:max(.75rem,env(safe-area-inset-bottom));left:auto;max-width:calc(100vw - 1.5rem)}
  h1,h2,.h-display{overflow-wrap:anywhere;word-break:break-word}
  input,textarea,select{font-size:16px!important;max-width:100%}
}
@media (hover:none) and (pointer:coarse){
  .group:hover{-webkit-transform:none;transform:none}
}
`

const LENIS_OLD =
  'if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let e=new a({duration:1.15'
const LENIS_NEW =
  'if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||window.matchMedia(`(max-width: 1023px)`).matches||window.matchMedia(`(hover: none) and (pointer: coarse)`).matches)return;let e=new a({duration:1.15'

// Disable magnetic button pull on touch devices
const MAGNETIC_OLD = 'onMouseMove:e=>{let t=c.current;if(!t)return;let n=t.getBoundingClientRect(),r=(e.clientX-(n.left+n.width/2))*i,a=(e.clientY-(n.top+n.height/2))*i;t.style.transform=`translate(${r}px, ${a}px)`}'
const MAGNETIC_NEW =
  'onMouseMove:e=>{if(window.matchMedia(`(hover: none)`).matches)return;let t=c.current;if(!t)return;let n=t.getBoundingClientRect(),r=(e.clientX-(n.left+n.width/2))*i,a=(e.clientY-(n.top+n.height/2))*i;t.style.transform=`translate(${r}px, ${a}px)`}'

// landway-14 may use different jsx runtime variable for magnetic - check both patterns
const MAGNETIC_OLD_M = MAGNETIC_OLD // same JS logic

for (const slug of fs.readdirSync(publicDir)) {
  const dir = path.join(publicDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue
  const assetsDir = path.join(dir, 'assets')
  if (!fs.existsSync(assetsDir)) continue

  // CSS
  const cssFile = fs
    .readdirSync(assetsDir)
    .find((f) => f.startsWith('index-') && f.endsWith('.css'))
  if (cssFile) {
    const cssPath = path.join(assetsDir, cssFile)
    let css = fs.readFileSync(cssPath, 'utf8')
    if (!css.includes('mobile responsive hardening')) {
      css += MOBILE_CSS
      fs.writeFileSync(cssPath, css)
      console.log('CSS OK:', slug)
    } else {
      console.log('CSS skip:', slug)
    }
  }

  // JS
  const jsFile = fs
    .readdirSync(assetsDir)
    .find((f) => f.startsWith('index-') && f.endsWith('.js'))
  if (!jsFile) continue
  const jsPath = path.join(assetsDir, jsFile)
  let js = fs.readFileSync(jsPath, 'utf8')
  let changed = false

  if (js.includes(LENIS_OLD) && !js.includes('(max-width: 1023px)')) {
    js = js.replace(LENIS_OLD, LENIS_NEW)
    changed = true
  }

  if (js.includes(MAGNETIC_OLD) && !js.includes('onMouseMove:e=>{if(window.matchMedia(`(hover: none)`).matches)return;')) {
    js = js.replaceAll(MAGNETIC_OLD, MAGNETIC_NEW)
    changed = true
  }

  // Also handle landway-14 magnetic if variable names differ slightly - try generic
  if (!js.includes('onMouseMove:e=>{if(window.matchMedia(`(hover: none)`).matches)return;')) {
    const alt = /onMouseMove:e=>\{let t=c\.current;if\(!t\)return;let n=t\.getBoundingClientRect\(\),r=\(e\.clientX-\(n\.left\+n\.width\/2\)\)\*i,a=\(e\.clientY-\(n\.top\+n\.height\/2\)\)\*i;t\.style\.transform=`translate\(\$\{r\}px, \$\{a\}px\)`\}/
    if (alt.test(js)) {
      js = js.replace(
        alt,
        'onMouseMove:e=>{if(window.matchMedia(`(hover: none)`).matches)return;let t=c.current;if(!t)return;let n=t.getBoundingClientRect(),r=(e.clientX-(n.left+n.width/2))*i,a=(e.clientY-(n.top+n.height/2))*i;t.style.transform=`translate(${r}px, ${a}px)`}',
      )
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(jsPath, js)
    execSync(`node --check "${jsPath}"`, { stdio: 'pipe' })
    console.log('JS OK:', slug)
  } else {
    console.log('JS skip/partial:', slug, {
      lenis: js.includes('(max-width: 1023px)'),
      magnetic: js.includes('(hover: none)'),
    })
  }
}
