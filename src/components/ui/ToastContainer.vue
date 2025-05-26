<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { remoteHostBridge, EVENT_TYPES } from '../../services/RemoteHostBridge';

// Estado para las notificaciones
const notifications = ref([]);

// Tipos de notificaciones soportados
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Duración predeterminada de las notificaciones en ms
const DEFAULT_DURATION = 5000;

/**
 * Añade una nueva notificación
 * @param {object} notification - Datos de la notificación
 */
function addNotification(notification) {
  // Generar un ID único si no se proporciona
  const id = notification.id || `toast-${Date.now()}`;
  
  // Configurar la notificación con valores predeterminados
  const newNotification = {
    id,
    title: notification.title || '',
    message: notification.message || '',
    type: notification.type || NOTIFICATION_TYPES.INFO,
    duration: notification.duration || DEFAULT_DURATION,
    timestamp: new Date(),
    source: notification.source || 'host',
    visible: true
  };
  
  // Añadir la notificación al array
  notifications.value.push(newNotification);
  
  // Configurar el temporizador para eliminar la notificación
  if (newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  }
  
  // Si la notificación proviene de un componente remoto, notificar que se ha mostrado
  if (notification.source === 'remote') {
    remoteHostBridge.notifyNotificationShown(id, 'success');
  }
  
  return id;
}

/**
 * Elimina una notificación por su ID
 * @param {string} id - ID de la notificación
 */
function removeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    // Marcar como no visible para la animación de salida
    notifications.value[index].visible = false;
    
    // Eliminar después de la animación
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id);
    }, 300);
  }
}

/**
 * Manejador de eventos para notificaciones de componentes remotos
 * @param {object} data - Datos de la notificación
 */
function handleRemoteNotification(data) {
  if (data && data.message) {
    addNotification({
      ...data,
      source: 'remote'
    });
  }
}

// Exponer métodos para uso en otros componentes
defineExpose({
  addNotification,
  removeNotification,
  NOTIFICATION_TYPES
});

// Ciclo de vida
onMounted(() => {
  // Registrar escuchador para notificaciones de componentes remotos
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.NOTIFICATION, handleRemoteNotification);
});

onBeforeUnmount(() => {
  // Limpiar escuchadores
  remoteHostBridge.off(EVENT_TYPES.REMOTE_TO_HOST.NOTIFICATION, handleRemoteNotification);
});
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="[
          'toast', 
          `toast-${notification.type}`,
          { 'toast-visible': notification.visible }
        ]"
        @click="removeNotification(notification.id)"
      >
        <div class="toast-icon" v-if="notification.type === NOTIFICATION_TYPES.SUCCESS">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="toast-icon" v-else-if="notification.type === NOTIFICATION_TYPES.ERROR">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="toast-icon" v-else-if="notification.type === NOTIFICATION_TYPES.WARNING">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="toast-icon" v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="toast-content">
          <div class="toast-title" v-if="notification.title">{{ notification.title }}</div>
          <div class="toast-message">{{ notification.message }}</div>
        </div>
        <button class="toast-close" @click.stop="removeNotification(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-visible {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  background-color: var(--color-bg-primary);
  border-left: 4px solid #10b981;
}

.toast-error {
  background-color: var(--color-bg-primary);
  border-left: 4px solid #ef4444;
}

.toast-warning {
  background-color: var(--color-bg-primary);
  border-left: 4px solid #f59e0b;
}

.toast-info {
  background-color: var(--color-bg-primary);
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.toast-message {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
}

.toast-close svg {
  width: 1rem;
  height: 1rem;
}

/* Animaciones */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>