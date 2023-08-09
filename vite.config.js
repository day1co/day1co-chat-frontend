import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    lib: {
      entry: './src/index.js',
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
