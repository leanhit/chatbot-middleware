// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ZoterDefault from '@/layouts/ZoterDefault.vue';

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
                path: '',
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
                path: 'create-configs',
                name: 'create-configs',
                component: () => import('@/views/create-configs/Index.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'generate-embed-code',
                name: 'generate-embed-code',
                component: () =>
                    import('@/views/generate-embed-code/Index.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/views/profile/Index.vue'),
                meta: { requiresAuth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // Nếu đã đăng nhập mà vào lại login → chuyển về home
    if (authStore.token && to.name === 'login') {
        return next({ name: 'home' });
    }

    // Nếu chưa đăng nhập mà vào trang yêu cầu auth
    if (!authStore.token && to.meta.requiresAuth) {
        return next({ name: 'login' });
    }

    next();
});

export default router;
