<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { defineAsyncComponent } from 'vue';
import { remoteHostBridge, EVENT_TYPES } from '../services/RemoteHostBridge';
import { themeService } from '../services/ThemeService';

// Cargar el componente remoto de forma asíncrona
const RemoteExample = defineAsyncComponent(() => import('remoteApp/RemoteExample'));

// Estado local
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

// Función para manejar el evento de componente listo
function handleRemoteReady(event) {
  if (event && event.id) {
    console.log(`Componente remoto listo: ${event.id}`);
    isLoading.value = false;
  }
}

// Función para enviar un evento de actualización al componente remoto
function refreshRemoteComponent() {
  remoteHostBridge.sendToRemote(EVENT_TYPES.HOST_ACTIONS.REFRESH);
}

// Configurar escuchadores al montar el componente
onMounted(() => {
  // Escuchar evento de componente listo
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.VIEW_READY, handleRemoteReady);
  
  // Simular un tiempo de carga
  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false;
    }
  }, 3000);
  
  // Manejar errores de carga
  window.addEventListener('error', (e) => {
    if (e.message.includes('Failed to fetch dynamically imported module')) {
      hasError.value = true;
      errorMessage.value = 'No se pudo cargar el componente remoto. Asegúrate de que la aplicación remota esté en ejecución.';
      isLoading.value = false;
    }
  }, true);
});

// Limpiar escuchadores al desmontar
onBeforeUnmount(() => {
  remoteHostBridge.off(EVENT_TYPES.REMOTE_TO_HOST.VIEW_READY, handleRemoteReady);
});
</script>

<template>
  <div class="remote-example-view">
    <div class="view-header">
      <h1>Integración de Componente Remoto</h1>
      <p class="description">Esta vista demuestra la integración con un componente remoto utilizando el sistema de comunicación mejorado.</p>
    </div>
    
    <div class="content-container">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando componente remoto...</p>
      </div>
      
      <!-- Estado de error -->
      <div v-else-if="hasError" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Error de carga</h3>
        <p>{{ errorMessage }}</p>
        <button @click="refreshRemoteComponent" class="refresh-button">
          Reintentar
        </button>
      </div>
      
      <!-- Componente remoto cargado correctamente -->
      <div v-else class="remote-component-container">
        <RemoteExample />
      </div>
      
      <div class="info-panel">
        <h3>Información de Integración</h3>
        <p>Este componente remoto utiliza el sistema de comunicación mejorado para:</p>
        <ul>
          <li>Sincronizar el tema con la aplicación host</li>
          <li>Mostrar notificaciones en la aplicación host</li>
          <li>Abrir modales en la aplicación host</li>
          <li>Añadir elementos al menú del dashboard</li>
          <li>Enviar datos actualizados a la aplicación host</li>
        </ul>
        
        <div class="actions">
          <button @click="refreshRemoteComponent" class="action-button">
            Actualizar Componente Remoto
          </button>
          <button @click="themeService.toggleTheme()" class="action-button">
            Cambiar Tema
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.remote-example-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.view-header h1 {
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.description {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: var(--color-bg-secondary);
  border-radius: 0.5rem;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--color-bg-primary);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: var(--color-error);
  margin-bottom: 0.5rem;
}

.refresh-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  opacity: 0.9;
}

.remote-component-container {
  background-color: var(--color-bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
}

.info-panel {
  background-color: var(--color-bg-secondary);
  border-radius: 0.5rem;
  padding: 1.5rem;
  height: fit-content;
}

.info-panel h3 {
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.info-panel ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-panel li {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-button {
  padding: 0.75rem 1rem;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }
  
  .remote-example-view {
    padding: 1rem;
  }
}
</style>