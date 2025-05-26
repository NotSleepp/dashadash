<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUiStore } from '../store/ui.store';
import RemoteWidget from 'remoteApp/RemoteWidget';
import RemoteComponent from 'remoteApp/RemoteComponent';

const uiStore = useUiStore();
const counterValue = ref(null);
const initialCounterValue = ref(5); // Valor inicial para el contador remoto
const lastUpdate = ref(null);
const widgetStatus = ref('loading'); // 'loading', 'connected', 'error'
const componentStatus = ref('loading'); // 'loading', 'connected', 'error'
const widgetRetries = ref(3);
const componentRetries = ref(3);
const loadError = ref(false);

// Estado calculado
const lastUpdateTime = computed(() => {
  if (!lastUpdate.value) return 'No disponible';
  return lastUpdate.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
});

const widgetStatusText = computed(() => {
  switch(widgetStatus.value) {
    case 'connected': return 'Widget conectado';
    case 'error': return 'Error al cargar el widget';
    default: return 'Cargando widget...';
  }
});

const allComponentsLoaded = computed(() => {
  return widgetStatus.value === 'connected' && componentStatus.value === 'connected';
});

const loadStatusText = computed(() => {
  if (loadError.value) return 'Error de carga';
  if (allComponentsLoaded.value) return 'Todos los componentes cargados';
  return 'Cargando componentes...';
});

// Métodos para manejar eventos de Suspense
function handleWidgetPending() {
  widgetStatus.value = 'loading';
}

function handleWidgetResolved() {
  // El widget se ha cargado, pero esperamos el evento mounted para confirmar
  console.log('Widget cargado correctamente');
}

function handleWidgetFallback() {
  console.log('Mostrando fallback del widget');
}

function handleComponentPending() {
  componentStatus.value = 'loading';
}

function handleComponentResolved() {
  // El componente se ha cargado correctamente
  componentStatus.value = 'connected';
  console.log('Componente cargado correctamente');
}

function handleComponentFallback() {
  console.log('Mostrando fallback del componente');
}

// Métodos para manejar eventos de componentes remotos
function handleCounterUpdate(value) {
  counterValue.value = value;
  lastUpdate.value = new Date();
  // Aseguramos que el componente está conectado
  componentStatus.value = 'connected';
}

function handleWidgetMounted(data) {
  console.log('Widget montado:', data);
  widgetStatus.value = 'connected';
}

// Métodos para reintentar cargar componentes
function retryLoadWidget() {
  if (widgetRetries.value > 0) {
    widgetRetries.value--;
    widgetStatus.value = 'loading';
    // Forzar recarga del componente
    // En un caso real, podríamos implementar una lógica más sofisticada
    setTimeout(() => {
      if (widgetStatus.value !== 'connected') {
        widgetStatus.value = 'error';
        loadError.value = true;
      }
    }, 3000);
  }
}

function retryLoadComponent() {
  if (componentRetries.value > 0) {
    componentRetries.value--;
    componentStatus.value = 'loading';
    // Forzar recarga del componente
    setTimeout(() => {
      if (componentStatus.value !== 'connected') {
        componentStatus.value = 'error';
        loadError.value = true;
      }
    }, 3000);
  }
}

// Ciclo de vida
onMounted(() => {
  // Simulamos un timeout para detectar errores de carga
  const widgetTimeout = setTimeout(() => {
    if (widgetStatus.value === 'loading') {
      widgetStatus.value = 'error';
      loadError.value = true;
    }
  }, 10000); // 10 segundos de timeout
  
  const componentTimeout = setTimeout(() => {
    if (componentStatus.value === 'loading') {
      componentStatus.value = 'error';
      loadError.value = true;
    }
  }, 10000); // 10 segundos de timeout
  
  // Limpiamos los timeouts al desmontar
  onUnmounted(() => {
    clearTimeout(widgetTimeout);
    clearTimeout(componentTimeout);
  });
});
</script>

<template>
  <div class="remote-component-view">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Componentes Remotos</h1>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
        <span 
          class="px-3 py-1 text-xs rounded-full" 
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': allComponentsLoaded,
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': !allComponentsLoaded && !loadError,
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': loadError
          }"
        >
          {{ loadStatusText }}
        </span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Widget Remoto -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Widget Remoto</h2>
        
        <Suspense @pending="handleWidgetPending" @resolve="handleWidgetResolved" @fallback="handleWidgetFallback">
          <template #default>
            <div>
              <RemoteWidget 
                title="Estadísticas" 
                :theme="uiStore.theme" 
                @remote-widget-mounted="handleWidgetMounted" 
              />
              <div v-if="widgetStatus" class="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span class="w-2 h-2 rounded-full mr-2" :class="{
                  'bg-green-500': widgetStatus === 'connected',
                  'bg-yellow-500': widgetStatus === 'loading',
                  'bg-red-500': widgetStatus === 'error'
                }"></span>
                {{ widgetStatusText }}
              </div>
            </div>
          </template>
          <template #fallback>
            <div class="flex flex-col justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-md">
              <svg class="animate-spin h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div class="text-gray-500 dark:text-gray-400">Cargando widget...</div>
              <button 
                v-if="widgetRetries > 0" 
                @click="retryLoadWidget" 
                class="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reintentar ({{ widgetRetries }})
              </button>
            </div>
          </template>
        </Suspense>
      </div>
      
      <!-- Componente Remoto -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-600"></div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Componente Remoto</h2>
        
        <Suspense @pending="handleComponentPending" @resolve="handleComponentResolved" @fallback="handleComponentFallback">
          <template #default>
            <div class="space-y-4">
              <RemoteComponent 
                :theme="uiStore.theme" 
                :initialValue="initialCounterValue"
                @remote-counter-updated="handleCounterUpdate" 
              />
              <div v-if="counterValue !== null" 
                class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm flex justify-between items-center"
              >
                <span>
                  Valor del contador remoto: <span class="font-semibold">{{ counterValue }}</span>
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Última actualización: {{ lastUpdateTime }}
                </span>
              </div>
            </div>
          </template>
          <template #fallback>
            <div class="flex flex-col justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-md">
              <svg class="animate-spin h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div class="text-gray-500 dark:text-gray-400">Cargando componente...</div>
              <button 
                v-if="componentRetries > 0" 
                @click="retryLoadComponent" 
                class="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reintentar ({{ componentRetries }})
              </button>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style scoped>
.remote-component-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>