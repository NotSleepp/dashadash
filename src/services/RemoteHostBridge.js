/**
 * RemoteHostBridge.js
 * Servicio para gestionar la comunicación entre la aplicación host y las aplicaciones remotas
 */

// Tipos de eventos soportados
const EVENT_TYPES = {
  // Eventos del host al remoto
  HOST_TO_REMOTE: 'host-to-remote-event',
  
  // Eventos del remoto al host
  REMOTE_TO_HOST: {
    ADD_MENU_ITEM: 'add-dashboard-menu-item',
    WIDGET_MOUNTED: 'remote-widget-mounted',
    VIEW_READY: 'remote-view-ready',
    DATA_UPDATED: 'remote-data-updated',
    COUNTER_UPDATED: 'remote-counter-updated',
    NOTIFICATION: 'remote-notification',
    MODAL_OPEN: 'remote-modal-open',
    THEME_REQUEST: 'remote-theme-request'
  },
  
  // Acciones del host al remoto
  HOST_ACTIONS: {
    THEME_CHANGED: 'theme-changed',
    MENU_ITEM_ADDED: 'menu-item-added',
    REFRESH: 'refresh',
    NOTIFICATION_SHOWN: 'notification-shown',
    MODAL_OPENED: 'modal-opened'
  }
};

/**
 * Clase para gestionar la comunicación entre host y componentes remotos
 */
class RemoteHostBridge {
  constructor() {
    this.eventListeners = {};
    this.setupEventListeners();
  }

  /**
   * Configura los escuchadores de eventos para los componentes remotos
   */
  setupEventListeners() {
    // Registrar escuchadores para todos los tipos de eventos remotos
    Object.values(EVENT_TYPES.REMOTE_TO_HOST).forEach(eventType => {
      window.addEventListener(eventType, (event) => {
        this.handleRemoteEvent(eventType, event.detail);
      });
    });
  }

  /**
   * Maneja los eventos recibidos de componentes remotos
   * @param {string} eventType - Tipo de evento
   * @param {object} eventData - Datos del evento
   */
  handleRemoteEvent(eventType, eventData) {
    // Notificar a todos los escuchadores registrados para este tipo de evento
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(callback => {
        callback(eventData);
      });
    }
  }

  /**
   * Envía un evento a los componentes remotos
   * @param {string} action - Acción a realizar
   * @param {object} data - Datos adicionales
   */
  sendToRemote(action, data = {}) {
    window.dispatchEvent(new CustomEvent(EVENT_TYPES.HOST_TO_REMOTE, {
      detail: {
        action,
        ...data,
        timestamp: new Date().toISOString()
      }
    }));
  }

  /**
   * Registra un escuchador para un tipo de evento específico
   * @param {string} eventType - Tipo de evento
   * @param {function} callback - Función a llamar cuando ocurra el evento
   * @returns {function} - Función para eliminar el escuchador
   */
  on(eventType, callback) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    
    this.eventListeners[eventType].push(callback);
    
    // Devolver función para eliminar el escuchador
    return () => this.off(eventType, callback);
  }

  /**
   * Elimina un escuchador para un tipo de evento específico
   * @param {string} eventType - Tipo de evento
   * @param {function} callback - Función a eliminar
   */
  off(eventType, callback) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType] = this.eventListeners[eventType].filter(
        listener => listener !== callback
      );
    }
  }

  /**
   * Notifica a los componentes remotos sobre un cambio de tema
   * @param {string} theme - Tema actual ('light' o 'dark')
   * @param {object} themeVars - Variables CSS del tema
   */
  notifyThemeChange(theme, themeVars = {}) {
    this.sendToRemote(EVENT_TYPES.HOST_ACTIONS.THEME_CHANGED, { 
      theme,
      themeVars
    });
  }

  /**
   * Notifica a los componentes remotos que se ha añadido un elemento de menú
   * @param {string} id - ID del elemento de menú
   * @param {string} status - Estado de la operación ('success' o 'error')
   */
  notifyMenuItemAdded(id, status = 'success') {
    this.sendToRemote(EVENT_TYPES.HOST_ACTIONS.MENU_ITEM_ADDED, { id, status });
  }

  /**
   * Solicita a los componentes remotos que se actualicen
   */
  requestRefresh() {
    this.sendToRemote(EVENT_TYPES.HOST_ACTIONS.REFRESH);
  }

  /**
   * Notifica a los componentes remotos que se ha mostrado una notificación
   * @param {string} id - ID de la notificación
   * @param {string} status - Estado de la operación ('success' o 'error')
   */
  notifyNotificationShown(id, status = 'success') {
    this.sendToRemote(EVENT_TYPES.HOST_ACTIONS.NOTIFICATION_SHOWN, { id, status });
  }

  /**
   * Notifica a los componentes remotos que se ha abierto un modal
   * @param {string} id - ID del modal
   * @param {string} status - Estado de la operación ('success' o 'error')
   */
  notifyModalOpened(id, status = 'success') {
    this.sendToRemote(EVENT_TYPES.HOST_ACTIONS.MODAL_OPENED, { id, status });
  }
}

// Exportar una instancia única del servicio
export const remoteHostBridge = new RemoteHostBridge();

// Exportar tipos de eventos para uso en otros componentes
export { EVENT_TYPES };