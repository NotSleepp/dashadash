<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const stats = ref([
  { title: 'Usuarios', value: '1,234', icon: 'Users' },
  { title: 'Ventas', value: '$5,678', icon: 'ShoppingCart' },
  { title: 'Productos', value: '890', icon: 'Package' },
  { title: 'Visitas', value: '12,345', icon: 'BarChart' }
]);
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">¡Bienvenido, {{ authStore.user?.nombre }}!</h2>
      <p class="text-[var(--color-text-secondary)]">Resumen del dashboard principal</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-[var(--color-text-secondary)] mb-1">{{ stat.title }}</p>
            <p class="text-2xl font-semibold">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="border border-[var(--color-border)] rounded-lg p-6 bg-[var(--color-bg-primary)]">
      <h3 class="text-lg font-medium mb-4">Información del Sistema</h3>
      <p class="mb-4">Esta es la aplicación host del dashboard que utiliza Module Federation para cargar contenido de aplicaciones remotas.</p>
      <div class="bg-[var(--color-bg-secondary)] p-4 rounded-md">
        <p class="font-mono text-sm">Para añadir elementos al menú desde una aplicación remota, utiliza:</p>
        <pre class="bg-[var(--color-bg-secondary)] p-2 rounded mt-2 overflow-x-auto text-sm">
window.dispatchEvent(new CustomEvent('add-dashboard-menu-item', { 
  detail: { 
    id: 'unique-id', 
    label: 'Nombre del Módulo', 
    path: '/ruta/del/modulo', 
    icon: 'IconName', 
    order: 10 
  } 
}));</pre>
      </div>
    </div>
  </div>
</template>