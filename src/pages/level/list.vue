<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="会员等级" align="center" />
      <el-table-column prop="discount" label="折扣率%" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />
      <el-table-column label="状态" width="100" align="center">
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
      <el-table-column label="操作" width="200" align="center">
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
            title="是否要删除该会员等级？"
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
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="desc">
          <el-input type="number" v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs mr-2">累计消费满</small>
            <el-input v-model="form.max_price" style="width: 50%" type="number">
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的累计消费必须大于等于0,单位：元
            </small>
          </div>
          <div>
            <small class="text-xs mr-2">累计次数满</small>
            <el-input v-model="form.max_times" style="width: 50%" type="number">
              <template #append>次</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的购买量必须大于等于0,单位：笔
            </small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)" prop="discount">
          <el-input v-model="form.discount" style="width: 50%" type="number">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex"
            >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
          </small>
        </el-form-item>
      </el-form>
    </FormDialog>
  </el-card>
</template>
<script setup>
import {
  getUserLevelList,
  createUserLevel,
  updateUserLevel,
  deleteUserLevel,
  updateUserLevelStatus,
} from "~/api/level.js";
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
  updateStatusChange,
} = useInitTable({
  getList: getUserLevelList,
  delete: deleteUserLevel,
  updateStatus: updateUserLevelStatus,
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
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0,
  },
  rules: {
    title: [
      {
        required: true,
        message: "会员等级名称不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  updateData: updateUserLevel,
  create: createUserLevel,
});
</script>
<style>
.el-input-group__append {
  box-shadow: 0 0 0 0 !important;
  background: white !important;
  padding: 0;
}
</style>
