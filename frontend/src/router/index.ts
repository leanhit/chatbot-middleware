import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.token && to.name === 'login') {
    return next({ name: 'home' });
  }

  if (!authStore.token && to.meta.requiresAuth) {
    return next({ name: 'login' });
  }

  next();
});

export default router;
