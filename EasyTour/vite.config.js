import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    proxy: {
      '/moz-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moz-api/, ''),
      },
    },
  },
  // O GitHub Pages publica o projecto em https://<utilizador>.github.io/EasyTour/.
  // Em desenvolvimento a base fica em "/" para não alterar os URLs locais.
  base: command === 'build' ? '/EasyTour/' : '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
