<template>
  <div class="remote-component-container">
    <h3>Componente Remoto Cargado</h3>
    
    <!-- Mensaje de carga mientras se cargan los componentes -->
    <div v-if="loading" class="loading">
      <p>Cargando componente remoto...</p>
    </div>
    
    <!-- Mensaje de error si hay problemas al cargar los componentes -->
    <div v-else-if="error" class="error">
      <h4>Error al cargar el componente remoto</h4>
      <p>{{ error.message || 'No se pudo cargar el componente remoto' }}</p>
    </div>
    
    <!-- Componente remoto cargado correctamente -->
    <div v-else-if="RemoteWidget" class="widget-container">
      <component :is="RemoteWidget" :title="widgetTitle" />
    </div>
    
    <!-- Fallback si no se pudo cargar -->
    <div v-else class="error">
      <p>No se pudo cargar el componente remoto</p>
    </div>
  </div>
</template>

<script>
import { ref, shallowRef, onMounted } from 'vue';

export default {
  name: 'RemoteComponentLoader',
  setup() {
    const widgetTitle = ref('Dashboard de Estadísticas');
    const loading = ref(true);
    const error = ref(null);
    const RemoteWidget = shallowRef(null);
    
    onMounted(async () => {
      try {
        // Cargamos el componente remoto de manera segura
        const remoteApp = await import('remoteApp/RemoteWidget');
        RemoteWidget.value = remoteApp.default;
        loading.value = false;
      } catch (e) {
        error.value = e;
        loading.value = false;
        console.error('Error cargando componente remoto:', e);
      }
    });
    
    return {
      widgetTitle,
      loading,
      error,
      RemoteWidget
    };
  }
}
</script>

<style scoped>
.remote-component-container {
  padding: 15px;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
}

h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
}

.loading {
  padding: 30px;
  text-align: center;
  color: #666;
}
</style>
