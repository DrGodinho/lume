import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(), 
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['novo-logo-lume.png', 'hero-bg.jpg'],
      manifest: {
        name: 'LUME Controle Solar',
        short_name: 'LUME',
        description: 'Calculadora e Simulador LUME Controle Solar',
        theme_color: '#0a1628',
        background_color: '#0a1628',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'novo-logo-lume.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'novo-logo-lume.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
});

