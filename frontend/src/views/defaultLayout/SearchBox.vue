<template>
    <div
        class="hidden md:flex items-center border rounded-full py-2 px-4 shadow-sm hover:shadow-md cursor-pointer w-[450px] transition bg-white">
        <input
            v-model="searchQuery"
            @keyup.enter="updateSearch"
            type="text"
            :placeholder="t('search.placeholder')"
            class="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
        <button
            @click="updateSearch"
            class="ml-2 text-gray-500 hover:text-gray-700 transition">
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const searchStore = useSearchStore();
const searchQuery = computed({
    get: () => searchStore.query,
    set: (val) => searchStore.setQuery(val),
});

const updateSearch = () => {
    const currentPath = route.path;

    if (currentPath.startsWith('/lease')) {
        // Gọi hàm tìm kiếm trong trang lease
        searchStore.setQuery(searchQuery.value);
    } else if (currentPath.startsWith('/admin')) {
        // Xử lý tìm kiếm riêng nếu cần
    }
};
</script>