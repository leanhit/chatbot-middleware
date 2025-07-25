// ✅ Đúng — dùng instance đã setup baseURL và interceptor
import axios from '@/plugins/axios';

export const configApi = {
    getConfigByID(configId: string) {
        return axios.get(`/configs/${configId}`);
    },

    updateConfig(configId: string, params: any) {
        return axios.put(`/configs/${configId}`, params);
    },

    deleteConfig(configId: string) {
        return axios.delete(`/configs/${configId}`);
    },

    getAllConfigs(params: any) {
        return axios.get(`/configs`, params);
    },

    addConfig(params: any) {
        return axios.post(`/configs`, params);
    },

};
