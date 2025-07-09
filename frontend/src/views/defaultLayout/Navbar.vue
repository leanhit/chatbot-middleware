<template>
    <nav
        class="flex items-center justify-between p-2 border-b shadow-sm bg-white sticky top-0 z-50">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-pink-600">
            <img
                src="@/assets/botpress-logo.png"
                alt="Logo"
                class="h-8 inline-block mr-2" />
        </router-link>

        <!-- Search -->
        <!--<div
            class="hidden md:flex items-center border rounded-full py-2 px-4 shadow-sm hover:shadow-md cursor-pointer w-[450px] transition">
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
        </div>-->
        <!-- Search box center -->
        <div class="flex-1 flex justify-center">
            <SearchBox />
        </div>

        <!-- Right Menu -->
        <div class="flex items-center gap-4">
            <!-- Globe Icon -->
            <div class="relative" ref="globeMenu">
                <button
                    @click.stop="toggleGlobeDropdown"
                    class="w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
                    <div class="w-6 h-6 flex items-center justify-center">
                        <span
                            class="w-5 h-5 flex items-center justify-center"
                            v-html="currentFlag">
                        </span>
                    </div>
                </button>

                <!-- Dropdown menu -->
                <div
                    v-if="globeDropdownVisible"
                    class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul class="py-2">
                        <!-- Languages -->
                        <li
                            v-for="(item, index) in local.supportedLocales"
                            :key="'lang-' + index"
                            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            @click="changeLocale(item.value)">
                            <div class="flex items-center gap-2">
                                <span
                                    class="w-5 h-5 flex items-center justify-center"
                                    v-html="item.flag">
                                </span>
                                {{ item.label }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- User Menu -->
            <div class="relative" ref="dropdownMenu">
                <div
                    class="flex items-center gap-2 border rounded-full p-2 hover:shadow-md cursor-pointer"
                    @click.stop="toggleDropdown">
                    <svg
                        class="w-5 h-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M2.5 5a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5zM2 10a.5.5 0 01.5-.5h15a.5.5 0 010 1h-15A.5.5 0 012 10zm.5 4.5a.5.5 0 000 1h15a.5.5 0 000-1h-15z" />
                    </svg>
                </div>

                <div
                    v-if="dropdownVisible"
                    class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                    <ul class="py-2">
                        <template v-if="isAuthenticated">
                            <li
                                class="p-3 border-b border-gray-200 flex items-center space-x-3">
                                <div>
                                    <p class="font-semibold text-gray-800">{{ user.email }}</p>
                                </div>
                            </li>
                            <li
                                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <router-link
                                    to="/help"
                                    class="block w-full h-full">
                                    {{ t('Help') }}
                                </router-link>
                            </li>

                            <li class="border-t my-2"></li>

                            <li
                                @click="handleLogout"
                                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                Logout
                            </li>
                        </template>
                        <template v-else>
                            <li
                                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <router-link
                                    to="/login"
                                    class="block w-full h-full">
                                    Login
                                </router-link>
                            </li>
                            <li
                                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <router-link
                                    to="/register"
                                    class="block w-full h-full">
                                    Sign Up
                                </router-link>
                            </li>
                            <li class="border-t my-2"></li>
                            <li
                                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <router-link
                                    to="/help"
                                    class="block w-full h-full">
                                    Help
                                </router-link>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang='ts'>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { useI18n } from 'vue-i18n';
import local from '@/plugins/supportedLocales';
import SearchBox from './SearchBox.vue';
import { useAuthStore } from '@/stores/auth';
export default {
    components: {
        SearchBox,
    },
    setup(props, context) {
        const { t, locale } = useI18n();
        const router = useRouter();
        const route = useRoute();

        // Auth store
        const authStore = useAuthStore();
        const { token, user } = storeToRefs(authStore);
        const isAuthenticated = computed(() => !!token.value);
        
        //console.log('user', user.value);
        // Dropdown visibility
        const dropdownVisible = ref(false);
        const globeDropdownVisible = ref(false);
        const dropdownMenu = ref<HTMLElement | null>(null);
        const globeMenu = ref<HTMLElement | null>(null);

        // Locale & Currency
        const currentLocale = ref(local.currentLanguage);

        const currentFlag = ref('');
        const searchStore = useSearchStore();
        const searchQuery = computed({
            get: () => searchStore.query,
            set: (val) => searchStore.setQuery(val),
        });

        const updateSearch = () => {
            const currentPath = route.path;

            if (currentPath.startsWith('/lease')) {
                // Gọi hàm tìm kiếm trong trang lease
                searchStore.setQuery(searchQuery.value); // hoặc emit sự kiện
            } else if (currentPath.startsWith('/admin')) {
                // Tìm kiếm trong dashboard admin
            }
            // ...
        };
        const setFlag = () => {
            const found = local.supportedLocales.find(lo => lo.value === currentLocale.value);
            currentFlag.value = found ? found.flag : local.supportedLocales[0].flag;
        };
        setFlag();

        const changeLocale = (newLocale: string) => {
            localStorage.setItem('appLocale', newLocale);
            currentLocale.value = newLocale;
            locale.value = newLocale;
            setFlag(); // cập nhật flag khi đổi ngôn ngữ
            toggleGlobeDropdown();
        };

        // Toggle dropdown
        function toggleDropdown() {
            dropdownVisible.value = !dropdownVisible.value;
            globeDropdownVisible.value = false;
        }

        function toggleGlobeDropdown() {
            globeDropdownVisible.value = !globeDropdownVisible.value;
            dropdownVisible.value = false;
        }

        // Click outside để đóng menu
        function handleClickOutside(event: MouseEvent) {
            const isClickInsideDropdown = dropdownMenu.value?.contains(event.target as Node);
            const isClickInsideGlobe = globeMenu.value?.contains(event.target as Node);

            if (!isClickInsideDropdown && !isClickInsideGlobe) {
                dropdownVisible.value = false;
                globeDropdownVisible.value = false;
            }
        }

        // Logout
        function handleLogout() {
            authStore.logout();
            router.push('/login');
        }

        // Mount/unmount events
        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            t,
            dropdownVisible,
            globeDropdownVisible,
            dropdownMenu,
            globeMenu,
            isAuthenticated,
            toggleDropdown,
            toggleGlobeDropdown,
            handleClickOutside,
            handleLogout,
            changeLocale,
            currentLocale,
            currentFlag,
            local,
            searchQuery,
            updateSearch,
            user
        };
    }
};
</script>