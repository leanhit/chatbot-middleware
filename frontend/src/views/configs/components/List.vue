<script lang="ts" src="@/scripts/configs/components/list.ts"></script>

<template>
  <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
    <!-- header -->
    <div class="d-flex align-items-center justify-content-between">
      <div class="page-titles">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">{{ viewSettings.title }}</a>
          </li>
        </ol>
      </div>
      <div class="d-flex align-items-center">
        <div class="px-2 w-100">
          <el-button
            class="border-0 mx-1 my-1"
            size="default"
            type="primary"
            @click="$emit('onChangeView', { viewName: 'AddConfig', data: null })"            >
            <span class="ml-1">{{ t("Add Config") }}</span>
          </el-button>
          <el-button size="default" type="primary" @click="refreshDataFn()">
            <div>{{ t("Check") }}</div>
          </el-button>
        </div>
      </div>
    </div>

    <!-- body -->
    <div class="card">
      <div class="row">
        <div class="col-lg-12">
          <div class="card-body pt-0">            
            <div class="table-responsive rounded card-table">
              <table class="table table-striped table-head-fixed table-borderless w-100 fixed-table">
                <thead>
                  <tr>
                    <th style="width: 5%">{{ t("Index") }}</th>
                    <th style="width: 10%">{{ t("BotID") }}</th>
                    <th style="width: 10%">{{ t("Bot Name") }}</th>
                    <th style="width: 10%">{{ t("PageID") }}</th>
                    <th style="width: 10%">{{ t("App Secret") }}</th>
                    <!--<th style="width: 10%">{{ t("Bot Url") }}</th>
                    <th style="width: 10%">{{ t("Page Access Token") }}</t h>
                    <th style="width: 10%">{{ t("Fanpage Url") }}</th>
                    <th style="width: 10%">{{ t("Url Callback") }}</th>
                    <th style="width: 10%">{{ t("Verify Token") }}</th>-->
                    <th style="width: 10%">{{ t("Created At") }}</th>
                    <th style="width: 5%">{{ t("Action") }}</th>
                  </tr>
                </thead>
                <tbody v-if="listItems && listItems.length > 0">
                  <tr v-for="(itemData, itemIndex) in listItems" :key="itemIndex">
                    <td class="text-left">{{ itemIndex + 1 }}</td>
                    <td class="text-left text-truncate" :title="itemData.botpress_bot_id">
                      <span class="truncate-text">{{ itemData.botpress_bot_id }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.bot_name">
                      <span class="truncate-text">{{ itemData.bot_name }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.page_id">
                      <span class="truncate-text">{{ itemData.page_id }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.app_secret">
                      <span class="truncate-text">{{ itemData.app_secret }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.created_at">
                      <span class="truncate-text">{{ formatDateTime(itemData.created_at) }}</span>
                    </td>
                    <!--<td class="text-left text-truncate" :title="itemData.bot_url">
                      <span class="truncate-text">{{ itemData.bot_url }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.page_access_token">
                      <span class="truncate-text">{{ itemData.page_access_token }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.fanpage_url">
                      <span class="truncate-text">{{ itemData.fanpage_url }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.url_callback">
                      <span class="truncate-text">{{ itemData.url_callback }}</span>
                    </td>
                    <td class="text-left text-truncate" :title="itemData.verify_token">
                      <span class="truncate-text">{{ itemData.verify_token }}</span>
                    </td>-->
                    <td class="text-left">
                        <el-dropdown trigger="click" class="px-1">
                            <el-button type="primary">
                                <el-icon :size="15" style=" vertical-align: middle; ">
                                    <More />
                                </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <el-button class="border-0 mx-1 my-1" size="small"
                                                        :disabled="!(itemData)"
                                                        @click="$emit('onChangeView', { viewName: 'EditConfig', data: itemData, })">
                                                        <el-icon :size="15" style=" vertical-align: middle; ">
                                                            <Edit />
                                                        </el-icon>
                                                        <span class="ml-1">{{ t("Edit Config") }}</span>
                                                    </el-button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <el-button class="border-0 ml-1" size="small"
                                                        :disabled="!(itemData)"
                                                        @click="deleteConfig(itemData.id)">
                                                        <el-icon :size="15" class="text-danger"
                                                            style=" vertical-align: middle; ">
                                                            <Delete />
                                                        </el-icon>
                                                        <span class="ml-1 mr-1">{{ t("Delete Config")
                                                        }}</span>
                                                    </el-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td class="text-center py-5" colspan="11">
                      <strong>{{ t("There are no item") }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- pagination -->
    <div class="mt-2 d-flex justify-content-end">
      <el-pagination
        v-model:current-page="pagePagination.currentPage"
        v-model:page-size="pagePagination.pageSize"
        :page-sizes="[10, 15, 25, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagePagination.totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.fixed-table {
  table-layout: fixed;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.truncate-text {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
