/**
 * ThemeService.js
 * Servicio para gestionar los temas de la aplicación y proporcionar información
 * completa sobre el tema a los componentes remotos
 */

import { ref, computed, watch } from 'vue';
import { remoteHostBridge, EVENT_TYPES } from './RemoteHostBridge';

// Temas disponibles
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Variables CSS para cada tema
const THEME_VARIABLES = {
  [THEMES.LIGHT]: {
    '--color-bg-primary': '#ffffff',
    '--color-bg-secondary': '#f3f4f6',
    '--color-text-primary': '#1f2937',
    '--color-text-secondary': '#4b5563',
    '--color-accent': '#3b82f6',
    '--color-border': '#e5e7eb',
    '--color-success': '#10b981',
    '--color-error': '#ef4444',
    '--color-warning': '#f59e0b',
    '--color-info': '#3b82f6'
  },
  [THEMES.DARK]: {
    '--color-bg-primary': '#111827',
    '--color-bg-secondary': '#1f2937',
    '--color-text-primary': '#f9fafb',
    '--color-text-secondary': '#d1d5db',
    '--color-accent': '#60a5fa',
    '--color-border': '#374151',
    '--color-success': '#34d399',
    '--color-error': '#f87171',
    '--color-warning': '#fbbf24',
    '--color-info': '#60a5fa'
  }
};

/**
 * Clase para gestionar los temas de la aplicación
 */
class ThemeService {
  constructor() {
    // Estado reactivo para el tema actual
    this.currentTheme = ref(localStorage.getItem('theme') || THEMES.LIGHT);
    
    // Variables CSS del tema actual
    this.themeVars = computed(() => THEME_VARIABLES[this.currentTheme.value]);
    
    // Configurar observador para cambios en el tema
    this.setupThemeWatcher();
    
    // Configurar escuchador para solicitudes de tema de componentes remotos
    this.setupRemoteEventListeners();
  }

  /**
   * Configura un observador para cambios en el tema
   */
  setupThemeWatcher() {
    watch(
      () => this.currentTheme.value,
      (newTheme) => {
        // Actualizar la clase en el documento
        if (newTheme === THEMES.DARK) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Persistir en localStorage
        localStorage.setItem('theme', newTheme);
        
        // Notificar a los componentes remotos
        this.notifyRemoteComponents();
      },
      { immediate: true }
    );
  }

  /**
   * Configura escuchadores para eventos de componentes remotos
   */
  setupRemoteEventListeners() {
    remoteHostBridge.on(EVENT_TYPES.REMOTE_TO_HOST.THEME_REQUEST, () => {
      this.notifyRemoteComponents();
    });
  }

  /**
   * Notifica a los componentes remotos sobre el tema actual
   */
  notifyRemoteComponents() {
    remoteHostBridge.notifyThemeChange(
      this.currentTheme.value,
      this.themeVars.value
    );
  }

  /**
   * Cambia el tema de la aplicación
   */
  toggleTheme() {
    this.currentTheme.value = this.currentTheme.value === THEMES.LIGHT 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  }

  /**
   * Establece un tema específico
   * @param {string} theme - Tema a establecer ('light' o 'dark')
   */
  setTheme(theme) {
    if (theme === THEMES.LIGHT || theme === THEMES.DARK) {
      this.currentTheme.value = theme;
    }
  }
}

// Exportar una instancia única del servicio
export const themeService = new ThemeService();

// Exportar constantes para uso en otros componentes
export { THEMES, THEME_VARIABLES };