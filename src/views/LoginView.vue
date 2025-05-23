<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const credentials = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!credentials.value.email || !credentials.value.password) {
    error.value = 'Por favor, completa todos los campos';
    return;
  }
  
  try {
    loading.value = true;
    error.value = '';
    
    await authStore.login(credentials.value);
    
    // Redirigir a la ruta original o al dashboard
    const redirectPath = route.query.redirect || '/dashboard';
    router.push(redirectPath);
  } catch (err) {
    error.value = 'Credenciales inválidas. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] p-4">
    <div class="w-full max-w-md bg-[var(--color-bg-primary)] rounded-lg shadow-md p-8 border border-[var(--color-border)]">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-[var(--color-accent)]">Dashboard</h1>
        <p class="text-[var(--color-text-secondary)] mt-2">Inicia sesión para continuar</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm mb-4">
          {{ error }}
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2" for="email">Email</label>
          <input 
            id="email"
            v-model="credentials.email"
            type="email" 
            placeholder="tu@email.com"
            class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            required
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2" for="password">Contraseña</label>
          <input 
            id="password"
            v-model="credentials.password"
            type="password" 
            placeholder="********"
            class="w-full px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)]"
            required
          >
        </div>
        
        <div>
          <button 
            type="submit"
            class="w-full px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:opacity-90 flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </div>
        
        <div class="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          <p>Para fines de demostración, puedes usar cualquier email y contraseña.</p>
        </div>
      </form>
    </div>
  </div>
</template>