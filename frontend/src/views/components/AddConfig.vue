<script
    lang="ts"
    src="@/scripts/components/addConfig.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <div class="d-flex align-items-center justify-content-between pb-3">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0)">{{ t("Config") }}</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100">
                    <el-button size="default" type="danger" class="d-none d-md-block"
                        @click="$emit('onChangeView', { viewName: 'ListData', data: null, })">
                        <div>Back</div>
                    </el-button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <el-form ref="formRef" :model="itemModel" :rules="rules" label-width="0" class="ruleForm">
                <div class="row">
                    <div class="col-12">
                    <div class="py-2 px-2" v-for="(label, key) in {
                        botpress_bot_id: 'Botpress Bot ID',
                        bot_name: 'Bot Name',
                        bot_url: 'Bot URL',
                        page_id: 'Page ID',
                        page_access_token: 'Page Access Token',
                        fanpage_url: 'Fanpage URL',
                        verify_token: 'Verify Token',
                        app_secret: 'App Secret'
                    }" :key="key">
                        <strong>{{ label }}</strong>
                        <el-form-item :prop="key">
                        <el-input v-model="itemModel[key]" size="large" :placeholder="label" />
                        </el-form-item>
                    </div>
                    </div>
                </div>
                </el-form>
            </div>
            <div class="card-footer">
                <div class="text-center py-3">
                    <el-button size="large" type="primary" class="mr-1 ml-1" @click="onSubmit(formRef)">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>{{ viewSettings.title }} </span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
img {
    max-width: 80%;
    height: auto;
}
</style>