<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
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
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="openSetRule(scope.row)"
            text
            >配置权限</el-button
          >
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" rows="5"></el-input>
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
    <!-- 权限配置 -->
    <FormDialog
      ref="setRuleFormDialogRef"
      title="权限配置"
      @submit="handleSetRuleSubmit"
      @done="closeDialog"
    >
      <el-tree-v2
        :check-strictly="checkStrictly"
        ref="elTreeRef"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="300"
        @check="handleTreeCheck"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template></el-tree-v2
      >
    </FormDialog>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import { getRuleList } from "~/api/rule";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  setRoleRules,
} from "~/api/role.js";
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
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus,
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
    desc: "",
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
  updateData: updateRole,
  create: createRole,
});

// 配置权限
const setRuleFormDialogRef = ref(null);

const ruleList = ref([]);
const roleId = ref(0);
// 当前用户拥有的权限Id
const ruleIds = ref([]);
const defaultExpandedKeys = ref([]);
const elTreeRef = ref(null);
const checkStrictly = ref(false);
const openSetRule = (row) => {
  roleId.value = row.id;
  checkStrictly.value = true;

  getRuleList(1).then((res) => {
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    setRuleFormDialogRef.value.open();

    // 当前用户拥有的权限ID
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value);
      checkStrictly.value = false;
    }, 150);
  });
};

const handleSetRuleSubmit = () => {
  setRuleFormDialogRef.value.showLoading();

  setRoleRules(roleId.value, ruleIds.value)
    .then((res) => {
      toast("配置成功", "success");
      getData();
      setRuleFormDialogRef.value.close();
    })
    .finally(setRuleFormDialogRef.value.hideLoading);
};
const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys];
};
</script>
