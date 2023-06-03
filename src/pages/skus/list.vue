<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader
      @create="handleCreate"
      @refresh="getData"
      @delete="handleMultiDelete"
      layout="create,delete,refresh"
    />
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      ref="multipleTableRef"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" width="380" />
      <el-table-column prop="order" label="排序" width="120" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :loading="row.statusLoading"
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.super == 1"
            @change="updateStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleAmend(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            width="220"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            title="是否要删除该规格？"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template></el-table-column
      >
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="total"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="getData"
      />
    </div>
    <FormDialog
      ref="formDialogRef"
      :title="FormDialogTitle"
      @submit="handleSubmit"
      @done="closeDialog"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import {
  getSkusList,
  createSkus,
  updateSkus,
  deleteSkus,
  updateSkusStatus,
} from "~/api/skus.js";
import TagInput from "~/components/Taginput.vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDialog from "~/components/FormDialog.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import { toast } from "~/composables/util";

const {
  tableData,
  total,
  currentPage,
  loading,
  limit,
  getData,
  handleDelete,
  updateStatusChange,
  handleMultiDelete,
  multipleTableRef,
  handleSelectionChange,
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkus,
  updateStatus: updateSkusStatus,
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
    status: 1,
    order: 50,
    default: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "角色名称不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "介绍一下自己吧",
        trigger: "blur",
      },
    ],
  },
  getData,
  updateData: updateSkus,
  create: createSkus,
});
</script>
<style scoped></style>
