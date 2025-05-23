<script setup>
import AppSidebar from '../components/layout/AppSidebar.vue';
import AppHeader from '../components/layout/AppHeader.vue';
import { useUiStore } from '../store/ui.store';

const uiStore = useUiStore();
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <AppSidebar />
    <AppHeader />
    
    <main 
      class="pt-16 transition-all duration-300"
      :class="{ 'ml-64': !uiStore.isSidebarCollapsed, 'ml-16': uiStore.isSidebarCollapsed }"
    >
      <div class="p-6">
        <Suspense>
          <router-view />
          <template #fallback>
            <div class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="mt-4">Cargando...</p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </main>
  </div>
</template>