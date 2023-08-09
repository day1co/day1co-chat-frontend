import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

import express from 'express'
import { createServer as createViteServer } from 'vite'

import viteConfig from './vite.config.js'
import dummyServer from './dummy-api/index.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const HOST = import.meta.env?.HOST
const PORT = import.meta.env?.PORT ?? 8011

const app = express()
const server = http.createServer(app)

const vite = await createViteServer({
  ...viteConfig,
  configFile: false,
  root: __dirname,
  server: { middlewareMode: true },
  clearScreen: false
})

app.use('/.api', dummyServer)
app.use(vite.middlewares)

app.use('/', async (req, res) => {
  const url = req.originalUrl

  let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
  template = await vite.transformIndexHtml(url, template)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
})

server.listen(PORT, HOST, () => {
  const { host, port, family } = server.address()
  console.log(`listening on ${host ?? ''}:${port} (${family})`)
})
