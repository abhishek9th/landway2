import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const assets = 'public/kalp-residency/assets'
const f = readdirSync(assets).find((x) => x.startsWith('index-'))
const src = readFileSync(join(assets, f), 'utf8')
const start = src.lastIndexOf('relative border-t border-white/10 py-6')
const end = src.indexOf('function it()', start)
console.log(src.slice(start - 30, end + 20))
