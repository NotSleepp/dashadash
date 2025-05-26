import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout.vue';

// Vistas
const HomeView = () => import('../views/HomeView.vue');
const LoginView = () => import('../views/LoginView.vue');
const ProfileView = () => import('../views/ProfileView.vue');

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { title: 'Inicio' }
      },
      {
        path: 'perfil',
        name: 'profile',
        component: ProfileView,
        meta: { title: 'Perfil' }
      },
      // Rutas para Remotes (serán cargadas dinámicamente)
      // Ejemplo:
      // {
      //   path: 'administrador/usuarios',
      //   name: 'admin-users',
      //   component: () => import('adminApp/UserManagementPage'),
      //   meta: { title: 'Gestión de Usuarios' }
      // },
      {
        path: 'remote',
        name: 'remote-view',
        component: () => import('remoteApp/RemoteView'),
        meta: { title: 'Vista Remota' }
      },
      {        path: 'remote-component',
        name: 'remote-component',
        component: () => import('../views/RemoteComponentView.vue'),
        meta: { title: 'Componente Remoto' }
      },
      {
        path: 'remote-example',
        name: 'remote-example',
        component: () => import('../views/RemoteExampleView.vue'),
        meta: { title: 'Ejemplo Remoto Mejorado' }
      }
    ]
  },
  // Ruta para manejar 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardia de navegación para verificar autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirigir a login si la ruta requiere autenticación y el usuario no está autenticado
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Redirigir al dashboard si el usuario ya está autenticado e intenta acceder al login
    next({ path: '/dashboard' });
  } else {
    // Continuar normalmente
    next();
  }
});

export default router;