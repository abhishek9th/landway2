import { defineConfig, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Serves the pre-built project apps (in public/<slug>/) for directory-style
 * URLs like "/kalp-residency" or "/kalp-residency/". Without this, Vite's SPA
 * fallback would return the home page for those paths. Runs in both `dev` and
 * `preview`. Actual files (assets, images, /slug/index.html) are served by
 * Vite's static handling as usual — this only rewrites the bare directory path.
 */
function serveProjectBuilds(): Plugin {
  const publicDir = resolve(__dirname, 'public')
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const [path, query = ''] = (req.url ?? '').split('?')
    const m = path.match(/^\/([a-z0-9-]+)\/?$/i)
    if (m && existsSync(resolve(publicDir, m[1], 'index.html'))) {
      req.url = `/${m[1]}/index.html${query ? `?${query}` : ''}`
    }
    next()
  }
  return {
    name: 'serve-project-builds',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveProjectBuilds()],
  server: {
    port: 5199,
    strictPort: true,
  },
  preview: {
    port: 5199,
    strictPort: true,
  },
})
