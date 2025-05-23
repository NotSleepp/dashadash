import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // Estado
  const theme = ref(localStorage.getItem('theme') || 'light');
  const isSidebarCollapsed = ref(localStorage.getItem('isSidebarCollapsed') === 'true');
  const menuItems = ref(JSON.parse(localStorage.getItem('menuItems') || '[]'));

  // Getters
  const sortedMenuItems = computed(() => {
    return [...menuItems.value].sort((a, b) => {
      // Ordenar por la propiedad order si existe, de lo contrario por label
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      } else if (a.order !== undefined) {
        return -1;
      } else if (b.order !== undefined) {
        return 1;
      }
      return a.label.localeCompare(b.label);
    });
  });

  // Acciones
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
  }

  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    localStorage.setItem('isSidebarCollapsed', isSidebarCollapsed.value);
  }

  function loadMenuItems() {
    // Cargar elementos del menú desde localStorage o inicializar con valores predeterminados
    if (menuItems.value.length === 0) {
      // Elementos de menú predeterminados
      const defaultMenuItems = [
        { id: 'home', label: 'Inicio', path: '/dashboard', icon: 'home', order: 1 },
        { id: 'profile', label: 'Perfil', path: '/dashboard/perfil', icon: 'user', order: 2 },
      ];
      menuItems.value = defaultMenuItems;
      localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
    }
  }

  function addMenuItem(item) {
    // Verificar si el ítem ya existe por ID
    const existingIndex = menuItems.value.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Actualizar el ítem existente
      menuItems.value[existingIndex] = { ...menuItems.value[existingIndex], ...item };
    } else {
      // Añadir nuevo ítem
      menuItems.value.push(item);
    }
    
    // Persistir en localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems.value));
  }

  return {
    // Estado
    theme,
    isSidebarCollapsed,
    menuItems,
    
    // Getters
    sortedMenuItems,
    
    // Acciones
    toggleTheme,
    toggleSidebar,
    loadMenuItems,
    addMenuItem
  };
});