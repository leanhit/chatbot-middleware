import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus';
import { configApi } from '@/api/configApi';
import { useI18n } from 'vue-i18n';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const menu = ref({});
        const isLoading = ref(false);
        const viewName = ref("");
        const formRef = ref<FormInstance>();
        const itemModel = ref({
            id: '',
            botpress_bot_id: '',
            page_id: '',
            verify_token: '',
            app_secret: '',
            page_access_token: '',
            fanpage_url: '',
            bot_url: '',
            bot_name: '',
            created_at: ''
        })

        // Form validation rules
        const rules = {
            botpress_bot_id: [{ required: true, message: 'Botpress Bot ID là bắt buộc', trigger: 'blur' }],
            page_id: [{ required: true, message: 'Page ID là bắt buộc', trigger: 'blur' }],
            verify_token: [{ required: true, message: 'Verify Token là bắt buộc', trigger: 'blur' }],
            app_secret: [{ required: true, message: 'App Secret là bắt buộc', trigger: 'blur' }],
            page_access_token: [{ required: true, message: 'Page Access Token là bắt buộc', trigger: 'blur' }],
            bot_url: [{ required: true, message: 'Bot URL là bắt buộc', trigger: 'blur' }],
            fanpage_url: [{ required: true, message: 'Fanpage URL là bắt buộc', trigger: 'blur' }],
            bot_name: [{ required: true, message: 'Tên bot là bắt buộc', trigger: 'blur' }],
        }

        onMounted(() => {
            viewName.value = props.viewSettings.viewName;

            console.log("viewName", viewName.value);

            if (viewName.value === 'AddConfig') {
                itemModel.value.id = "";
            } else if (viewName.value === 'EditConfig') {
                itemModel.value = props.viewSettings.dataItem;

            } else if (viewName.value === 'CloneConfig') {
                itemModel.value = props.viewSettings.dataItem;

            } else {
                console.log("Something went wrong")!
            }
        });

        function onSubmit(formEl: FormInstance | undefined) {
            isLoading.value = true;

            console.log("itemModel", itemModel.value);
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        ...itemModel.value
                    };

                    if (viewName.value == 'AddConfig') {
                        actionAddData(data);
                    } else if (viewName.value === 'EditConfig') {
                        actionEditData(data);
                    } else {
                        console.log(viewName.value);
                    }
                } else {
                    console.log('error submit!')
                    isLoading.value = false;
                }
            });
        };

        function actionAddData(data: any) {
            configApi
                .addConfig(data)
                .then((response: any) => {
                    if (response.data) {                        
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        context.emit('onChangeView', {
                            viewName: 'ListData',
                            data: null,
                        });                        
                    } else {
                        ElMessage.error(`Oops, ${response.message}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    isLoading.value = false;
                });
            isLoading.value = false;
        }

        function actionEditData(data: any) {
            const id = ref(props.viewSettings.dataItem.id);
            configApi
                .updateConfig(id.value, data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        context.emit('onChangeView', {
                            viewName: 'ListData',
                            data: null,
                        });
                    } else {
                        ElMessage.error(`Oops, ${response.message}`);
                    }
                    isLoading.value = false;
                })
                .catch((error) => {
                    console.error(error);
                    isLoading.value = false;
                });

            isLoading.value = false;

        }

        return {
            t,
            isLoading,
            itemModel,
            formRef,
            rules,
            menu,
            onSubmit
        };
    }
};