<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      v-loading="loading"
      node-key="id"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <el-button
              text
              type="primary"
              @click="openGoodsDialog(data)"
              size="small"
              class="mr-2"
              :loading="data.goodsDialogLoading"
              >推荐商品</el-button
            >

            <el-switch
              class="mr-2"
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="updateStatusChange($event, data)"
            />
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleAmend(data)"
              >修改</el-button
            >
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              title="是否要删除该分类？"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button text @click.stop type="primary" size="small"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <FormDialog
      ref="formDialogRef"
      :title="FormDialogTitle"
      @submit="handleSubmit"
      @done="closeDialog"
    >
      <el-form
        class="ml-10"
        label-position="left"
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <GoodsDialog ref="goodsDialog" />
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import {
  getCategorysList,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "~/api/category.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import ListHeader from "~/components/ListHeader.vue";
import FormDialog from "~/components/FormDialog.vue";
import GoodsDialog from "./components/GoodsDialog.vue";

const goodsDialog = ref(null);

const { loading, tableData, getData, updateStatusChange, handleDelete } =
  useInitTable({
    getList: getCategorysList,
    onGetListSuccess: (res) => {
      tableData.value = res.map((o) => {
        o.goodsDialogLoading = false;
        return o;
      });
    },
    updateStatus: updateCategoryStatus,
    delete: deleteCategory,
  });

const {
  formDialogRef,
  formRef,
  form,
  rules,
  FormDialogTitle,
  handleSubmit,
  handleCreate,
  handleAmend,
  closeDialog,
} = useInitForm({
  form: {
    name: "",
  },
  rules: {},
  getData,
  updateData: updateCategory,
  create: createCategory,
});

// 推荐产品
const openGoodsDialog = (data) => {
  goodsDialog.value.open(data);
};
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
:deep(.el-tree-node__content) {
  padding: 20px 0;
}
</style>
