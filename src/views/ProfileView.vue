<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const user = ref(authStore.user);

const saveProfile = () => {
  // Simulación de guardado
  setTimeout(() => {
    alert('Perfil actualizado correctamente');
  }, 500);
};
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">Perfil de Usuario</h2>
      <p class="text-[var(--color-text-secondary)]">Administra tu información personal</p>
    </div>
    
    <div class="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-2xl">
          {{ user?.nombre?.charAt(0) || 'U' }}
        </div>
        <div>
          <h3 class="text-xl font-medium">{{ authStore.userFullName }}</h3>
          <p class="text-[var(--color-text-secondary)]">{{ user?.rol || 'Usuario' }}</p>
        </div>
      </div>
      
      <form @submit.prevent="saveProfile">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2" for="nombre">Nombre</label>
            <input 
              id="nombre"
              v-model="user.nombre"
              type="text" 
              class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2" for="apellido">Apellido</label>
            <input 
              id="apellido"
              v-model="user.apellido"
              type="text" 
              class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2" for="email">Email</label>
            <input 
              id="email"
              v-model="user.email"
              type="email" 
              class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2" for="rol">Rol</label>
            <select 
              id="rol"
              v-model="user.rol"
              class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit"
            class="px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:opacity-90"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>