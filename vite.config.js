import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        remoteApp: 'http://localhost:5003/assets/remoteEntry.js',
      },
      shared: ['vue']
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
    strictPort: false,
    cors: true,
    hmr: {
      port: 5000
    }
  }
})
