<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { remoteHostBridge, EVENT_TYPES } from '../../services/RemoteHostBridge';

// Estado para los modales
const modals = ref([]);
const activeModalId = ref(null);

/**
 * Abre un nuevo modal
 * @param {object} modalData - Datos del modal
 */
function openModal(modalData) {
  // Generar un ID único si no se proporciona
  const id = modalData.id || `modal-${Date.now()}`;
  
  // Configurar el modal con valores predeterminados
  const newModal = {
    id,
    title: modalData.title || '',
    content: modalData.content || '',
    component: modalData.component || null,
    componentProps: modalData.componentProps || {},
    size: modalData.size || 'md', // 'sm', 'md', 'lg', 'xl'
    persistent: modalData.persistent || false,
    source: modalData.source || 'host',
    onConfirm: modalData.onConfirm || null,
    onCancel: modalData.onCancel || null,
    confirmText: modalData.confirmText || 'Aceptar',
    cancelText: modalData.cancelText || 'Cancelar',
    showFooter: modalData.showFooter !== undefined ? modalData.showFooter : true
  };
  
  // Añadir el modal al array
  modals.value.push(newModal);
  
  // Establecer como modal activo
  activeModalId.value = id;
  
  // Si el modal proviene de un componente remoto, notificar que se ha abierto
  if (modalData.source === 'remote') {
    remoteHostBridge.notifyModalOpened(id, 'success');
  }
  
  return id;
}

/**
 * Cierra un modal por su ID
 * @param {string} id - ID del modal
 */
function closeModal(id) {
  const modalId = id || activeModalId.value;
  if (!modalId) return;
  
  const index = modals.value.findIndex(m => m.id === modalId);
  if (index !== -1) {
    modals.value.splice(index, 1);
    
    // Actualizar el modal activo
    if (modals.value.length > 0) {
      activeModalId.value = modals.value[modals.value.length - 1].id;
    } else {
      activeModalId.value = null;
    }
  }
}

/**
 * Confirma un modal y ejecuta su callback onConfirm
 * @param {string} id - ID del modal
 */
function confirmModal(id) {
  const modalId = id || activeModalId.value;
  if (!modalId) return;
  
  const modal = modals.value.find(m => m.id === modalId);
  if (modal && typeof modal.onConfirm === 'function') {
    modal.onConfirm();
  }
  
  closeModal(modalId);
}

/**
 * Cancela un modal y ejecuta su callback onCancel
 * @param {string} id - ID del modal
 */
function cancelModal(id) {
  const modalId = id || activeModalId.value;
  if (!modalId) return;
  
  const modal = modals.value.find(m => m.id === modalId);
  if (modal && typeof modal.onCancel === 'function') {
    modal.onCancel();
  }
  
  closeModal(modalId);
}

/**
 * Manejador de eventos para modales de componentes remotos
 * @param {object} data - Datos del modal
 */
function handleRemoteModalOpen(data) {
  if (data) {
    openModal({
      ...data,
      source: 'remote'
    });
  }
}

// Exponer métodos para uso en otros componentes
defineExpose({
  openModal,
  closeModal,
  confirmModal,
  cancelModal
});

// Ciclo de vida
onMounted(() => {
  // Registrar escuchador para modales de componentes remotos
  remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.MODAL_OPEN, handleRemoteModalOpen);
  
  // Añadir escuchador para la tecla Escape
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  // Limpiar escuchadores
  remoteHostBridge.off(EVENT_TYPES.REMOTE_TO_HOST.MODAL_OPEN, handleRemoteModalOpen);
  window.removeEventListener('keydown', handleKeyDown);
});

/**
 * Manejador para eventos de teclado
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyDown(event) {
  if (event.key === 'Escape' && activeModalId.value) {
    const modal = modals.value.find(m => m.id === activeModalId.value);
    if (modal && !modal.persistent) {
      cancelModal(activeModalId.value);
    }
  }
}

/**
 * Manejador para clics en el backdrop
 * @param {MouseEvent} event - Evento de clic
 */
function handleBackdropClick(event, modalId) {
  const modal = modals.value.find(m => m.id === modalId);
  if (modal && !modal.persistent && event.target === event.currentTarget) {
    cancelModal(modalId);
  }
}
</script>

<template>
  <teleport to="body">
    <transition-group name="modal">
      <div 
        v-for="modal in modals" 
        :key="modal.id"
        class="modal-backdrop"
        @click="handleBackdropClick($event, modal.id)"
      >
        <div 
          class="modal-container"
          :class="[`modal-${modal.size}`]"
          @click.stop
        >
          <div class="modal-header">
            <h3 class="modal-title">{{ modal.title }}</h3>
            <button 
              v-if="!modal.persistent"
              class="modal-close"
              @click="closeModal(modal.id)"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <!-- Contenido estático -->
            <div v-if="modal.content" v-html="modal.content"></div>
            
            <!-- Componente dinámico -->
            <component 
              v-else-if="modal.component" 
              :is="modal.component"
              v-bind="modal.componentProps"
            />
          </div>
          
          <div v-if="modal.showFooter" class="modal-footer">
            <button 
              class="modal-btn modal-btn-cancel"
              @click="cancelModal(modal.id)"
            >
              {{ modal.cancelText }}
            </button>
            <button 
              class="modal-btn modal-btn-confirm"
              @click="confirmModal(modal.id)"
            >
              {{ modal.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background-color: var(--color-bg-primary);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-sm {
  width: 24rem;
  max-width: 90%;
}

.modal-md {
  width: 32rem;
  max-width: 90%;
}

.modal-lg {
  width: 48rem;
  max-width: 90%;
}

.modal-xl {
  width: 64rem;
  max-width: 90%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: var(--color-bg-secondary);
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  color: var(--color-text-primary);
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  gap: 0.75rem;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-btn-cancel {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.modal-btn-cancel:hover {
  background-color: var(--color-border);
}

.modal-btn-confirm {
  background-color: var(--color-accent);
  color: white;
  border: 1px solid transparent;
}

.modal-btn-confirm:hover {
  background-color: color-mix(in srgb, var(--color-accent) 80%, black);
}

/* Animaciones */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>