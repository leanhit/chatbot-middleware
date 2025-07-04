// ✅ Đúng — dùng instance đã setup baseURL và interceptor
import axios from '@/plugins/axios';

export const usersApi = {
    login(params: any) {
        return axios.post('/auth/login', params);
    },

    register(params: any) {
        return axios.post('/auth/register', params);
    },

    checkEmail(email: string) {
        return axios.get('/auth/check-email', {
            params: { email },
        });
    },
};
