import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Liquid Art',
        short_name: 'Liquid',
        description: 'Interactive water surface experience',
        theme_color: '#0a0a1a',
        background_color: '#0a0a1a',
        display: 'fullscreen',
        orientation: 'any',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
  },
});
