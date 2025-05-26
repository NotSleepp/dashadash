<script setup>
import { onMounted, ref } from 'vue';
import { useUiStore } from './store/ui.store';
import { remoteHostBridge, EVENT_TYPES } from './services/RemoteHostBridge';
import { themeService } from './services/ThemeService';
import ToastContainer from './components/ui/ToastContainer.vue';
import ModalContainer from './components/ui/ModalContainer.vue';

const uiStore = useUiStore();
const remoteComponentsStatus = ref({});
const toastContainerRef = ref(null);
const modalContainerRef = ref(null);

/**
 * Manejador para eventos de componentes remotos
 */
function setupRemoteEventHandlers() {
  // Manejar evento de añadir elemento de menú
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.ADD_MENU_ITEM, (eventData) => {
    if (eventData) {
      uiStore.addMenuItem(eventData);
      remoteHostBridge.notifyMenuItemAdded(eventData.id, 'success');
    }
  });
  
  // Manejar evento de widget montado
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.WIDGET_MOUNTED, (eventData) => {
    if (eventData && eventData.id) {
      remoteComponentsStatus.value[eventData.id] = { 
        ...remoteComponentsStatus.value[eventData.id],
        mounted: true,
        lastUpdate: new Date()
      };
      // Enviamos el tema actual al widget que acaba de montarse
      themeService.notifyRemoteComponents();
    }
  });
  
  // Manejar evento de vista remota lista
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.VIEW_READY, (eventData) => {
    if (eventData && eventData.id) {
      remoteComponentsStatus.value[eventData.id] = { 
        ...remoteComponentsStatus.value[eventData.id],
        ready: true,
        lastUpdate: new Date()
      };
      // Enviamos el tema actual a la vista que acaba de estar lista
      themeService.notifyRemoteComponents();
    }
  });
  
  // Manejar evento de datos actualizados
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.DATA_UPDATED, (eventData) => {
    if (eventData && eventData.metrics) {
      console.log('Datos actualizados desde componente remoto:', eventData.metrics);
      // Aquí podríamos actualizar algún estado global con estos datos si fuera necesario
    }
  });
  
  // Manejar evento de contador actualizado
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.COUNTER_UPDATED, (eventData) => {
    if (eventData && typeof eventData.value === 'number') {
      console.log('Contador remoto actualizado:', eventData.value);
      // Aquí podríamos actualizar algún estado global con este valor si fuera necesario
    }
  });
  
  // Manejar evento de notificación
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.NOTIFICATION, (eventData) => {
    if (eventData && eventData.message && toastContainerRef.value) {
      toastContainerRef.value.addNotification({
        ...eventData,
        source: 'remote'
      });
    }
  });
  
  // Manejar evento de abrir modal
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.MODAL_OPEN, (eventData) => {
    if (eventData && modalContainerRef.value) {
      modalContainerRef.value.openModal({
        ...eventData,
        source: 'remote'
      });
    }
  });
}

/**
 * Métodos para mostrar notificaciones
 */
function showNotification(notification) {
  if (toastContainerRef.value) {
    return toastContainerRef.value.addNotification(notification);
  }
  return null;
}

/**
 * Métodos para gestionar modales
 */
function openModal(modalData) {
  if (modalContainerRef.value) {
    return modalContainerRef.value.openModal(modalData);
  }
  return null;
}

function closeModal(id) {
  if (modalContainerRef.value) {
    modalContainerRef.value.closeModal(id);
  }
}

// Exponer métodos para uso global
defineExpose({
  showNotification,
  openModal,
  closeModal
});

onMounted(() => {
  // Cargar elementos del menú
  uiStore.loadMenuItems();
  
  // Configurar manejadores de eventos para componentes remotos
  setupRemoteEventHandlers();
});

</script>

<template>
  <router-view />
  
  <!-- Contenedor de notificaciones -->
  <ToastContainer ref="toastContainerRef" />
  
  <!-- Contenedor de modales -->
  <ModalContainer ref="modalContainerRef" />
</template>

<style scoped>
/* Estilos globales para la aplicación */
</style>
