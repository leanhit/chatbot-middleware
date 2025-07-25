import { useI18n } from "vue-i18n";
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { filterDataFunction, splitData, formatDateTime } from "@/scripts/create-configs/components/search";
import { configApi } from "@/api/configApi";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useSearchStore } from "@/stores/search";


export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const searchStore = useSearchStore();

        const filterData = ref("");
        const filter = ref("ALL");
        const listItems = ref([]);
        const isLoading = ref(false);
        const tempList = ref([]);

        const configDetail = reactive({
            id: "",
            botpress_bot_id: "",
            page_id: "",
            verify_token: "",
            app_secret: "",
            page_access_token: "",
            fanpage_url: "",
            bot_url: "",
            bot_name: "",
        });

        const pagePagination = reactive({
            pageSize: 15,
            currentPage: 1,
            totalItems: 0,
        });

        refreshDataFn();

        async function refreshDataFn() {
            tempList.value = [];
            listItems.value = [];

            await categoryStore.getAllConfigs({ page: 999, size: 999 });
            tempList.value = categoryStore.config.content;

            pagePagination.totalItems = categoryStore.config.totalItems;

            listItems.value = tempList.value;
        }

        const deleteConfig = (id: any) => {
            ElMessageBox.confirm(t("Are you sure you want to delete this config?"), t("Warning"), {
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: "warning",
            })
                .then(async () => {
                    isLoading.value = true;
                    try {
                        await configApi.deleteConfig(id);
                        ElMessage.success(t("Config deleted successfully"));
                        await refreshDataFn();
                        listItems.value = splitData(categoryStore.config.content, pagePagination);
                    } catch (error) {
                        ElMessage.error(t("Failed to delete config"));
                    } finally {
                        isLoading.value = false;
                    }
                })
                .catch(() => {
                    ElMessage.info(t("Delete action cancelled"));
                });
        };

        watch(
            () => searchStore.query,
            (newVal) => {
                console.log("Search query changed:", newVal);
                if (!newVal) {
                    listItems.value = tempList.value; // Nếu xóa ô search thì show lại full list
                } else {
                    listItems.value = filterDataFunction(newVal, tempList.value);
                }
            }
        );



        //watch(filterData, () => (listItems.value = filterDataFunction(filterData.value, tempList.value)));

        const handleSizeChange = (size: number) => {
            pagePagination.pageSize = size;
            listItems.value = splitData(tempList.value, pagePagination);
        };

        const handleCurrentChange = (page: number) => {
            pagePagination.currentPage = page;
            listItems.value = splitData(tempList.value, pagePagination);
        };

        return {
            t,
            pagePagination,
            handleCurrentChange,
            handleSizeChange,
            isLoading,
            listItems,
            filterData,
            refreshDataFn,
            configDetail,
            filter,
            deleteConfig,
            formatDateTime
        };
    },
};