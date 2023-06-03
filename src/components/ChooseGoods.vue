<template>
  <FormDialog
    ref="formDialog"
    @submit="handleSubmit"
    width="800px"
    title="商品选择"
    style="height: 470px"
  >
    <div>
      <el-input
        v-model="searchForm.title"
        placeholder="商品名称"
        size="large"
        style="width: 40%"
        clearable
      ></el-input>
      <el-button type="primary" class="ml-2" @click="getData" size="large" round
        >搜索</el-button
      >
    </div>

    <el-table
      height="262px"
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex">
            <el-image
              class="mr-3 rounded"
              :src="row.cover"
              fit="cover"
              :lazy="true"
              style="width: 50px; height: 50px"
            ></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <div>
                <p class="text-gray-400 text-xs mb-1">
                  分类：{{ row.category ? row.category.name : "未分类 " }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间：{{ row.create_time }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存" prop="stock" width="90" align="center">
      </el-table-column>
      <el-table-column label="价格（元 ）" width="150" align="center">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs"
            >￥{{ row.min_oprice }}</span
          ></template
        >
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-2">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="total"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="getData"
      />
    </div>
  </FormDialog>
</template>
<script setup>
import { ref } from "vue";
import { getGoodsList } from "~/api/goods.js";
import { useInitTable } from "~/composables/useCommon.js";
import SearchItem from "~/components/SearchItem.vue";
import FormDialog from "~/components/FormDialog.vue";

const formDialog = ref(null);
const callbackFunction = ref(null);
const open = (callback = null) => {
  callbackFunction.value = callback;
  formDialog.value.open();
};

const handleSubmit = () => {
  if (typeof callbackFunction.value === "function") {
    callbackFunction.value(multiSelectionIds.value);
  }
  formDialog.value.close();
};

const {
  searchForm,
  tableData,
  total,
  currentPage,
  loading,
  limit,
  getData,
  multipleTableRef,
  multiSelectionIds,
  handleSelectionChange,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  },
});
defineExpose({
  open,
});
</script>
<style>
.el-input__wrapper {
  border-radius: 25px !important;
}
</style>
