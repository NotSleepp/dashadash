import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userFullName = computed(() => {
    return user.value ? `${user.value.nombre} ${user.value.apellido}` : '';
  });

  // Acciones
  function login(credentials) {
    // En un caso real, aquí se haría una llamada a la API
    // Simulamos una autenticación exitosa
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: 1,
          nombre: 'Usuario',
          apellido: 'Argentino',
          email: credentials.email,
          rol: 'admin'
        };
        
        const authToken = 'jwt-token-simulado-' + Math.random().toString(36).substring(2);
        
        // Guardar en el estado
        user.value = userData;
        token.value = authToken;
        
        // Persistir en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        
        resolve({ user: userData, token: authToken });
      }, 500);
    });
  }

  function logout() {
    // Limpiar estado
    user.value = null;
    token.value = '';
    
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  function checkAuth() {
    // Verificar si hay un token válido
    // En un caso real, aquí se verificaría la validez del token con el backend
    return isAuthenticated.value;
  }

  return {
    // Estado
    user,
    token,
    
    // Getters
    isAuthenticated,
    userFullName,
    
    // Acciones
    login,
    logout,
    checkAuth
  };
});