<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
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
            title="是否要删除该公告？"
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
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" type="textarea" rows="5"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
  </el-card>
</template>
<script setup>
import {
  getNoticeList,
  increaseNotice,
  amendNotice,
  deleteNotice,
} from "~/api/notice.js";
import ListHeader from "~/components/ListHeader.vue";
import FormDialog from "~/components/FormDialog.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

const {
  tableData,
  total,
  currentPage,
  loading,
  limit,
  getData,
  handleDelete,
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice,
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
    title: "",
    content: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "公告标题不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "公告内容不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  updateData: amendNotice,
  create: increaseNotice,
});
</script>
