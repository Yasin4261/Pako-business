import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
  ],
})

// Navigation guard - using modern return syntax
router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guestOnly

  if (requiresAuth && !isAuthenticated) {
    return '/login'
  }
  
  if (guestOnly && isAuthenticated) {
    return '/'
  }
  
  // Allow navigation
  return true
})

export default router
