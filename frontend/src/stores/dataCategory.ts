import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { configApi } from '@/api/configApi';

export const useDataCategoryStore = defineStore("dataCategory", () => {
    const config = ref(null);
    async function getAllConfigs(pagePagination: { page: number, size: number }) {
        try {
            const response = await configApi.getAllConfigs(pagePagination);
            if (response.status == 200) {
                config.value = response.data;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    return {
        config,
        getAllConfigs,
    };
});