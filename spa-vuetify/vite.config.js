import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Vue({ template: { transformAssetUrls } }),
    Vuetify({ 
      autoImport: true,
      theme: {
        defaultTheme: 'light'
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@crud': fileURLToPath(new URL('src/crudui', import.meta.url)),
      '@modules': fileURLToPath(new URL('src/modules', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 9001
  }
})
