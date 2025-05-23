<script setup>
import { onMounted, watch } from 'vue';
import { useUiStore } from './store/ui.store';

const uiStore = useUiStore();

// Cargar los elementos del menú al iniciar
onMounted(() => {
  uiStore.loadMenuItems();
  
  // Escuchar eventos de menú desde aplicaciones remotas
  window.addEventListener('add-dashboard-menu-item', (event) => {
    uiStore.addMenuItem(event.detail);
  });
});

// Aplicar tema oscuro/claro según el estado
watch(
  () => uiStore.theme,
  (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
