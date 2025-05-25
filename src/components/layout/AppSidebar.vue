<script setup>
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import NavLink from './NavLink.vue';
import { ChevronRight, ChevronLeft, LogOut } from 'lucide-vue-next';

const uiStore = useUiStore();
const authStore = useAuthStore();
</script>

<template>
  <aside 
    class="fixed top-0 left-0 h-full transition-all duration-300 border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] z-10"
    :class="{ 'w-64': !uiStore.isSidebarCollapsed, 'w-16': uiStore.isSidebarCollapsed }"
  >
    <div class="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border)]">
      <div class="flex items-center">
        <span class="text-xl font-bold text-[var(--color-accent)]" v-if="!uiStore.isSidebarCollapsed">Dashboard</span>
        <span class="text-xl font-bold text-[var(--color-accent)]" v-else>D</span>
      </div>
      <button 
        @click="uiStore.toggleSidebar"
        class="p-1 rounded-md hover:bg-[var(--color-bg-secondary)]"
      >
        <ChevronRight v-if="uiStore.isSidebarCollapsed" class="w-5 h-5" />
        <ChevronLeft v-else class="w-5 h-5" />
      </button>
    </div>
    
    <div class="py-4 overflow-y-auto">
      <div class="px-3 space-y-1">
        <NavLink 
          v-for="item in uiStore.sortedMenuItems" 
          :key="item.id" 
          :item="item" 
          :collapsed="uiStore.isSidebarCollapsed"
        />
      </div>
    </div>
    
    <div class="absolute bottom-0 w-full border-t border-[var(--color-border)]">
      <div 
        class="flex items-center p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)]"
        :class="{ 'justify-center': uiStore.isSidebarCollapsed }"
        @click="authStore.logout()"
      >
        <LogOut class="w-5 h-5 text-red-500" />
        <span v-if="!uiStore.isSidebarCollapsed" class="ml-3">Cerrar sesión</span>
      </div>
    </div>
  </aside>
</template>