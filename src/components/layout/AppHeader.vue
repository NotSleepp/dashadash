<script setup>
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';

const uiStore = useUiStore();
const authStore = useAuthStore();
const route = useRoute();

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard';
});
</script>

<template>
  <header class="fixed top-0 right-0 z-10 flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]"
    :class="{ 'left-64': !uiStore.isSidebarCollapsed, 'left-16': uiStore.isSidebarCollapsed }"
  >
    <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
    
    <div class="flex items-center space-x-4">
      <button 
        @click="uiStore.toggleTheme"
        class="p-2 rounded-full hover:bg-[var(--color-bg-secondary)]"
        aria-label="Cambiar tema"
      >
        <Sun v-if="uiStore.theme === 'dark'" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </button>
      
      <div class="flex items-center">
        <div class="hidden md:block mr-3 text-right">
          <div class="text-sm font-medium">{{ authStore.userFullName }}</div>
        </div>
        <div class="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white">
          {{ authStore.user?.nombre?.charAt(0) || 'U' }}
        </div>
      </div>
    </div>
  </header>
</template>