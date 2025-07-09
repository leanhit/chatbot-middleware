import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ListData: defineAsyncComponent({
            loader: () => import('@/views/configs/components/List.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddConfig: defineAsyncComponent({
            loader: () => import('@/views/configs/components/AddConfig.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditConfig: defineAsyncComponent({
            loader: () => import('@/views/configs/components/AddConfig.vue'),
            loadingComponent: SkeletonBox,
        })
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        const currentComponent = ref('ListData');
        const viewSettings = ref({
            viewName: 'ListData',
            title: t('Configs '),
            dataItem: null,
        });
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case 'ListData':
                        viewSettings.value = {
                            viewName: 'ListData',
                            title: t("Configs"),
                            dataItem: null,
                        };
                        break;
                    case 'AddConfig':
                        viewSettings.value = {
                            viewName: 'AddConfig',
                            title: t('Add Config'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'EditConfig':
                        viewSettings.value = {
                            viewName: 'EditConfig',
                            title: t('Edit Config'),
                            dataItem: paramsObject.data,
                        };
                        break;
                }
                await nextTick();
                currentComponent.value = paramsObject.viewName;
                isChangeViewLoading.value = false;
            }, 100);
        };
        return {
            isChangeViewLoading,
            currentComponent,
            viewSettings,
            changeView,
        };
    },
};