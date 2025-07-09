// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ZoterDefault from '@/layouts/ZoterDefault.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: ZoterDefault,
    name: 'LayoutZoter',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/views/help/Index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'configs',
        name: 'configs',
        component: () => import('@/views/configs/Index.vue'),
        meta: { requiresAuth: true },
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Nếu đã đăng nhập mà vào lại login → chuyển về home
  if (authStore.token && to.name === 'login') {
    return next({ name: 'home' })
  }

  // Nếu chưa đăng nhập mà vào trang yêu cầu auth
  if (!authStore.token && to.meta.requiresAuth) {
    return next({ name: 'login' })
  }

  next()
})

export default router
