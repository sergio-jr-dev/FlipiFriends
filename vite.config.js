import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        rollupFormat: 'iife',
      },
      registerType: 'autoUpdate',
      includeAssets: [
        'apple-touch-icon-kids.png',
        'brand/logo-kids.webp',
        'pwa-kids-192x192.png',
        'pwa-kids-512x512.png',
        'maskable-icon-kids-512x512.png',
      ],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'FlipiFriends',
        short_name: 'FlipiFriends',
        description: 'Juego de memoria de parejas para disfrutar en familia.',
        theme_color: '#5f7ef5',
        background_color: '#f7f3ff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          {
            src: 'pwa-kids-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-kids-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-kids-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
