import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [
    vue()
  ],
  build: {
    lib: {
      entry: path.join(__dirname, './src/index.js'),
      formats: ['es', 'cjs'],
    }
  },
  server: {
    port: 8011,
    proxy: {
      '/.api': {
        target: `http://127.0.0.1:8012`,
        rewrite: (path) => path.replace(/^\/\.api/, '')
      }
    }
  }
})
