<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索s -->
    <search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <searchItem>
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入手机号/邮箱/会员名称"
          clearable
        ></el-input>
      </searchItem>
      <template #show>
        <searchItem label="会员等级">
          <el-select
            v-model="searchForm.user_level_id"
            placeholder="请选择会员等级"
            clearable
          >
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </searchItem>
      </template>
    </search>
    
    <ListHeader @create="handleCreate" @refresh="getData" />

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="会员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" width="250" align="center">
        <template #default="{ row }">
          <p v-if="row.last_login_time">最后登录： {{ row.last_login_time }}</p>
          <p>注册时间： {{ row.create_time }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
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
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <div v-else>
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
              title="是否要删除该用户？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
        <el-form-item label="用户名" style="width: 50%" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" style="width: 50%" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="名称" style="width: 50%" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级">
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" style="width: 50%" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" style="width: 50%" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDialog>
  </el-card>
</template>
<script setup>
import {
  getUserList,
  createUser,
  updateUserStatus,
  deleteUser,
  updateUserMessage,
} from "~/api/user";
import ListHeader from "~/components/ListHeader.vue";
import { ref } from "vue";
import FormDialog from "~/components/FormDialog.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import search from "~/components/search.vue";
import searchItem from "~/components/searchItem.vue";

const user_level = ref([]);
const {
  searchForm,
  resetSearchForm,
  tableData,
  total,
  currentPage,
  loading,
  limit,
  getData,
  handleDelete,
  updateStatusChange,
} = useInitTable({
  searchForm: {
    keyword: "",
    user_level_id: null,
  },
  getList: getUserList,
  delete: deleteUser,
  updateStatus: updateUserStatus,
  onGetListSuccess: (res) => {
    console.log(res);
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    user_level.value = res.user_level;
  },
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
    username: "",
    password: "",
    status: 1,
    nickname: "",
    phone: "",
    email: "",
    avatar: "",
    user_level_id: "",
  },
  getData,
  updateData: updateUserMessage,
  create: createUser,
});
</script>

