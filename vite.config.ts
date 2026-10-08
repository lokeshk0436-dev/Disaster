import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'AYPO Disaster Systems',
        short_name: 'AYPO',
        description: 'National Disaster Family Reunification & Multi-Agency Coordination Platform',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/aypo-logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/aypo-logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/aypo-logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
