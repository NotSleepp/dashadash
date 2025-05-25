import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'dashboardHostApp',
      remotes: {
        remoteApp: {
          external: 'http://localhost:5001/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        },
      },
      shared: {
        vue: { 
          singleton: true, 
          eager: true,
          requiredVersion: false
        }
      }
    })
  ],
  resolve: {
    preserveSymlinks: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  optimizeDeps: {
    exclude: ['remoteApp/RemoteWidget', 'remoteApp/RemoteComponent']
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
    hmr: {
      port: 5000
    }
  }
})
