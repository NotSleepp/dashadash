import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'dashboardHostApp',
      // Remotes - Aplicaciones remotas que se cargarán dinámicamente
      // Ejemplo:
      remotes: {
        // adminApp: 'adminApp@http://localhost:5001/assets/remoteEntry.js',
        // reportApp: 'reportApp@http://localhost:5002/assets/remoteEntry.js',
      },
      // Módulos compartidos entre host y remotes
      shared: {
        vue: { 
          singleton: true, 
          eager: true,
          requiredVersion: '^3.3.0'
        },
        'vue-router': { 
          singleton: true,
          eager: true,
          requiredVersion: '^4.0.0'
        },
        pinia: { 
          singleton: true,
          eager: true,
          requiredVersion: '^2.0.0'
        }
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5000
  }
})
