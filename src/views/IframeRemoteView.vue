<template>
  <div class="iframe-remote-view">
    <h1>Componente Remoto (via iframe)</h1>
    <p>Esta página muestra una aplicación remota usando un iframe como alternativa a Module Federation.</p>
    
    <div class="remote-container">
      <h3>Aplicación Remota</h3>
      <div class="iframe-container">
        <iframe 
          v-if="remoteUrl" 
          :src="remoteUrl" 
          frameborder="0" 
          width="100%" 
          height="500px"
          @load="iframeLoaded = true"
          @error="handleError"
        ></iframe>
        <div v-else-if="error" class="error">
          <h4>Error al cargar la aplicación remota</h4>
          <p>{{ error }}</p>
        </div>
        <div v-else class="loading">
          Cargando aplicación remota...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'IframeRemoteView',
  setup() {
    const remoteUrl = ref('');
    const iframeLoaded = ref(false);
    const error = ref(null);

    onMounted(() => {
      // Configuramos la URL de la aplicación remota
      remoteUrl.value = 'http://localhost:5001/';

      // Validamos que la URL sea accesible
      fetch(remoteUrl.value, { method: 'HEAD' })
        .catch(err => {
          error.value = `No se pudo conectar con la aplicación remota: ${err.message}`;
          remoteUrl.value = '';
        });
    });

    const handleError = () => {
      error.value = 'No se pudo cargar la aplicación remota';
      remoteUrl.value = '';
    };

    return {
      remoteUrl,
      iframeLoaded,
      error,
      handleError
    };
  }
};
</script>

<style scoped>
.iframe-remote-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.remote-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
}

.iframe-container {
  margin-top: 20px;
  min-height: 500px;
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
}

.loading, .error {
  padding: 30px;
  text-align: center;
  color: #666;
}

.error {
  background-color: #fff3f3;
  color: #d32f2f;
}

h1, h3 {
  color: #333;
}

h3 {
  margin-top: 0;
}
</style>
