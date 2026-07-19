import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import HomeView from '@/views/HomeView.vue'
import AuthCallback from '@/views/AuthCallbackView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/callback',
    component: AuthCallback
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach(async (to) => {

  const auth = useAuthStore()

  // User beim Start laden
  if (!auth.user) {
    await auth.loadUser()
  }

  // Geschützte Route
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    await auth.login()
    return false
  }

  return true
})


export default router