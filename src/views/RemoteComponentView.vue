<script setup>
import { onMounted, ref, shallowRef } from 'vue';

// Estado para manejar la carga de componentes
const remoteComponentLoaded = ref(false);
const remoteCounterValue = ref(0);
const loading = ref(true);
const error = ref(null);
const RemoteWidget = shallowRef(null);
const RemoteComponent = shallowRef(null);

onMounted(async () => {
  try {
    // Cargamos los componentes remotos de manera segura
    const remoteApp = await import('remoteApp/RemoteWidget');
    RemoteWidget.value = remoteApp.default;
    remoteComponentLoaded.value = true;
    
    // Cargamos el segundo componente
    const remoteComponentApp = await import('remoteApp/RemoteComponent');
    RemoteComponent.value = remoteComponentApp.default;
    
    // Escuchamos el evento personalizado del componente remoto
    window.addEventListener('remote-counter-updated', (event) => {
      remoteCounterValue.value = event.detail.count;
    });
    
    loading.value = false;
  } catch (e) {
    error.value = e;
    loading.value = false;
    console.error('Error cargando componentes remotos:', e);
  }
});
</script>

<template>
  <div class="remote-component-view">
    <h1>Componente Remoto</h1>
    <p>Esta página muestra un componente cargado desde una aplicación remota usando Module Federation.</p>
    
    <!-- Mensaje de carga mientras se cargan los componentes -->
    <div v-if="loading" class="loading-container">
      <div class="loading">Cargando componentes remotos...</div>
    </div>
    
    <!-- Mensaje de error si hay problemas al cargar los componentes -->
    <div v-else-if="error" class="error-container">
      <div class="error">
        <h3>Error al cargar los componentes remotos</h3>
        <p>{{ error.message || 'No se pudieron cargar los componentes remotos' }}</p>
        <pre v-if="error.stack">{{ error.stack }}</pre>
      </div>
    </div>
    
    <!-- Componentes remotos cargados correctamente -->
    <div v-else>
      <div class="remote-container">
        <h3>Widget de Estadísticas</h3>
        <div v-if="RemoteWidget" class="widget-container">
          <component :is="RemoteWidget" title="Dashboard de Estadísticas" />
        </div>
        <div v-else class="loading">No se pudo cargar el widget remoto</div>
      </div>
      
      <div class="remote-container" style="margin-top: 30px;">
        <h3>Componente Interactivo</h3>
        <div v-if="RemoteComponent" class="component-container">
          <component :is="RemoteComponent" />
        </div>
        <div v-else class="loading">No se pudo cargar el componente remoto</div>
      </div>
      
      <div v-if="remoteCounterValue > 0" class="counter-info">
        <h3>Comunicación entre Host y Remote</h3>
        <p>El contador del componente remoto ha sido actualizado a: <span class="counter-value">{{ remoteCounterValue }}</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.remote-component-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.remote-container {
  margin: 30px 0;
  border: 1px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.counter-info {
  margin-top: 30px;
  padding: 15px;
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
  border-radius: 4px;
}

.counter-value {
  font-weight: bold;
  font-size: 1.2em;
  color: #1890ff;
}
</style>