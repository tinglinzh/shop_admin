<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      v-loading="loading"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag size="small" :type="data.menu ? '' : 'info'">
            {{ data.menu ? "菜单" : "权限" }}</el-tag
          >
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component
          ></el-icon>
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <span @click.stop>
              <el-switch
                class="mr-2"
                :modelValue="data.status"
                :active-value="1"
                :inactive-value="0"
                @change="updateStatusChange($event, data)"
              />
            </span>
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleAmend(data)"
              class="mr-2"
              >修改</el-button
            >
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="addChild(data.id)"
              class="mr-2"
              >增加</el-button
            >

            <el-popconfirm
              title="是否要删除该记录？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button @click.stop text type="primary" size="small"
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
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="form.rule_id"
            :options="option"
            :props="{
              value: 'id',
              label: 'name',
              children: 'child',
              checkStrictly: true,
              emitPath: false,
            }"
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.meus" class="ml-4">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="0">权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            style="width: 30%"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item
          label="前端路由"
          prop="frontpath"
          v-if="form.menu == 1 && form.rule_id > 0"
        >
          <el-input
            placeholder="请输入前端路由"
            v-model="form.frontpath"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input
            placeholder="请输入后端规则"
            v-model="form.condition"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select
            class="m-2"
            v-model="form.method"
            placeholder="请选择请求方式"
          >
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import {
  getRuleList,
  createRule,
  updateRule,
  deleteRule,
  updateRuleStatus,
} from "~/api/rule.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import ListHeader from "~/components/ListHeader.vue";
import FormDialog from "~/components/FormDialog.vue";
import IconSelect from "~/components/IconSelect.vue";

const option = ref([]);
const defaultExpandedKeys = ref([]);

const { loading, tableData, getData, updateStatusChange, handleDelete } =
  useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
      option.value = res.rules;
      tableData.value = res.list;
      defaultExpandedKeys.value = res.list.map((o) => o.id);
    },
    updateStatus: updateRuleStatus,
    delete: deleteRule,
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
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: "",
  },
  rules: {},
  getData,
  updateData: updateRule,
  create: createRule,
});

// 添加子分类
const addChild = (id) => {
  handleCreate();
  form.rule_id = id;
  form.status = 1;
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
